export function generateTokenIconSVG(text, options = {}) {
    const { width = 200, height = 200, fontColor = "white", fontFamily = "Arial", backgroundColors = [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6",
        "#1abc9c",
        "#e67e22",
    ], } = options;
    let fontSize;
    const length = text.length;
    if (length === 1)
        fontSize = 150;
    else if (length === 2)
        fontSize = 120;
    else if (length === 3)
        fontSize = 80;
    else if (length <= 6)
        fontSize = 48;
    else
        fontSize = 32;
    const bgColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${bgColor}" rx="16" />
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-size="${fontSize}" fill="${fontColor}" font-family="${fontFamily}">
          ${text}
        </text>
      </svg>
    `.trim();
    return svg;
}
export function svgToBase64(svg) {
    // 去除换行和多余空白，避免编码异常
    const cleanedSvg = svg
        .replace(/\n+/g, "")
        .replace(/\t+/g, "")
        .replace(/\s{2,}/g, " ");
    // 浏览器环境
    if (typeof window !== "undefined" && window.btoa) {
        // btoa 只能编码 ASCII，需要先把 Unicode 转成 UTF-8
        const utf8Svg = unescape(encodeURIComponent(cleanedSvg));
        const base64 = window.btoa(utf8Svg);
        return `data:image/svg+xml;base64,${base64}`;
    }
    // Node.js 环境
    if (typeof Buffer !== "undefined") {
        const base64 = Buffer.from(cleanedSvg, "utf-8").toString("base64");
        return `data:image/svg+xml;base64,${base64}`;
    }
    throw new Error("No Base64 encoding method available.");
}
