import { PdfReader } from "pdfreader";

export const parsePdf = (path) => {
  new PdfReader().parseFileItems(path, (err, item) => {
    if (err) console.error("parsePdf() => ", err.message);
    else if (!item) console.warn("parsePdf() => end of file!");
    else if (item.text) console.log("parsePdf() => " + item.text);
  });
};
