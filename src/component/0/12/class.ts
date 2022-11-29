import { ErrorCorrectLevel } from "./utils/ErrorCorrectLevel";
import { QRCode } from "./utils/QRCode";

export class QRCodeGenerator2 {
  constructor(text: string, size: number = 256) {
    const qrcode = new QRCode;

    qrcode.setTypeNumber(-1);
    qrcode.setErrorCorrectLevel(ErrorCorrectLevel.H);
    qrcode.addData(text);
    qrcode.make();

    const canvas = document.createElement('canvas');
    canvas.height = canvas.width = size;
    const ctx = canvas.getContext('2d');

    let tileW;
    const tileH = tileW = (size / qrcode.getModuleCount());
  }
}