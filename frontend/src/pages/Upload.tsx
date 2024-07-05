import ButtonSubmit from "@/components/ButtonSubmit";
import TextArea from "@/components/TextArea";
import { useState, ChangeEvent, FormEvent } from 'react';
import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonLoading from "@/components/ButtonLoading";
import { useNavigate } from "react-router-dom";


export default function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    if (selectedFile === null) {
      throw new Error('No file selected');
    }
    formData.append('pdfUpload', selectedFile);

    setLoading(true);
    try {
      const response = await axiosInstanceWithAuth.post('/profile/upload-transcript', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      )

      if (response.status === 200) {
        setLoading(false);
        console.log('File uploaded successfully');
        navigate('/courseRecommendations');
      } else {
        setLoading(false);
        console.error('Error uploading file');

      }
    } catch (error) {
      console.error('Error uploading file', error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-screen justify-center items-center px-6 py-2 lg:px-8">
        <div className="w-full max-w-xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Thank you for signing up! <br></br> Please add all the courses you have done so far or <b>upload your transcript </b>
            to auto-fill the courses.
          </h2>

          <div className="mt-8">
            <form className="max-w-l mx-auto space-y-4" onSubmit={handleUpload}>
              <div>
                <label htmlFor="coursesDone" className="block text-lg font-medium leading-6 text-gray-900">
                  Courses Done
                </label>
                <div className="mt-2">
                  <TextArea id="coursesDone" name="coursesDone" autoComplete="coursesDone" placeholder="Example: COMP1511" />
                </div>
              </div>
              <div>
                <label htmlFor="OrLabel" className="block text-lg text-center font-medium leading-6 text-gray-900">
                  OR
                </label>
              </div>

              <div className="text-left">
                <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                  Upload PDF:
                </label>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('pdfUpload')?.click()}
                    className="w-full py-2 px-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  >
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
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
          </div>

        </div >
      </div >
    </>
  );
}