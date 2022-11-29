import { ErrorCorrectLevel } from "./utils/ErrorCorrectLevel";
import { QRCode } from "./utils/QRCode";

export const QRCodeGenerator = function (text: string, size: number = 256) {
  const qrcode = new QRCode;
  qrcode.addData(text);
  qrcode.make();

  const canvas = document.createElement('canvas');
  canvas.height = canvas.width = size;
  const ctx = canvas.getContext('2d')!;

  let tileW;
  const tileH = tileW = (size / qrcode.getModuleCount());

  for (var row = 0; row < qrcode.getModuleCount(); row++) {
    for (var col = 0; col < qrcode.getModuleCount(); col++) {
      ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
      var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
      var h = (Math.ceil((row + 1) * tileH) - Math.floor(row * tileH));
      ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
    }
  }

  // destroy qrcode
  for (var property in qrcode) {
    qrcode[property] = undefined;// null;
  }

  return canvas.toDataURL("image/png");
}