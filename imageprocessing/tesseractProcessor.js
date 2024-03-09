import { createWorker } from "tesseract.js";

export const parseImage = async (filePath) => {
  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(filePath);
    await worker.terminate();
    return ret.data.text;
  } catch (error) {
    console.error("parseImage() => " + error.message);
  }
};
