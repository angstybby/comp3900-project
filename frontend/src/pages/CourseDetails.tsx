import { useParams } from "react-router-dom"

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();

  //stub
  const course = {
    id: courseId,
    name: `Course Name ${courseId}`,
    description: "Lorem ipsum dolor sit amet bla blah bla this is a stub",
    skills: [
      "Skill 1",
      "Skill 2",
      "Skill 3",
      "Skill 4",
    ]
  };

  return (
    <div className="p-14">
      <h1 className="text-4xl font-medium">{course.name}</h1>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Description</h2>
        <p className="mt-4 text-lg">{course.description}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Skills</h2>
        <ul className="mt-4 list-disc list-inside text-lg">
          {course.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CourseDetails