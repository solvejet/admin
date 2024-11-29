// src/components/OfflineBanner.jsx
import { memo } from "react";
import { WifiOffIcon } from "lucide-react";

export const OfflineBanner = memo(() => (
  <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="p-2 rounded-lg bg-yellow-600 shadow-lg sm:p-3">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-yellow-800">
              <WifiOffIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">You are offline</span>
              <span className="hidden md:inline">
                You are currently offline. Some features may be unavailable.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

OfflineBanner.displayName = "OfflineBanner";
