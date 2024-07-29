import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ProjectGroupOptions from "./ProjectGroupOptions";
import { axiosInstanceWithAuth } from "@/api/Axios";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

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
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "left",
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
      <div className="flex">
        <ProjectGroupOptions chooseOptions={chooseOptions} />
      </div>
      {groupId == -1 ? (
        <></>
      ) : (
        <div>
          <div className="flex md:flex-row flex-col md:items-center items-start gap-5">
            <div className="flex flex-row w-full lg:w-1/3 md:w-1/2">
              <div className=" md:h-60 w-full">
                <canvas ref={chartRef} />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <div className="mr-4 flex flex-row gap-1 items-center">
                <CheckCircleIcon className="text-green-400 w-5 h-5" />
                <h2 className="font-normal">{studentSkills.length} {studentSkills.length === 1 ? "Skill" : "Skills"} on the group:</h2>
                {/* comma seperated */}
                <h2 className="font-semibold">
                  {studentSkills.map((skill) => skill).join(", ")}
                </h2>
              </div>
              <div className="mr-4 flex flex-row gap-1 items-center">
                <ExclamationCircleIcon className="text-black w-5 h-5" />
                <h2 className="font-normal">{skillsGap.length} {skillsGap.length === 1 ? "Skill" : "Skills"} missing from the group:</h2>
                <h2 className="font-semibold">
                  {skillsGap.map((skill) => skill).join(", ")}
                </h2>
              </div>
            </div>
          </div>

        </div>
      )
      }
    </div >
  );
}
