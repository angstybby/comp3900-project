import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
import React from "react";

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
);
const CourseCharts: React.FC<{
  skillLabels: string[];
  skillLevels: string[];
}> = ({ skillLabels, skillLevels }) => {
  console.log(skillLabels, skillLevels);
  const radarData = {
    labels: skillLabels,
    datasets: [
      {
        label: "Skill Importance",
        data: skillLevels,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    responsive: true,
  };

  return (
    <div className="flex">
      <Radar data={radarData} options={radarOptions}></Radar>
    </div>
  );
};

export default CourseCharts;
