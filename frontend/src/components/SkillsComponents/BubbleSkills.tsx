import React from 'react';

interface BubbleProps {
    text: string;
}

const Bubble: React.FC<BubbleProps> = ({ text }) => {
    return (
        <div className="bg-green-200 text-black w-fit text-sm font-medium py-1 px-3 rounded-full mr-2 mb-2">
            {text}
        </div>
    );
};

export default Bubble;
