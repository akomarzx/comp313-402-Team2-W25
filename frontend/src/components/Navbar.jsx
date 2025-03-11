"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Book,
  ChefHat,
  Home,
  LoaderIcon,
  LogIn,
  LogOut,
  UserRound,
  WandSparkles,
} from "lucide-react";

const Navbar = () => {
  // Local state for mobile menu and profile dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Get authentication context and current path
  const { user, logout, login, loading } = useAuth();
  const currentPath = usePathname();

  // Toggle the mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Determine active link styles
  const getLinkClasses = (path, mobile = false) => {
    const baseClasses = mobile ? "flex gap-1" : "flex gap-2";
    return currentPath === path
      ? `text-green-600 ${baseClasses}`
      : `text-slate-600 ${baseClasses}`;
  };

  useEffect(() => {
    // Close mobile menu when user logs in
    if (!loading && user) {
      setIsOpen(false);
    }
  }, [loading, user]);

  return (
    <nav className="w-full border-b bg-white">
      <div className="container flex justify-between items-center h-[8vh] mx-auto min-w-[80%] px-4">
        {/* Logo */}
        <div className="text-xl font-bold text-green-600">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat size={25} />
            <span>Kitchen Companion</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 text-slate-600 font-bold font-sans">
          <Link href="/recipes" className={getLinkClasses("/recipes")}>
            <Home size={22} />
            <span>HOME</span>
          </Link>

          {user && !loading && (
            <Link href="/cook-book" className={getLinkClasses("/cook-book")}>
              <Book size={22} />
              <span>MY COOK BOOK</span>
            </Link>
          )}

          <Link href="/ai-rcmd" className={getLinkClasses("/ai-rcmd")}>
            <WandSparkles size={22} />
            <span>AI</span>
          </Link>

          {/* Profile Dropdown for logged in user */}
          {user ? (
            <div
              className="relative"
              onBlur={async (e) => {
                // If focus moves to logout button, handle logout, otherwise hide dropdown
                if (e.relatedTarget?.id === "logout") {
                  await logout();
                } else if (e.relatedTarget?.id !== "profile") {
                  setTimeout(() => {
                    setIsProfileDropdownOpen(false);
                  }, 200);
                }
              }}
            >
              <button
                id="profile"
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
                    <div className="flex gap-2 items-center">
                      <UserRound size={22} />
                      <span>MY PROFILE</span>
                    </div>
                  </Link>
                  <button
                    id="logout"
                    onClick={async () => await logout()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-slate-600"
                  >
                    <div className="flex gap-2 items-center">
                      <LogOut size={22} />
                      <span>LOG OUT</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login Button for guest user */
            <div className="flex min-w-[69px]">
              <Link
                href="/"
                onClick={async (e) => {
                  e.preventDefault();
                  await login();
                  setIsOpen(false);
                }}
                className="flex gap-2 hover:text-green-600"
              >
                <LogIn size={22} />
                <span>LOGIN</span>
              </Link>
              {loading && (
                <div className="flex items-center justify-center z-50">
                  <LoaderIcon size={20} className="animate-spin m-auto" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-slate-600 focus:outline-none"
          >
            {isOpen ? (
              // Close icon
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
              // Menu icon
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col gap-4 py-4 px-4 text-slate-600 font-bold font-sans">
            <Link
              href="/recipes"
              className={getLinkClasses("/recipes", true)}
              onClick={() => setIsOpen(false)}
            >
              <Home size={22} />
              <span>Home</span>
            </Link>

            {user && (
              <Link
                href="/cook-book"
                className={getLinkClasses("/cook-book", true)}
                onClick={() => setIsOpen(false)}
              >
                <Book size={22} />
                <span>My Cook Book</span>
              </Link>
            )}

            <Link
              href="/ai-rcmd"
              className={getLinkClasses("/ai-rcmd", true)}
              onClick={() => setIsOpen(false)}
            >
              <WandSparkles size={22} />
              <span>AI</span>
            </Link>

            {/* Mobile Profile Dropdown */}
            {user ? (
              <div>
                <button
                  onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                  className="block w-full text-left py-2 hover:text-green-600 focus:outline-none"
                >
                  Profile
                </button>
                {isProfileDropdownOpen && (
                  <div className="ml-4 border-l pl-4 flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex gap-1 hover:text-green-600"
                    >
                      <UserRound size={22} />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex gap-1 hover:text-green-600 text-left"
                    >
                      <LogOut size={22} />
                      <span>Logout</span>
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
                className="flex gap-1 hover:text-green-600"
              >
                <LogIn size={22} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
