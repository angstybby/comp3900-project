import PDFParser from "pdf2json";

const pdfParser = new PDFParser(null, true);

export const parsePdfBuffer = (buffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(errData.parserError);
      });
  
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      });
  
      pdfParser.parseBuffer(buffer);
    });
  };