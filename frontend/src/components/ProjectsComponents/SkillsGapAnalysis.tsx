import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";


export default function SkillsGapAnalysis() {

    const [projectSkills, setProjectSkills] = useState<string[]>([]);
    const [studentSkills, setStudentSkills] = useState<string[]>([]);
    const [skillsGap, setSkillsGap] = useState<string[]>([]);
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    //stubs
    const projectSkillsStub = [
        'JavaScript',
        'React',
        'Node.js',
        'SQL'
    ];

    const studentSkillsStub = [
        'JavaScript',
        'HTML',
        'CSS'
    ];

    useEffect(() => {
        setProjectSkills(projectSkillsStub);
        setStudentSkills(studentSkillsStub);
    }, []);

    useEffect(() => {
        const gap = projectSkills.filter(
            (skill) => !studentSkills.includes(skill)
        );
        setSkillsGap(gap);
    }, [projectSkills, studentSkills]);


    useEffect(() => {
        if (chartRef.current && skillsGap.length > 0) {
            const chartInstance = new Chart(chartRef.current, {
                type: 'doughnut',
                data: { 
                    labels: ['Skills Lacking', 'Skills Possessed'],
                    datasets: [{
                        label: 'Skills Gap Analysis',
                        data: [skillsGap.length, projectSkills.length - skillsGap.length],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Skills Gap Analysis'
                        }
                    }
                }
            });
            return () => {
                chartInstance.destroy();
            };
        }
    }, [skillsGap]);

    return (
        <div>
            <h1 className="text-xl font-semibold pt-4">Your skills analysis for this project</h1> 
            <div className="mt-8 flex">
                <canvas ref={chartRef}/>
            </div>
            <div className="flex mt-8">
                <div className="mr-4">
                    <h2 className="font-semibold">Skills Required:</h2>
                    <ul>
                        {projectSkills.map(skill => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </div>
                <div className="mr-4">
                    <h2 className="font-semibold">Skills Possesed:</h2>
                    <ul>
                        {studentSkills.map(skill => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </div>
                <div className="mr-4">
                    <h2 className="font-semibold">Skills Lacking:</h2>
                    <ul>
                        {skillsGap.map(skill => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

}