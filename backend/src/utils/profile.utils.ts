import pdf from 'pdf-parse';

export const readTextFromPdfFile = async (file: File): Promise<string> => {
  try {
    const pdfBuffer = await convertFileToBuffer(file)
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.log(error);
    throw new Error('Could not read the PDF data')
  }
}

/**
 * Turning the pdf file into a readable buffer
 * 
 * @param file The file you want to convert
 * @returns {Promise<Buffer>}
 */
const convertFileToBuffer = (file: File): Promise<Buffer> => {
  console.log("Converting to buffer...")
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const buffer = Buffer.from(arrayBuffer)
      resolve(buffer);
    }
    reader.onerror = (error) => {
      reject(error);
    }
    reader.readAsArrayBuffer(file);
  })
}

