// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
            404
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Page not found
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button variant="primary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
