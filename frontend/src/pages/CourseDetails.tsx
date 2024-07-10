import { axiosInstanceWithAuth } from "@/api/Axios";
import ButtonLoading from "@/components/Buttons/ButtonLoading";
import ButtonSubmit from "@/components/Buttons/ButtonSubmit";
import { ChangeEvent, FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * This entire page is a stub! Just used to test functionality
 */

const CourseDetails = () => {
  let { courseCode } = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState<string | null>();
  const [skills, setSkills] = useState<string[]>([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setSelectedFile(file);
      const formData = new FormData().append('pdfUpload', file);
      try {
        const response = await axiosInstanceWithAuth.post('/course/parse-outline', 
          formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setSummary(response.data.summary);
        setSkills(response.data.skills
          .split('- ')
          .map((skill: string) => skill
          .trim()));
      } catch (error) {
        console.error('Error uploading file', error);
      }
      setLoading(false);
    }
  }

  const resetPage = async (event: FormEvent) => {
    event.preventDefault();
    window.location.reload();
  }

  return (
    <>
      <div className="px-10 py-5">
        <p className="mt=8 text-2xl font-bold mb-5">{`CourseDetails for ${courseCode}`}</p>
        
        <form className="max-w-l mx-auto space-y-4" onSubmit={resetPage}>
          <div className="text-left">
            <label htmlFor="pdfUpload" className="block text-lg font-medium leading-6 text-gray-900">
              Upload Course Outline:
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
              {loading ? <ButtonLoading /> : <ButtonSubmit text="Reset" />}
            </div>
          </div>
        </form>
        <p className="font-bold mt-3">
          Course Summary:
        </p>
        <p className="mt-3">
          {summary ? summary : 'No summary found for this course'}
        </p>
        <p className="font-bold mt-5">
          Skills Learned:
        </p>
        <p className="mt-3">
          {skills.length > 0 ? 
          (
            skills.filter(skill => skill).map((skill, index) => (
              <p key={index} className="">{`\u2022 ${skill}`}</p>
            ))
          )
          : 
          'No skills found for this course'}
        </p>
      </div>    
    </>
  )
}

export default CourseDetails