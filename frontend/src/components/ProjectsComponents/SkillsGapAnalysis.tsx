import { useEffect, useState } from "react";

export default function SkillsGapAnalysis() {

    const [projectSkills, setProjectSkills] = useState<string[]>([]);
    const [studentSkills, setStudentSkills] = useState<string[]>([]);
    const [skillsGap, setSkillsGap] = useState<string[]>([]);

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


    // useEffect(() => {

    // }, []);

    return (
        <div className="h-32 bg-gray-200 p-5 py-3 text-center rounded-lg">
            <div className="text-start flex flex-col gap-1">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-2xl font-light">Your Skill Gap Analysis</h1>
                </div>
                <ul>
                    {skillsGap.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                </ul>
            </div>
        </div>
    );

}