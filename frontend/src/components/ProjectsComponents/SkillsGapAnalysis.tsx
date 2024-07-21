import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ProjectGroupOptions from "./ProjectGroupOptions";
import { axiosInstanceWithAuth } from "@/api/Axios";

interface SkillsGapAnalysisProps {
  projectId: number;
}

interface Skill {
  id: number;
  skillName: string;
  createdAt: Date;
}

export default function SkillsGapAnalysis({
  projectId,
}: SkillsGapAnalysisProps) {
  const [projectSkills, setProjectSkills] = useState<Skill[]>([]);
  const [studentSkills, setStudentSkills] = useState<Skill[]>([]);
  const [groupId, setGroupId] = useState<number>(-1);
  const [skillsGap, setSkillsGap] = useState<Skill[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const chooseOptions = (value: number) => {
    setGroupId(value);
  };

  useEffect(() => {
    if (groupId != -1) {
      axiosInstanceWithAuth
        .post("/skills/gap-analysis", { groupId, projectId })
        .then((res) => {
          setProjectSkills(res.data.projectSkills);
          setStudentSkills(res.data.matchingSkills);
          setSkillsGap(res.data.unmatchedSkills);
          console.log(res.data);
        });
    }
  }, [groupId]);

  useEffect(() => {
    if (chartRef.current && skillsGap.length > 0) {
      const chartInstance = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Skills Lacking", "Skills Possessed"],
          datasets: [
            {
              label: "Skills Gap Analysis",
              data: [skillsGap.length, projectSkills.length - skillsGap.length],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Skills Gap Analysis",
            },
          },
        },
      });
      return () => {
        chartInstance.destroy();
      };
    }
  }, [skillsGap]);

  return (
    <div>
      <div>
        <h1>Please choose a group</h1>
        <ProjectGroupOptions chooseOptions={chooseOptions} />
      </div>
      {groupId == -1 ? (
        <></>
      ) : (
        <div>
          <h1 className="text-xl font-semibold pt-4">
            Your skills analysis for this project
          </h1>
          <div className="mt-8 flex">
            <canvas ref={chartRef} />
          </div>
          <div className="flex mt-8">
            <div className="mr-4">
              <h2 className="font-semibold">Skills Required:</h2>
              <ul>
                {projectSkills.map((skill, index) => (
                  <li key={`project-${skill.id}-${index}`}>
                    {skill.skillName}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mr-4">
              <h2 className="font-semibold">Skills Possessed:</h2>
              <ul>
                {studentSkills.map((skill, index) => (
                  <li key={`student-${skill.id}-${index}`}>
                    {skill.skillName}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mr-4">
              <h2 className="font-semibold">Skills Lacking:</h2>
              <ul>
                {skillsGap.map((skill, index) => (
                  <li key={`gap-${skill.id}-${index}`}>{skill.skillName}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
