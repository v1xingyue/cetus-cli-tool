export function patch492thByte(base64Input: string, newValue: number): string {
  if (newValue < 0 || newValue > 255) {
    throw new Error("newValue must be between 0 and 255");
  }

  let byteArray: Uint8Array;

  // Decode base64 to Uint8Array
  if (typeof Buffer !== "undefined") {
    // Node.js
    byteArray = Uint8Array.from(Buffer.from(base64Input, "base64"));
  } else if (typeof atob !== "undefined") {
    // Browser
    const binaryStr = atob(base64Input);
    byteArray = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      byteArray[i] = binaryStr.charCodeAt(i);
    }
  } else {
    throw new Error("Base64 decoding not supported in this environment");
  }

  if (byteArray.length <= 492) {
    throw new Error("Input is too short. Needs at least 493 bytes.");
  }

  // Modify byte at position 492
  byteArray[492] = newValue;

  // Encode back to base64
  if (typeof Buffer !== "undefined") {
    // Node.js
    return Buffer.from(byteArray).toString("base64");
  } else {
    // Browser
    let binaryStr = "";
    for (let i = 0; i < byteArray.length; i++) {
      binaryStr += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryStr);
  }
}
