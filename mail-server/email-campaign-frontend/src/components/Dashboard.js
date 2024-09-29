import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("compose");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [emailStats, setEmailStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchEmailStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/user", {
        headers: { Authorization: token },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchEmailStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/email/stats", {
        headers: { Authorization: token },
      });
      setEmailStats(response.data);
    } catch (error) {
      console.error("Error fetching email stats:", error);
    }
  };

  const sendBulkEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/email/send-bulk",
        { subject, body },
        { headers: { Authorization: token } }
      );
      alert("Bulk email job queued successfully");
      setSubject("");
      setBody("");
      fetchEmailStats();
    } catch (error) {
      console.error("Error sending bulk email:", error);
      alert("Error sending bulk email");
    }
  };

  const sendSingleEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/email/send-single",
        { to: singleEmail, subject, body },
        { headers: { Authorization: token } }
      );
      alert("Single email job queued successfully");
      setSingleEmail("");
      setSubject("");
      setBody("");
      fetchEmailStats();
    } catch (error) {
      console.error("Error sending single email:", error);
      alert("Error sending single email");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <a href="#" className="flex items-center py-4 px-2">
                  <span className="font-semibold text-gray-500 text-lg">
                    Email Campaign Dashboard
                  </span>
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={logout}
                className="py-2 px-2 font-medium text-white bg-red-500 rounded hover:bg-red-400 transition duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 ${
                activeTab === "compose" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("compose")}
            >
              Compose
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "users" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "stats" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
          </div>
        </div>

        {activeTab === "compose" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Compose Email</h2>
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-2 mb-4 border rounded"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              placeholder="Email body"
              className="w-full p-2 mb-4 border rounded"
              rows="4"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <input
              type="email"
              placeholder="Single recipient email (optional)"
              className="w-full p-2 mb-4 border rounded"
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
            />
            <div>
              <button
                onClick={sendBulkEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Send Bulk Email
              </button>
              <button
                onClick={sendSingleEmail}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Send Single Email
              </button>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">User List</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Subscribed</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      {user.subscribed ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "stats" && emailStats && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Email Statistics</h2>
            <p>Total Emails Sent: {emailStats.totalEmails}</p>
            <p>Total Recipients: {emailStats.totalRecipients}</p>
            <h3 className="text-xl font-bold mt-4 mb-2">Recent Emails</h3>
            <ul>
              {emailStats.recentEmails.map((email) => (
                <li key={email._id} className="mb-2">
                  <strong>{email.subject}</strong> - Sent to{" "}
                  {email.sentTo.length} recipient(s) on{" "}
                  {new Date(email.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
