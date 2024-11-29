// src/pages/admin/Dashboard.jsx
import {
  Users,
  Activity,
  CreditCard,
  ArrowUpRight,
  BarChart3,
  DollarSign,
} from "lucide-react";

const stats = [
  {
    name: "Total Users",
    value: "8,647",
    change: "+12.5%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Active Sessions",
    value: "2,345",
    change: "+18.2%",
    changeType: "increase",
    icon: Activity,
  },
  {
    name: "Total Revenue",
    value: "$45,678",
    change: "+8.3%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    name: "Conversion Rate",
    value: "3.24%",
    change: "+2.1%",
    changeType: "increase",
    icon: BarChart3,
  },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Created new account",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Updated profile",
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Completed onboarding",
    timestamp: "10 minutes ago",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor key metrics and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="ml-1 text-sm font-medium text-green-500">
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  from last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.user}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.action}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
