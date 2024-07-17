import { useProfile } from "@/contexts/ProfileContext";
import { useEffect } from "react";
import SkillsGapAnalysis from "@/components/ProjectsComponents/SkillsGapAnalysis";
import { useParams } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const { profileData, fetchProfileData } = useProfile();

  //stub
  const project = {
    id: projectId,
    name: `Project Name ${projectId}`,
    description: "Lorem ipsum dolor sit amet bla blah bla this is a stub",
  };

  useEffect(() => {
    if (profileData.zid) {
      // to fetch student's data
    }
  })

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (

    <div className="p-14">
      <h1 className="text-4xl font-medium">{project.name}</h1>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Description</h2>
        <p className="mt-4 text-lg">{project.description}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Skills Gap Analysis</h2>
        <SkillsGapAnalysis/>
      </div>
    </div>
  )
}

export default ProjectDetails