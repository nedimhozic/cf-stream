# 🎥 Cloudflare Stream + WebRTC (WHIP/WHEP) Demo

This is a minimal demo project showing how to stream live video to [Cloudflare Stream](https://developers.cloudflare.com/stream/) using **WHIP** (WebRTC HTTP Ingest Protocol), and play it back using **WHEP** (WebRTC HTTP Egress Protocol)—all with native JavaScript in the browser.

---

## 📦 Project Structure

```

.
├── index.html # Basic HTML UI with two <video> elements
├── whipService.js # Starts a WebRTC stream (WHIP)
├── whepService.js # Plays a WebRTC stream (WHEP)
├── negotiate.js # Shared SDP negotiation logic

```

---

## 🚀 Getting Started

You **must** serve this project using a local HTTP server. Browsers block ES module imports when opened via `file://`.

### Option 1: With Python

```bash
# Navigate to the project folder
cd path/to/this/project

# Start local HTTP server on port 3000
python3 -m http.server 3000
```

Then open your browser at:

```
http://localhost:3000
```

---

### Option 2: With Node.js (`serve`)

```bash
# Install the serve package globally if you don't have it yet
npm install -g serve

# Start the server
serve .
```

---

### Option 3: With VS Code Live Server

1. Install the **Live Server** extension.
2. Open this folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

---

## ✏️ How to Use

- Edit `index.html` and replace the WHIP/WHEP URLs with your own from Cloudflare Stream:

  ```js
  const whipUrl =
    "https://customer-{customerId}.cloudflarestream.com/{liveInputId_longer}/webRTC/publish";
  const whepUrl =
    "https://customer-{customerId}.cloudflarestream.com/{liveInputId}/webRTC/play";
  ```

- You’ll see two video elements:
  - One shows your local webcam feed (WHIP).
  - The other plays the remote stream (WHEP).

---

## 📚 Resources

- [Cloudflare Stream: Live Input](https://developers.cloudflare.com/stream/stream-live/start-stream-live/)
- [WHIP/WHEP IETF Drafts](https://www.ietf.org/archive/id/draft-ietf-wish-whip-01.html)
- [WebRTC Guide on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

## 🧠 Next Steps

This is a foundation. You could:

- Add a stop/start toggle button
- Show connection status or debug info
- Extend with WebSocket/SignalR for multi-user calls (coming soon 👀)

---
