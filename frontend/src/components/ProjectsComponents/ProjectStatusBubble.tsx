import React from 'react';

interface BubbleProps {
    text: string;
}

const statusClasses: { [key: string]: string } = {
    PENDING: "bg-orange-200",
    DENIED: "bg-red-300",
};

const Bubble: React.FC<BubbleProps> = ({ text }) => {
    const statusClass = statusClasses[text] || "bg-gray-200";

    return (
        <div className={`${statusClass} text-black w-fit text-sm font-medium py-1 px-3 rounded-full mr-2 mb-2`}>
            {text}
        </div>
    );
};

export default Bubble;
