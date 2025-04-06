import negotiate from "./negotiate.js";

/**
 * Plays a live stream using WHEP (WebRTC HTTP Egress Protocol)
 * @param {string} endpoint - Cloudflare WHEP endpoint
 * @param {HTMLVideoElement} videoElement - DOM element to play the stream
 */
export async function startWebRTCPlayback(endpoint, videoElement) {
  // Create a new WebRTC connection
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.cloudflare.com:3478" }],
    bundlePolicy: "max-bundle",
  });

  // Prepare to receive audio and video tracks
  peer.addTransceiver("video", { direction: "recvonly" });
  peer.addTransceiver("audio", { direction: "recvonly" });

  // Create a media stream to attach received tracks to
  const stream = new MediaStream();

  // Add tracks to the media stream when they arrive
  peer.ontrack = (event) => {
    if (!stream.getTracks().some((t) => t.kind === event.track.kind)) {
      stream.addTrack(event.track);
    }
  };

  // When connection is ready, attach the media stream to the video element
  peer.onconnectionstatechange = () => {
    if (peer.connectionState === "connected" && !videoElement.srcObject) {
      videoElement.srcObject = stream;
    }
  };

  // Start negotiation when ready
  peer.addEventListener("negotiationneeded", async () => {
    console.log("[WHEP] Negotiation starting...");
    await negotiate(peer, endpoint);
    console.log("[WHEP] Negotiation complete");
  });

  // Return the peer and stream for optional handling
  return { peer, stream };
}
