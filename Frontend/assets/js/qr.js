// qr.js
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";

const qrContainer = document.getElementById("qr-code");

// get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

if (!slug) {
  qrContainer.innerText = "Invalid hub slug";
} else {
  const hubUrl = `${window.location.origin}/hub.html?slug=${slug}`;

  // Generate QR code
  QRCode.toCanvas(hubUrl, { width: 200 }, function (err, canvas) {
    if (err) {
      console.error(err);
      qrContainer.innerText = "Failed to generate QR";
      return;
    }

    // Add QR canvas to container
    qrContainer.appendChild(canvas);

    // ✅ Add download button below canvas
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download QR";
    downloadBtn.style.marginTop = "10px";
    downloadBtn.style.padding = "6px 12px";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.background = "#16a34a";
    downloadBtn.style.color = "#fff";
    downloadBtn.style.border = "none";
    downloadBtn.style.borderRadius = "5px";

    downloadBtn.onclick = () => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${slug}-hub.png`;
      link.click();
    };

    qrContainer.appendChild(downloadBtn);
  });
}
