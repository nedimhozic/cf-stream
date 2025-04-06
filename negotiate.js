/**
 * Handles the SDP offer/answer exchange between a WebRTC peer and the Cloudflare endpoint.
 * Used by both WHIP (streamer) and WHEP (player).
 */
export default async function negotiate(peer, endpoint) {
  // Create an SDP offer describing what this peer wants to send or receive
  const offer = await peer.createOffer();

  // Set the offer as the local description (what we are proposing to do)
  await peer.setLocalDescription(offer);

  // Wait for ICE (Interactive Connectivity Establishment) gathering to complete
  // This gathers all the network paths we can use (e.g. IPs, ports)
  const finalOffer = await waitForIce(peer);

  // Try to send our SDP offer and wait for an answer
  while (peer.connectionState !== "closed") {
    const response = await sendOffer(endpoint, finalOffer.sdp);

    if (response.status === 201) {
      // If the server accepted, read the SDP answer and apply it
      const answer = await response.text();
      await peer.setRemoteDescription({ type: "answer", sdp: answer });

      // Return the 'Location' header, which contains the session URL (used to later DELETE/close the stream)
      return response.headers.get("Location");
    } else if (response.status === 405) {
      console.error("[WHIP/WHEP] Bad endpoint URL or incorrect HTTP method");
    } else {
      // Show any server errors
      console.error(await response.text());
    }

    // Retry every 5 seconds if it fails (e.g. endpoint not ready yet)
    await new Promise((r) => setTimeout(r, 5000));
  }
}

async function sendOffer(endpoint, sdp) {
  return await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/sdp",
    },
    body: sdp,
  });
}

function waitForIce(peer) {
  return new Promise((resolve) => {
    // Give ICE 1 second to complete (works well for most use cases)
    setTimeout(() => resolve(peer.localDescription), 1000);

    // Or resolve earlier if ICE finishes before the timeout
    peer.onicegatheringstatechange = () => {
      if (peer.iceGatheringState === "complete") {
        resolve(peer.localDescription);
      }
    };
  });
}
