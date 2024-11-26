// src/components/theme-toggle.jsx
import * as React from "react";
import { Moon, Sun, Computer } from "lucide-react";
import { useTheme } from "./theme-provider";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`
            relative w-8 h-8 rounded-full
            bg-secondary hover:bg-secondary/80
            text-secondary-foreground
            transition-all duration-300 ease-in-out
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            dark:focus:ring-offset-background
          `}
          aria-label="Toggle theme"
        >
          <span className="sr-only">Toggle theme</span>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:rotate-90 dark:scale-0" />
          <Moon className="h-4 w-4 rotate-90 scale-0 transition-all absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:rotate-0 dark:scale-100" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className={`
              relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
              transition-colors
              hover:bg-accent hover:text-accent-foreground
              ${theme === "light" ? "bg-accent" : ""}
            `}
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={`
              relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
              transition-colors
              hover:bg-accent hover:text-accent-foreground
              ${theme === "dark" ? "bg-accent" : ""}
            `}
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={`
              relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none
              transition-colors
              hover:bg-accent hover:text-accent-foreground
              ${theme === "system" ? "bg-accent" : ""}
            `}
            onClick={() => setTheme("system")}
          >
            <Computer className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
