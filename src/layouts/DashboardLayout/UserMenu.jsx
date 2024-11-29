// src/layouts/DashboardLayout/UserMenu.jsx
import { memo, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import useAuthStore from "@/store/authStore";

export const UserMenu = memo(({ onSignOut }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">Open user menu</span>
          <UserIcon className="h-8 w-8 rounded-full text-gray-400" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              {user?.email}
            </div>
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                href="#profile"
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onSignOut}
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-700" : ""
                } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
});

UserMenu.displayName = "UserMenu";
