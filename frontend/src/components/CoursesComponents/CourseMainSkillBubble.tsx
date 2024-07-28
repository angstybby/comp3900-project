const CourseMainSkillBubble = ({skill} : {skill: string}) => {
  return (
    <div className='select-none text-black text-nowrap w-fit text-xs lg:text-sm font-medium py-1 px-3 rounded-full mr-2 mb-2 bg-yellow-200 text-center flex align-middle'>
      <p className="self-center">
        {skill}
      </p>
    </div>
  )
}

export default CourseMainSkillBubble