"use client";

import { useState } from "react";
import { triggerServerAction } from "@/server-actions";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const data = await triggerServerAction(); // Call the server action
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <button
        className="rounded-full border border-solid border-black transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={handleClick}
      >
        Trigger Action
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
