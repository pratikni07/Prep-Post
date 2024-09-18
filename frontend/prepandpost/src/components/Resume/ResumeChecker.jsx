import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ResumeChecker = ({ resumeContent }) => {
  const [score, setScore] = useState(84);
  const [improvements, setImprovements] = useState([
    {
      id: 1,
      title: "Resume length and depth",
      description: "Your resume isn't the right length or depth",
    },
    {
      id: 2,
      title: "Possible spelling errors",
      description:
        "This check is only for Pro users. Upgrade to unlock this check",
    },
    {
      id: 3,
      title: "Review bullet points",
      description: "Some bullet points may need review",
    },
  ]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <div className="w-32 h-32 mb-4 sm:mb-0 sm:mr-6">
              <CircularProgressbar
                value={score}
                text={`${score}`}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: `rgba(62, 152, 199, ${score / 100})`,
                  textColor: "#3e98c7",
                  trailColor: "#d6d6d6",
                })}
              />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2 text-center sm:text-left">
                Your resume scored {score} out of 100.
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                You made a good start to your resume, and it scores well on some
                key checks hiring managers care about. However, your resume fell
                short in other key areas. Don't worry, they can be improved
                easily.
              </p>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Let's dive in
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold mb-4">
            Steps to increase your score
          </h3>
          <ul>
            {improvements.map((improvement) => (
              <li
                key={improvement.id}
                className="mb-4 pb-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h4 className="font-semibold text-red-600">
                      {improvement.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {improvement.description}
                    </p>
                  </div>
                  <button className="w-full sm:w-auto bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors">
                    Fix
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-white p-4 lg:p-8 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">Your Resume</h2>
        <div className="whitespace-pre-wrap font-mono text-xs lg:text-sm">
          {resumeContent}
        </div>
      </div>
    </div>
  );
};

export default ResumeChecker;
