"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // For Profile Dropdown
  const { user, logout, login, loading } = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const currentPath = usePathname();

  return (
    <nav className="w-full h-fit mx-0 border-b bg-white">
      <div className="container flex justify-between h-[8vh] items-center mx-auto min-w-[80%] px-4">
        <div className="text-xl font-bold text-green-600">
          <Link href="/recipes">Kitchen Companion</Link>
        </div>
        {!loading && (
          <>
            <div className="hidden md:flex gap-10 text-slate-600 font-bold font-sans">
              <Link
                href="/recipes"
                className={
                  currentPath === "/recipes"
                    ? "text-green-600"
                    : "text-slate-600"
                }
              >
                HOME
              </Link>
              {user && (
                <Link
                  href="/cook-book"
                  className={
                    currentPath === "/cook-book"
                      ? "text-green-600"
                      : "text-slate-600"
                  }
                >
                  MY COOK BOOK
                </Link>
              )}
              <Link
                href="/ai-rcmd"
                className={
                  currentPath === "/ai-rcmd"
                    ? "text-green-600"
                    : "text-slate-600"
                }
              >
                AI RECOMMENDATIONS
              </Link>

              {/* Profile Dropdown */}
              {user ? (
                <div
                  className="relative"
                  onBlur={() =>
                    setTimeout(() => {
                      setIsProfileDropdownOpen(false);
                    }, 100)
                  }
                >
                  <button
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 hover:text-green-600 focus:outline-none"
                  >
                    <span>PROFILE</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 text-slate-600"
                      >
                        MY PROFILE
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-slate-600"
                      >
                        LOG OUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/"
                  onClick={async (e) => {
                    e.preventDefault();
                    await login();
                    setIsOpen(false);
                  }}
                  className="hover:text-green-600"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </>
        )}
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
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
              href="/recipes"
              className={
                currentPath === "/recipes" ? "text-green-600" : "text-slate-600"
              }
              onClick={() => setIsOpen(false)}
            >
              HOME
            </Link>
            {user && (
              <Link
                href="/cook-book"
                className={
                  currentPath === "/cook-book"
                    ? "text-green-600"
                    : "text-slate-600"
                }
                onClick={() => setIsOpen(false)}
              >
                MY COOK BOOK
              </Link>
            )}
            <Link
              href="/ai-rcmd"
              className={
                currentPath === "/ai-rcmd" ? "text-green-600" : "text-slate-600"
              }
              onClick={() => setIsOpen(false)}
            >
              AI RECOMMENDATIONS
            </Link>

            {/* Mobile Profile Dropdown */}
            {user ? (
              <div>
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="block w-full text-left py-2 hover:text-green-600 focus:outline-none"
                >
                  PROFILE
                </button>
                {isProfileDropdownOpen && (
                  <div className="ml-4 border-l pl-4 flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-green-600"
                    >
                      MY PROFILE
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="hover:text-green-600"
                    >
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/"
                onClick={async (e) => {
                  e.preventDefault();
                  await login();
                  setIsOpen(false);
                }}
                className="hover:text-green-600"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
