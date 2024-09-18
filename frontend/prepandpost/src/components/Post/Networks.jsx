import React from "react";
import {
  UserPlus,
  Users,
  BriefcaseIcon,
  BookOpenIcon,
  CalendarIcon,
  Network,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Networks = () => {
  const invitations = [
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer at TechCorp",
      mutual: 15,
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Product Manager at InnovateCo",
      mutual: 23,
      imgSrc: "/api/placeholder/70/70",
    },
  ];

  const suggestions = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "UX Designer",
      company: "DesignHub",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 2,
      name: "Bob Williams",
      role: "Marketing Specialist",
      company: "GrowthInc",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
    {
      id: 3,
      name: "Carol Brown",
      role: "Data Scientist",
      company: "DataCrunch",
      imgSrc: "/api/placeholder/70/70",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>My Professional Network | Connect and Grow</title>
        <meta
          name="description"
          content="Expand your professional network, find new connections, and grow your career opportunities."
        />
        <meta
          name="keywords"
          content="professional network, connections, career growth, networking"
        />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          My Network
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  Manage my network
                </h2>
              </div>
              <ul>
                {[
                  {
                    icon: <Users className="w-5 h-5" />,
                    text: "Connections",
                    count: 1523,
                  },
                  {
                    icon: <UserPlus className="w-5 h-5" />,
                    text: "Following & followers",
                    count: 872,
                  },
                  {
                    icon: <BriefcaseIcon className="w-5 h-5" />,
                    text: "Groups",
                    count: 6,
                  },
                  {
                    icon: <CalendarIcon className="w-5 h-5" />,
                    text: "Events",
                    count: 14,
                  },
                  {
                    icon: <BookOpenIcon className="w-5 h-5" />,
                    text: "Pages",
                    count: 28,
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition duration-200"
                  >
                    <div className="flex items-center text-gray-700">
                      {item.icon}
                      <span className="ml-3">{item.text}</span>
                    </div>
                    <span className="text-gray-500">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {/* Invitations */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Invitations
                </h2>
                <a href="#" className="text-blue-600 hover:underline">
                  See all {invitations.length}
                </a>
              </div>
              <ul>
                {invitations.map((invite) => (
                  <li
                    key={invite.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex items-start">
                      <img
                        src={invite.imgSrc}
                        alt={invite.name}
                        className="rounded-full w-16 h-16 mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800">
                          {invite.name}
                        </h3>
                        <p className="text-sm text-gray-600">{invite.role}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {invite.mutual} mutual connections
                        </p>
                        <div className="mt-2">
                          <button className="mr-2 px-4 py-1 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition duration-200">
                            Ignore
                          </button>
                          <button className="px-4 py-1 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition duration-200">
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* People you may know */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  People you may know
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {suggestions.map((person) => (
                  <li
                    key={person.id}
                    className="border rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-start">
                      <img
                        src={person.imgSrc}
                        alt={person.name}
                        className="rounded-full w-16 h-16 mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-600">{person.role}</p>
                        <p className="text-sm text-gray-500">
                          {person.company}
                        </p>
                        <button className="mt-2 px-4 py-1 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition duration-200 flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networks;
