"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const currentPath = usePathname();

  return (
    <nav className="w-full h-fit mx-auto border-b bg-white">
      <div className="container flex justify-between h-[8vh] items-center mx-auto px-4">
        {/* Logo */}
        <div className="text-xl font-bold text-green-500">
          <Link href="/">Kitchen Companion</Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-slate-600 font-bold font-sans">
          <Link
            href="/"
            className={
              currentPath === "/" ? "text-green-500" : "text-slate-600"
            }
          >
            HOME
          </Link>
          <Link
            href="/recipies"
            className={
              currentPath === "/recipies" ? "text-green-500" : "text-slate-600"
            }
          >
            RECIPIES
          </Link>
          <Link
            href="/ai"
            className={
              currentPath === "/ai" ? "text-green-500" : "text-slate-600"
            }
          >
            AI RECOMMENDATIONS
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            onBlur={() => setTimeout(() => setIsOpen(false), 20)}
            className="text-slate-600 focus:outline-none"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col gap-4 py-4 px-4 text-slate-600 font-bold font-sans">
            <Link
              href="/"
              className={
                currentPath === "/" ? "text-green-500" : "text-slate-600"
              }
              onClick={() => setIsOpen(false)}
            >
              HOME
            </Link>
            <Link
              href="/recipies"
              className={
                currentPath === "/recipies"
                  ? "text-green-500"
                  : "text-slate-600"
              }
              onClick={() => setIsOpen(false)}
            >
              RECIPIES
            </Link>
            <Link
              href="/ai"
              className={
                currentPath === "/ai" ? "text-green-500" : "text-slate-600"
              }
              onClick={() => setIsOpen(false)}
            >
              AI RECOMMENDATIONS
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
