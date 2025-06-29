// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Projects from "./Projects";
import Certificates from "./Certificates";
import Profile from "./Profile";
import axios from "axios";

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
  const fetchProfileImage = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/api/profile/latest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data.success && data.profile) {
        setProfileImage(data.profile.imageUrl);
      }
    } catch (error) {
      console.error("Failed to fetch profile image", error);
    }
  };

  fetchProfileImage();
}, []);


  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profileImage={profileImage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-4 border-b bg-muted/40 sticky top-0 z-30">
          <div className="flex items-center justify-center text-center">
            {/* Desktop Header */}
            <h1 className="hidden sm:block text-xl sm:text-2xl font-bold">
              🚀✨ Welcome Back Anuj Sharma ✨🚀
            </h1>

            {/* Mobile Header */}
            <h1 className="block sm:hidden text-xl font-bold">
              Welcome Back Anuj
            </h1>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 flex-1 overflow-y-auto">
          {activeTab === "projects" && <Projects />}
          {activeTab === "certificates" && <Certificates />}
          {activeTab === "profile" && <Profile />}
        </main>
      </div>
    </div>
  );
}
