import { useState } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function svgToPng(svgElement, callback) {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svgRect = svgElement.getBoundingClientRect();
  canvas.width = svgRect.width;
  canvas.height = svgRect.height;

  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngData = canvas.toDataURL("image/png");
    callback(pngData);
  };

  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  img.src = svgUrl;
}

function App() {
  const [value, setValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [whiteBorder, setWhiteBorder] = useState(true);

  return (
    <div className="App">
      <header className="head">qr code generator</header>

      <div className="body">
        <input
          className="input"
          placeholder="input / url"
          onChange={(e) => setValue(e.target.value)}
        />
        <label>
          <input
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            type="color"
          />
          background color
        </label>
        <label>
          <input
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            type="color"
          />
          stroke color
        </label>

        <label>
          <input
            value={whiteBorder}
            checked={whiteBorder}
            onChange={() => setWhiteBorder(!whiteBorder)}
            type="checkbox"
          />
          white border
        </label>

        <div
          id="qr"
          className={`qr-container ${whiteBorder ? "white-border" : ""}`}
        >
          <QRCode
            size={256}
            style={{
              backgroundColor: `#${bgColor}`,
              height: "auto",
              width: "100%",
            }}
            value={value}
            viewBox={`0 0 256 256`}
            fgColor={qrColor}
            bgColor={bgColor}
          />
        </div>

        <button
          onClick={async () => {
            const svgElement = document.querySelector("svg");

            svgToPng(svgElement, (pngDataUrl) => {
              const link = document.createElement("a");
              link.download = "image.png";
              link.href = pngDataUrl;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          }}
        >
          download
        </button>
      </div>
    </div>
  );
}

export default App;
