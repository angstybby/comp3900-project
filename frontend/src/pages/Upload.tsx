import ButtonPrimary from "../components/ButtonPrimary";
import Textbox from "../components/Textbox";
import React, { useState, ChangeEvent } from 'react';


export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <>
      <div className="flex min-h-screen justify-center items-center px-6 py-20 lg:px-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Thank you for signing up! Please add all the courses you have done so far or upload your transcript
            to auto-fill the courses.
          </h2>

          <div className="mt-8">
            <form className="max-w-lg mx-auto space-y-4" action="#" method="POST">
              <div>
                <label htmlFor="coursesDone" className="block text-lg font-medium leading-6 text-gray-900">
                  Courses Done
                </label>
                <div className="mt-2 placeholder = text">
                  <Textbox id="coursesDone" name="coursesDone" type="text" autoComplete="coursesDone" placeholder="Enter courses done..."/>
                </div>
              </div>
              <div>
                <label htmlFor="OrLabel" className="block text-lg text-center font-medium leading-6 text-gray-900">
                  OR
                </label>
              </div>


              <div className="text-center">
                <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
                  Upload PDF
                </label>
                <div className="mt-2">
                  <input
                    id="pdfUpload"
                    name="pdfUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p>Selected file: {selectedFile?.name}</p>
              </div>


              <div className="mt-4">
                <ButtonPrimary text="Next" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
    );
  }