// src/pages/sales/Dashboard.jsx
const SalesDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Sales Dashboard
      </h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add your sales dashboard content here */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Revenue
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
