import PDFParser from "pdf2json";

export const parsePdfBuffer = (buffer: Buffer): Promise<string> => {
    const pdfParser = new PDFParser(null, true);

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
