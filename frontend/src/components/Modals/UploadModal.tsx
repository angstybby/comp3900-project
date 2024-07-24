import { useState, ChangeEvent, FormEvent } from 'react';
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

interface UploadModalProps {
  isVisible: boolean;
  close: () => void;
  refetchData: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isVisible, close, refetchData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [scrapedText, setScrapedText] = useState<string[]>([]);
  

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append('pdfUpload', file);
      setLoading(true);
      try {
        const response = await axiosInstanceWithAuth.post('profile/scrape-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setScrapedText(response.data);
      } catch (error) {
        console.error('Error uploading file', error);
      }
      setLoading(false);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    if (!selectedFile) {
      throw new Error('No file selected');
    }
    formData.append('pdfUpload', selectedFile);
    const scrapedTextJson = JSON.stringify(scrapedText);
    formData.append('scrapped', scrapedTextJson);
    setLoading(true);
    
    try {

      const [response1, response2] = await Promise.all([
        axiosInstanceWithAuth.post('/profile/upload-transcript', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
        axiosInstanceWithAuth.post('/profile/add-courses-from-pdf', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      ]);

      if (response1.status === 200) {
        console.log('Transcript uploaded successfully');
      } else {
        console.error('Error uploading transcript', response1.statusText);
      }
    
      if (response2.status === 200) {
        console.log('Courses added successfully');
        refetchData();
        close();
      } else {
        console.error('Error adding courses', response2.statusText);
      }
    } catch (error) {
      console.error('Error during processing', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isVisible}
      as="div"
      className="relative z-[100] focus:outline-none transition duration-150 ease-out"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30 transition" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex flex-wrap min-h-full items-center justify-center p-6">
          <DialogPanel className="w-full max-w-2xl rounded-xl bg-white/60 p-6 px-8 backdrop-blur-2xl duration-150 ease-out">
            <DialogTitle className='mb-5'>
              <p className='font-bold text-2xl'>Upload Transcript</p>
            </DialogTitle>
            <form className="space-y-4" onSubmit={handleUpload}>
              <div className="text-left">
                <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                  Upload PDF:
                </label>
                <p>
                  Please Upload a .pdf file, e.g Academic Transcript:
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('pdfUpload')?.click()}
                    className="w-full py-2 px-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  >
                    Upload PDF
                  </button>
                  <input
                    id="pdfUpload"
                    name="pdfUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="mt-6 text-left">
                <p>Selected file: {selectedFile?.name}</p>
              </div>
              <div className="mt-15 flex justify-end">
                <div className="w-1/6">
                  {loading ? <ButtonLoading /> : <ButtonSubmit text="Next" />}
                </div>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadModal;
