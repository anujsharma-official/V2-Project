// src/components/Sidebar.jsx

import { Folder, Award, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleTheme } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export function Sidebar({ activeTab, setActiveTab, profileImage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close menu on mobile
  };

  return (
    <>
      {/* 📱 Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* 🧭 Sidebar */}
      <aside
          className={`fixed md:static top-0 left-0 w-64 h-screen bg-muted dark:bg-zinc-900 text-foreground border-r border-border p-6 shadow-md flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } md:translate-x-0 md:flex`}
      >
        {/* 👤 Profile Header */}
        <div>
          <div className="flex flex-col items-center space-y-2 mb-8">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileImage} alt="Anuj Sharma" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-center">Anuj Sharma</h2>
          </div>

          {/* 📚 Navigation */}
          <nav className="flex flex-col space-y-2">
            <SidebarButton
              icon={<User size={18} />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => handleNavClick("profile")}
            />
            <SidebarButton
              icon={<Folder size={18} />}
              label="Projects"
              active={activeTab === "projects"}
              onClick={() => handleNavClick("projects")}
            />
            <SidebarButton
              icon={<Award size={18} />}
              label="Certificates"
              active={activeTab === "certificates"}
              onClick={() => handleNavClick("certificates")}
            />
            
          </nav>
        </div>

        {/* 🌙 Theme Toggle */}
        <div className="mt-10 text-center">
  <ToggleTheme />
  <p className="text-xs mt-2 text-muted-foreground">Dark mode ready</p>
</div>
      </aside>

      {/* 🔲 Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

/* 🔘 Clean Reusable Sidebar Button */
function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
