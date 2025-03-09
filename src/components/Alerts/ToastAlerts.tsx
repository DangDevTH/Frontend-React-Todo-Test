import React, { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { Toast, ToastToggle } from "flowbite-react";

interface ToastProps {
  status: "success" | "error";
  message: string;
}

const ToastAlerts: React.FC<ToastProps> = ({ status, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status, message]);

  if (!isVisible) return null;

  let icon;
  let backgroundColor;
  let textColor;

  if (status === "success") {
    icon = <HiCheck className="size-5" />;
    backgroundColor = "bg-green-100";
    textColor = "text-green-500";
  } else if (status === "error") {
    icon = <HiX className="size-5" />;
    backgroundColor = "bg-red-100";
    textColor = "text-red-500";
  }

  return (
    <div className="flex flex-col gap-4">
      <Toast>
        <div
          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${backgroundColor} ${textColor} dark:${backgroundColor} dark:text-${textColor}`}
        >
          {icon}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <ToastToggle />
      </Toast>
    </div>
  );
};

export default ToastAlerts;
