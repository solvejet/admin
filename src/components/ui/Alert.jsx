// src/components/ui/Alert.jsx
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export const Alert = ({ type = "error", title, message, onClose }) => {
  const types = {
    error: {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-300",
      icon: "text-red-400",
      button: "bg-red-600 hover:bg-red-700",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-300",
      icon: "text-green-400",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-300",
      icon: "text-yellow-400",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
  };

  return (
    <AlertDialog.Root open>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
        <AlertDialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 shadow-xl ${types[type].bg}`}
        >
          {title && (
            <AlertDialog.Title
              className={`text-lg font-medium mb-2 ${types[type].text}`}
            >
              {title}
            </AlertDialog.Title>
          )}
          <AlertDialog.Description className={`text-sm ${types[type].text}`}>
            {message}
          </AlertDialog.Description>
          {onClose && (
            <AlertDialog.Action asChild>
              <button
                onClick={onClose}
                className={`mt-4 px-4 py-2 rounded text-white ${types[type].button}`}
              >
                Close
              </button>
            </AlertDialog.Action>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
