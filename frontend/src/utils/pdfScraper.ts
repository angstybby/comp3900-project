import pdf from 'pdf-parse';

const readTextFromPdfBuffer = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.log(error);
    throw new Error('Could not read the PDF data')
  }
}

export default readTextFromPdfBuffer;