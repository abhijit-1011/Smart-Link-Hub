// qr.js
// Generate QR code for current hub

import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";

const qrContainer = document.getElementById("qr-code");

// get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  qrContainer.innerText = "Invalid hub slug";
} else {
  const hubUrl = `${window.location.origin}/hub.html?slug=${slug}`;

  QRCode.toCanvas(hubUrl, { width: 200 }, function (err, canvas) {
    if (err) {
      console.error(err);
      qrContainer.innerText = "Failed to generate QR";
      return;
    }
    qrContainer.appendChild(canvas);
  });
}
