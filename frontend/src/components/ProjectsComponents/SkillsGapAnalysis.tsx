import { Chart } from "chart.js/auto";
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
                type: 'bar',
                data: { 
                    labels: skillsGap,
                    datasets: [
                        {
                            label: 'Skills Gap Analysis',
                            data: skillsGap.map(() => 1),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 1,
                            borderColor: 'rgba(255, 99, 132, 1)'
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
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
            <h1 className="text-2xl font-light">Your Skill Gap Analysis</h1> 
            <canvas ref={chartRef} />
        </div>
    );

}