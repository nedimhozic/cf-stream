import negotiate from "./negotiate.js";

/**
 * Publishes a live video/audio stream using WHIP (WebRTC HTTP Ingest Protocol)
 * @param {string} endpoint - Cloudflare WHIP endpoint
 * @param {HTMLVideoElement} videoElement - DOM element to preview your camera
 */
export async function startWebRTCStream(endpoint, videoElement) {
  // Create a new WebRTC connection with Cloudflare's public STUN server
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }],
    bundlePolicy: "max-bundle",
  });

  // Ask the browser for camera and microphone access
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  // Add each media track to the connection as a transceiver set to 'sendonly'
  stream.getTracks().forEach((track) => {
    const transceiver = peer.addTransceiver(track, { direction: "sendonly" });

    // If it's a video track, apply resolution constraints
    if (track.kind === "video") {
      transceiver.sender.track?.applyConstraints({
        width: 1280,
        height: 720,
      });
    }
  });

  // Preview your local stream in the UI
  videoElement.srcObject = stream;

  // When negotiation is needed, start the offer/answer exchange
  peer.addEventListener("negotiationneeded", async () => {
    console.log("[WHIP] Negotiation starting...");
    await negotiate(peer, endpoint);
    console.log("[WHIP] Negotiation complete");
  });

  // Return the peer and a stop() method to end the stream
  const stop = async () => {
    await fetch(endpoint, { method: "DELETE", mode: "cors" }); // Notify server to close session
    peer.close(); // Close WebRTC connection
    stream.getTracks().forEach((t) => t.stop()); // Stop using camera and mic
  };

  return { peer, stream, stop };
}
