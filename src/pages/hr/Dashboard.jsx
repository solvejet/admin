// src/pages/hr/Dashboard.jsx
const HRDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        HR Dashboard
      </h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add your HR dashboard content here */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Employees
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
