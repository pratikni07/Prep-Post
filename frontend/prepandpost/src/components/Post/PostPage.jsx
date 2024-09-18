import React, { useState } from "react";
import {
  Search,
  Bell,
  MessageSquare,
  Briefcase,
  Users,
  TrendingUp,
  Image,
  Video,
  Calendar,
  Edit,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
} from "lucide-react";

const PrepPost = () => {
  const [activeTab, setActiveTab] = useState("home");

  const posts = [
    {
      id: 1,
      author: "Jane Doe",
      role: "UX Designer at TechCorp",
      content:
        "Just launched our new app design! Check it out and let me know your thoughts. #UXDesign #NewLaunch",
      likes: 234,
      comments: 45,
      shares: 12,
      images: [
        "https://media.licdn.com/dms/image/v2/D5622AQEq1MjsmSDLxQ/feedshare-shrink_800/feedshare-shrink_800/0/1726655109986?e=1729728000&v=beta&t=rW7RmiI7Zo397MRVII6lg3uo-vZ1KBB3dfjFd0JA-Po",
        "https://media.licdn.com/dms/image/v2/D5622AQHc6vmzGDlFjA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1726673714491?e=1729728000&v=beta&t=CiV2SjQM-z63IMCudc6SlUx1xE_l28fWsZC_lwKFfoo",
      ],
    },
    {
      id: 2,
      author: "John Smith",
      role: "Software Engineer at InnovateTech",
      content:
        "Excited to share that our team just open-sourced our latest project. Link in the comments! #OpenSource #TechInnovation",
      likes: 189,
      comments: 56,
      shares: 23,
      images: [
        "https://media.licdn.com/dms/image/v2/D5622AQEq1MjsmSDLxQ/feedshare-shrink_800/feedshare-shrink_800/0/1726655109986?e=1729728000&v=beta&t=rW7RmiI7Zo397MRVII6lg3uo-vZ1KBB3dfjFd0JA-Po",
      ],
    },
    {
      id: 3,
      author: "Emily Chen",
      role: "Data Scientist at AI Solutions",
      content:
        "Fascinating insights from our recent AI ethics panel. Its crucial we consider the societal impacts of our work. Thoughts? #AIEthics #TechResponsibility",
      likes: 302,
      comments: 78,
      shares: 45,
      images: [
        "https://media.licdn.com/dms/image/v2/D5622AQEq1MjsmSDLxQ/feedshare-shrink_800/feedshare-shrink_800/0/1726655109986?e=1729728000&v=beta&t=rW7RmiI7Zo397MRVII6lg3uo-vZ1KBB3dfjFd0JA-Po",
        "https://media.licdn.com/dms/image/v2/D5622AQHc6vmzGDlFjA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1726673714491?e=1729728000&v=beta&t=CiV2SjQM-z63IMCudc6SlUx1xE_l28fWsZC_lwKFfoo",
        "https://media.licdn.com/dms/image/v2/D5622AQFc7J7fZEeWLg/feedshare-shrink_800/feedshare-shrink_800/0/1726644487510?e=1729728000&v=beta&t=BT913UJg3T3bBArggqoPljw4cVg2PF8jABbRJyRtJMw",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-6 flex flex-col md:flex-row h-[calc(100vh-72px)]">
        {/* Left Sidebar */}
        <aside className="w-full md:w-1/4 pr-0 md:pr-6 mb-6 md:mb-0 overflow-y-auto md:overflow-y-hidden sm:none">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="p-4 relative">
              <img
                src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white absolute -top-10 left-1/2 transform -translate-x-1/2"
              />
              <div className="mt-12 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Alex Johnson
                </h2>
                <p className="text-sm text-gray-600">
                  Full Stack Developer | Tech Enthusiast
                </p>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-600 flex items-center justify-between">
                  <span>Profile views</span>{" "}
                  <span className="font-semibold text-blue-600">1,234</span>
                </p>
                <p className="text-sm text-gray-600 flex items-center justify-between mt-2">
                  <span>Post impressions</span>{" "}
                  <span className="font-semibold text-blue-600">5,678</span>
                </p>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View my profile
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md mt-6 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">My Communities</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <Users size={16} className="mr-2" /> Tech Innovators
              </li>
              <li className="flex items-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <Briefcase size={16} className="mr-2" /> Job Seekers Network
              </li>
              <li className="flex items-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                <TrendingUp size={16} className="mr-2" /> Startup Ecosystem
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full md:w-1/2 px-0 md:px-6 overflow-y-auto scrollbar-hide">
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <input
                type="text"
                placeholder="Share an update or article"
                className="bg-gray-100 rounded-full py-2 px-4 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button className="flex items-center text-gray-600 hover:text-blue-600 bg-gray-100 px-3 py-1 rounded-full">
                <Image size={18} className="mr-2" /> Photo
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600 bg-gray-100 px-3 py-1 rounded-full">
                <Video size={18} className="mr-2" /> Video
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600 bg-gray-100 px-3 py-1 rounded-full">
                <Calendar size={18} className="mr-2" /> Event
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600 bg-gray-100 px-3 py-1 rounded-full">
                <Edit size={18} className="mr-2" /> Article
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={`https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp`}
                    alt={post.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {post.author}
                    </h3>
                    <p className="text-xs text-gray-600">{post.role}</p>
                  </div>
                </div>
                <MoreHorizontal className="text-gray-400 cursor-pointer" />
              </div>
              <p className="text-gray-800 mb-4">{post.content}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span className="flex items-center mr-4">
                  <ThumbsUp size={16} className="mr-1 text-blue-500" />{" "}
                  {post.likes}
                </span>
                <span className="flex items-center mr-4">
                  <MessageCircle size={16} className="mr-1 text-green-500" />{" "}
                  {post.comments}
                </span>
                <span className="flex items-center">
                  <Share2 size={16} className="mr-1 text-purple-500" />{" "}
                  {post.shares}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <button className="flex items-center justify-center w-1/3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">
                  <ThumbsUp size={20} className="mr-2" /> Like
                </button>
                <button className="flex items-center justify-center w-1/3 text-gray-600 hover:text-green-600 hover:bg-green-50 py-2 rounded-lg transition-colors">
                  <MessageCircle size={20} className="mr-2" /> Comment
                </button>
                <button className="flex items-center justify-center w-1/3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 py-2 rounded-lg transition-colors">
                  <Share2 size={20} className="mr-2" /> Share
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Right Sidebar */}
        <aside className="w-full md:w-1/4 pl-0 md:pl-6 mt-6 md:mt-0 overflow-y-auto md:overflow-y-hidden">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Add to your feed
            </h3>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={`/api/placeholder/40/40?text=User${i}`}
                    alt="Suggestion"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">Jane Smith</h4>
                    <p className="text-xs text-gray-600">
                      Senior UX Designer at DesignCo
                    </p>
                  </div>
                </div>
                <button className=" flex text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 px-3 py-1 rounded-full">
                  Follow
                </button>
              </div>
            ))}
            <button className="w-full text-blue-600 font-semibold text-sm mt-2 hover:text-blue-700 transition-colors bg-blue-50 py-2 rounded-lg">
              View all recommendations
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-md mt-6 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              Trending Articles
            </h3>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                10 Tech Trends to Watch in 2024
              </li>
              <li className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                The Future of Remote Work: Insights from Industry Leaders
              </li>
              <li className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                How AI is Transforming the Job Market
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PrepPost;
