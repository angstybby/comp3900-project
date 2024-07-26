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
const CourseCharts: React.FC<{ skillLabels: string[]; skillLevels: string[] }> = ({
  skillLabels,
  skillLevels,
}) => {
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
    options: {
      responsive: false,
    },
  };

  return (
    <div className="flex">
      <Radar data={radarData}></Radar>
    </div>
  );
};

export default CourseCharts;
