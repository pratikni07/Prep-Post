import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Layout,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import logo from "../../assets/mainlogo.png";

const CodeEditor = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isTestCaseVisible, setIsTestCaseVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const languages = ["javascript", "python", "java", "c++"];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Hideable Navbar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${
          isNavbarVisible ? "w-64" : "w-16"
        }`}
        onMouseEnter={() => setIsNavbarVisible(true)}
        onMouseLeave={() => setIsNavbarVisible(false)}
      >
        <nav className="h-full bg-white shadow-lg flex flex-col justify-between rounded-tr-xl rounded-br-xl">
          <div className="p-4">
            <div className="flex items-center justify-center h-12 mb-8">
              {!isNavbarVisible && <Menu size={24} className="text-gray-700" />}
              {isNavbarVisible && (
                <img src={logo} />
                // <h1 className="text-2xl font-bold text-gray-800">Acet Labs</h1>
              )}
            </div>
            <ul className="space-y-4">
              <li
                className={`flex items-center ${
                  isNavbarVisible ? "justify-start space-x-2" : "justify-center"
                } text-gray-700 hover:text-black cursor-pointer`}
              >
                <Layout size={20} />
                {isNavbarVisible && <span>Dashboard</span>}
              </li>
              <li
                className={`flex items-center ${
                  isNavbarVisible ? "justify-start space-x-2" : "justify-center"
                } text-gray-700 hover:text-black cursor-pointer`}
              >
                <User size={20} />
                {isNavbarVisible && <span>Profile</span>}
              </li>
              <li
                className={`flex items-center ${
                  isNavbarVisible ? "justify-start space-x-2" : "justify-center"
                } text-gray-700 hover:text-black cursor-pointer`}
              >
                <Settings size={20} />
                {isNavbarVisible && <span>Settings</span>}
              </li>
            </ul>
          </div>
          <div
            className={`p-4 ${
              isNavbarVisible ? "justify-start space-x-2" : "justify-center"
            } flex items-center text-gray-700 hover:text-black cursor-pointer`}
          >
            <LogOut size={20} />
            {isNavbarVisible && <span>Logout</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex transition-all duration-300 ease-in-out ${
          isNavbarVisible ? "ml-64" : "ml-16"
        }`}
      >
        {/* Problem Statement */}
        <div className="w-1/2 p-4 flex flex-col">
          <div className="bg-white shadow-md rounded-lg p-6 flex-grow overflow-auto">
            <div className="flex gap-2">
              <div>
                {/* previous problem */}
                <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.25 15.25L9.75 12L13.25 8.75"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span>Previous</span>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </div>
              <div>
                <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <span>Next Problem</span>
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Problem Statement
              </h2>
              <p className="text-gray-700">
                Write a function that takes an array of integers and returns the
                sum of all elements. Provide an efficient solution with a linear
                time complexity.
              </p>
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
                Example:
              </h3>
              <pre className="bg-gray-100 p-3 rounded">
                {`Input: [1, 2, 3, 4, 5]
Output: 15

Explanation: 1 + 2 + 3 + 4 + 5 = 15`}
              </pre>
              <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
                Constraints:
              </h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>The array length will be between 1 and 10^5</li>
                <li>Array elements will be integers between -10^9 and 10^9</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Editor and Test Case */}
        <div className="w-1/2 flex flex-col p-4">
          {/* Code Editor */}
          <div className="flex-grow bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <button className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded">
                Run
              </button>
            </div>
            <textarea
              className="w-full h-full p-4 focus:outline-none text-gray-800"
              placeholder="Write your code here..."
            />
          </div>

          {/* Test Case */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div
              className="bg-gray-800 text-white p-2 flex justify-between items-center cursor-pointer"
              onClick={() => setIsTestCaseVisible(!isTestCaseVisible)}
            >
              <span>Test Cases</span>
              {isTestCaseVisible ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
            {isTestCaseVisible && (
              <div className="p-4 max-h-48 overflow-auto">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Input:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-gray-700">
                    [1, 2, 3, 4, 5]
                  </pre>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Expected Output:
                  </h3>
                  <pre className="bg-gray-100 p-2 rounded text-gray-700">
                    15
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
