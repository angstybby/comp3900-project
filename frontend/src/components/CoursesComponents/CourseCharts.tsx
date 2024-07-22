import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, RadialLinearScale, LineElement, PointElement, Filler } from 'chart.js';
import { useEffect, useState } from 'react';
import { axiosInstanceWithAuth } from '@/api/Axios';
import React from 'react';


ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
)
const CourseCharts: React.FC = () => {

  //still stubs
  // const skillLabels = ['Javascript', 'Software design', 'Software testing', 'Object-Oriented', 'Most important Skill'];
  // const skillLevels = ['3', '2', '5', '4', '3'];
  // const skillImportance = ['1', '2', '4', '3', '5'];
  // const popularity = 50;


  const [skillsData, setSkillsData] = useState<{skillName: string; popularity: number;}[]>([]);
 
  useEffect(() => {
    const fetchSkillsPopularity = async () => {
      try {
        const response = await axiosInstanceWithAuth.get('/skills/popularity');
        setSkillsData(response.data);
      } catch (error) {
        console.error('Error fetching skills popularity:', error)
      }
    };

    fetchSkillsPopularity();
  }, []);

  const radarData = {
    labels: skillsData.map(skill => skill.skillName),
    datasets: [
      {
        label: 'Skill Popularity',
        data: skillsData.map(skill => skill.popularity),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
  )
}

export default CourseCharts;