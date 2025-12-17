"use client";

import { useState } from "react";
import { useSiteConfig } from "../contexts/siteConfigContext";

export function Dropdown({ title, description }) {
  const config = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className="flex justify-between rounded-md p-4 text-white w-full"
        style={{ background: config.primary || "black" }}
      >
        <h2>{title}</h2>
        <img
          src="chevron.png"
          className="h-4 self-center"
          style={{
            transform: isOpen ? "rotate(180deg)" : "",
            transition: "transform 300ms ease",
          }}
        />
      </button>

      {isOpen ? <p className="p-4">{description}</p> : null}
    </div>
  );
}
