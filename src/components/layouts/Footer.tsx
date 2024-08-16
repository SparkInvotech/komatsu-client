import { appConfig } from "@/config/app";
import { ModeToggle } from "../mode-toggle";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer
      className={cn(
        "bg-gray-900 text-white py-4", // Reduced vertical padding
        "w-full absolute bottom-0 left-0"
      )}
    >
      <div className="px-4 flex justify-between">
        {" "}
        {/* Reduced horizontal padding */}
        <div className="text-sm">
          {" "}
          {/* Reduced font size */}
          <h2 className="text-lg font-bold mb-2">Komatsu</h2>{" "}
          {/* Adjusted font size and margin */}
          <p className="mb-2">
            Email: abc@Komatsu.com | Phone: (+91) 987654324
          </p>{" "}
          {/* Reduced margin */}
        </div>
        <div className="text-right text-sm">
          {" "}
          {/* Reduced font size */}
          <div className="flex justify-end space-x-2 mb-2">
            {" "}
            {/* Reduced spacing between links */}
            <a href="#" className="text-gray-400 hover:text-gray-300 text-xs">
              {" "}
              {/* Reduced font size */}
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 text-xs">
              {" "}
              {/* Reduced font size */}
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 text-xs">
              {" "}
              {/* Reduced font size */}
              About Us
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            {" "}
            {/* Reduced font size */}
            &copy; {new Date().getFullYear()} Komatsu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
