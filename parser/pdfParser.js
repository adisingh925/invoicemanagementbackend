import { PdfReader } from "pdfreader";

export const parsePdf = async (path) => {
  return new Promise((resolve, reject) => {
    const textItems = [];

    new PdfReader().parseFileItems(path, async (err, item) => {
      if (err) {
        console.error("parsePdf() => ", err.message);
        reject(err.message);
      } else if (!item) {
        console.warn("parsePdf() => end of file!");
        resolve(textItems.join(" "));
      } else if (item.text) {
        textItems.push(item.text);
      }
    });
  });
};
