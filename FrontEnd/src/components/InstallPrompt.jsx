import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true); // Always show prompt when user visits
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("PWA Installed");
      }
      setVisible(false);
    }
  };

  return (
    visible && (
      <div className="fixed bottom-4 right-4 bg-background border border-gray-300 dark:border-gray-700 shadow-xl rounded-xl p-4 z-50 flex items-center gap-4 animate-slide-up">
        <img
          src="./../public/OIP.jpeg"
          alt="App Icon"
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-1">
          <p className="font-semibold text-base">Install Admin App</p>
          <p className="text-sm text-muted-foreground">For faster access and offline use</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-lg flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Install
        </button>
      </div>
    )
  );
}
