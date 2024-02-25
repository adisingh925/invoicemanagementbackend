import { PdfReader } from "pdfreader";

export const parsePdf = (path) => {
  new PdfReader().parseFileItems(path, (err, item) => {
    if (err) {
      console.error("parsePdf() => ", err.message);
      return -1;
    } else if (!item) {
      console.warn("parsePdf() => end of file!");
      return -1;
    } else if (item.text) {
      console.log("parsePdf() => " + item.text);
      return item.text;
    }
  });
};
