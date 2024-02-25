import { PdfReader } from "pdfreader";

export const parsePdf = async (path) => {
  return new Promise((resolve, reject) => {
    new PdfReader().parseFileItems(path, async (err, item) => {
      if (err) {
        console.error("parsePdf() => ", err.message);
        reject(err.message);
      } else if (!item) {
        console.warn("parsePdf() => end of file!");
        reject("end of file!");
      } else if (item.text) {
        resolve(item.text);
      }
    });
  });
};
