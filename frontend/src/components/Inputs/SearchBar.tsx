import { axiosInstanceWithAuth } from "@/api/Axios";
import { ChangeEvent } from "react";

const SearchBar = () => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    axiosInstanceWithAuth.get(`api/course/search?query=${e.target.value}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Failed to search for courses:', error);
      });
  }

  return (
    <div className='flex w-full mb-5 items-center bg-white dark:bg-gray-900 rounded duration-150'>
      <input
        type='text'
        name='query'
        className='block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6 duration-150'
        placeholder='Search for a course e.g. COMP1511'
        autoComplete='off'
        onChange={handleOnChange}
        disabled={false}
      />
    </div>
  )
}

export default SearchBar