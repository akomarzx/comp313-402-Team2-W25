"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { UserIcon, MailIcon, CalendarIcon } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  return (
    <div className="py-10 min-h-screen px-4 md:px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">
        Your Profile
      </h2>

      <div className="bg-card rounded-lg border shadow-sm p-6 transition-all hover:shadow-md">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <UserIcon size={18} />
              <span className="text-sm font-medium">Name</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {user?.name || "Name not available"}
            </h3>
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MailIcon size={18} />
              <span className="text-sm font-medium">Email</span>
            </div>
            <p className="text-lg text-gray-700">
              {user?.email || "Email not available"}
            </p>
          </div>

          {user?.createdAt && (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <CalendarIcon size={18} />
                <span className="text-sm font-medium">Member since</span>
              </div>
              <p className="text-lg text-gray-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
