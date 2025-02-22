import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

const Home = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  const fetchTasks = async () => {
    if (!user || !user.token) return;
    try {
      const res = await axiosPublic.get("/tasks", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const grouped = res.data.reduce(
        (acc, task) => {
          acc[task.category].push(task);
          return acc;
        },
        { "To-Do": [], "In Progress": [], Done: [] }
      );
      Object.keys(grouped).forEach((cat) => {
        grouped[cat].sort((a, b) => a.order - b.order);
      });
      setTasks(grouped);
    } catch (error) {
    //   console.error(
    //     "Fetch tasks failed:",
    //     error.response?.data || error.message
    //   );
    toast.error(error.message)
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Data for Bar Chart
  const barData = [
    { name: "To-Do", count: tasks["To-Do"].length },
    { name: "In Progress", count: tasks["In Progress"].length },
    { name: "Done", count: tasks["Done"].length },
  ];

  // Data for Pie Chart
  const pieData = [
    { name: "To-Do", value: tasks["To-Do"].length },
    { name: "In Progress", value: tasks["In Progress"].length },
    { name: "Done", value: tasks["Done"].length },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]; // Blue, Green, Yellow

  if (!user)
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">
        Please sign in to view the dashboard.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-50">
        Dashboard Home
      </h1>
      <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
        Welcome, {user?.email || "User"}!
      </p>
      {/* Recharts */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Bar Chart */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-200">
            Task Count by Category
          </h2>
          <div className="flex justify-center">
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700 dark:text-gray-200">
            Task Distribution
          </h2>
          <div className="flex justify-center">
            <PieChart width={400} height={400} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
