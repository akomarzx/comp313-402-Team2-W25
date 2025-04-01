"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  // Local state for mobile menu and profile dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Get authentication context and current path
  const { user, logout, login, loading } = useAuth();
  const currentPath = usePathname();
  const router = useRouter();

  // Toggle the mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Determine active link styles
  const getLinkClasses = (path, mobile = false) => {
    const baseClasses = mobile
      ? "flex items-center gap-2 py-2 px-3 rounded-md transition-colors duration-200"
      : "flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200";

    return currentPath === path
      ? `${baseClasses} bg-primary/10 text-primary font-medium`
      : `${baseClasses} text-slate-600 hover:bg-slate-100 hover:text-primary`;
  };

  useEffect(() => {
    // Close mobile menu when user logs in
    if (!loading && user) {
      setIsOpen(false);
    }
  }, [loading, user]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container flex justify-between items-center h-16 mx-auto px-4">
        {/* Logo */}
        <div className="text-xl font-bold text-primary">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat size={25} className="text-primary" />
            <span className="hidden sm:inline">Kitchen Companion</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 text-slate-600 font-medium">
          <Link href="/recipes" className={getLinkClasses("/recipes")}>
            <Home size={18} />
            <span>Home</span>
          </Link>

          {user && !loading && (
            <Link href="/cook-book" className={getLinkClasses("/cook-book")}>
              <Book size={18} />
              <span>My Cookbook</span>
            </Link>
          )}

          <Link href="/ai-rcmd" className={getLinkClasses("/ai-rcmd")}>
            <WandSparkles size={18} />
            <span>AI</span>
          </Link>

          {/* Profile Dropdown for logged in user */}
          {user ? (
            <div className="relative ml-2">
              <Button
                variant="ghost"
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 hover:bg-slate-100"
              >
                <span>Profile</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden"
                    onBlur={(e) => {
                      if (e.relatedTarget?.id === "logout") {
                        logout();
                      } else if (e.relatedTarget?.id !== "profile") {
                        setIsProfileDropdownOpen(false);
                      }
                    }}
                  >
                    <Button
                      id="profile"
                      variant="ghost"
                      onClick={() => {
                        router.push("/profile");
                        setTimeout(() => {
                          setIsProfileDropdownOpen(false);
                        }, 200);
                      }}
                      className="flex w-full justify-start items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-600"
                    >
                      <UserRound size={18} />
                      <span>My Profile</span>
                    </Button>
                    <Button
                      id="logout"
                      variant="ghost"
                      onClick={async () => await logout()}
                      className="flex w-full justify-start items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-600"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Login Button for guest user */
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={async (e) => {
                      e.preventDefault();
                      await login();
                    }}
                    className="flex items-center gap-2 ml-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoaderIcon size={18} className="animate-spin" />
                    ) : (
                      <LogIn size={18} />
                    )}
                    <span>Login</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign in to access all features</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className="text-slate-600" />
            ) : (
              <Menu size={24} className="text-slate-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              <Link
                href="/recipes"
                className={getLinkClasses("/recipes", true)}
                onClick={() => setIsOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              {user && (
                <Link
                  href="/cook-book"
                  className={getLinkClasses("/cook-book", true)}
                  onClick={() => setIsOpen(false)}
                >
                  <Book size={18} />
                  <span>My Cookbook</span>
                </Link>
              )}

              <Link
                href="/ai-rcmd"
                className={getLinkClasses("/ai-rcmd", true)}
                onClick={() => setIsOpen(false)}
              >
                <WandSparkles size={18} />
                <span>AI</span>
              </Link>

              {/* Mobile Profile Options */}
              {user ? (
                <div className="pt-2 border-t mt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="flex w-full justify-between items-center px-3 py-2 rounded-md"
                  >
                    <span className="font-medium">Profile</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="ml-4 pl-4 border-l border-slate-200 flex flex-col gap-2 mt-2"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => {
                            router.push("/profile");
                            setIsOpen(false);
                          }}
                          className="flex justify-start items-center gap-2 px-3 py-2 rounded-md"
                        >
                          <UserRound size={18} />
                          <span>My Profile</span>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="flex justify-start items-center gap-2 px-3 py-2 rounded-md"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={async (e) => {
                    e.preventDefault();
                    await login();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <LoaderIcon size={18} className="animate-spin" />
                  ) : (
                    <LogIn size={18} />
                  )}
                  <span>Login</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
