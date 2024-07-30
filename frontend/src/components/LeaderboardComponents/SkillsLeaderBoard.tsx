import { axiosInstanceWithAuth } from "@/api/Axios";
import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SkillsLeaderBoard = () => {
  const [data, setData] = useState({"Placeholder": "Placeholder"});
  const [numSkills, setNumSkills] = useState(0);
  const [userSkillsCount, setUserSkillsCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  let delayed: boolean;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstanceWithAuth.get("/skills/leaderboard-data");
        setData(response.data.dataset);
        setNumSkills(response.data.constants.numSkills);
        setUserSkillsCount(response.data.constants.userSkillsCount);
        setPercentage(response.data.constants.higherPercentage);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);  
      }
    }
    fetchData();
  },[])

  const generateColours: () => string[] = (): string[] => {
    const rawData = Object.keys(data);
    const bg = rawData.map((key) => {
      return key === userSkillsCount.toString() ? "#178443" : "#01af57";
    });
    return bg;
  };

  return (
      <div className="w-[95%]">
        <p className="font-bold mb-4">{`You currently have ${userSkillsCount} skills. You posses more skills than ${percentage}% of all users!`}</p>
        <Bar 
          data={{
            labels: Object.keys(data),
            datasets: [
              {
                label: "Users",
                data: Object.values(data),
                backgroundColor: generateColours(),
                borderColor: generateColours(),
                borderWidth: 1,
                borderRadius: 10,
                barThickness: 4.5,
              }
            ]
          }}
          options={{
            animation: {
              onComplete: () => {
                delayed = true;
              },
              delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                  delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
              },
            },
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Skills Obtained'
                },
                min: 0,
                max: numSkills,
                ticks: {
                  stepSize: 1
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Users'
                }
              }
            }
          }}
        />
      </div>
    )
}

export default SkillsLeaderBoard