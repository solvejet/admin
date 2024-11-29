// src/components/ui/Input.jsx
import * as Form from "@radix-ui/react-form";

export const Input = ({ label, error, icon: Icon, ...props }) => {
  return (
    <Form.Field name={props.name || "input"}>
      {label && (
        <Form.Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Form.Label>
      )}
      <div className="relative mt-1">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <Form.Control asChild>
          <input
            className={`
              block w-full rounded-lg border transition-colors
              ${Icon ? "pl-10" : "pl-4"} pr-4 py-2
              ${
                error
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600"
              }
              dark:bg-gray-800 dark:text-white
            `}
            {...props}
          />
        </Form.Control>
      </div>
      {error && (
        <Form.Message className="mt-1 text-sm text-red-500">
          {error}
        </Form.Message>
      )}
    </Form.Field>
  );
};
