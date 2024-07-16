import CourseDetails from '@/pages/CourseDetails';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, RadialLinearScale, LineElement, PointElement, Filler } from 'chart.js';


ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
)
const CourseCharts: React.FC = () => {
  
  const skillLabels = ['Javascript', 'Software design', 'Software testing', 'Object-Oriented', 'Another skill'];
  const skillLevels = ['3', '2', '5', '4', '3'];
  const skillImportance = ['1', '2', '4', '3', '5'];
  // const popularity = 50;



  const radarData = {
    labels: skillLabels,
    datasets: [
      {
        label: 'Skill Level',
        data: skillLevels,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'black'
      },
      {
        label: 'Skill Importance',
        data: skillImportance,
        borderColor: 'rgb(255, 99, 132)',
      },
    //   options: {
    //     responsive: false,
    //     elements: {
    //        line: {
    //           borderWidth: 3
    //        }
    //     }
    //  },
    ],
  };

  return (
    <div className="mt-8 flex">
      <Radar data={radarData}></Radar>
    </div>
  )
}

export default CourseCharts;