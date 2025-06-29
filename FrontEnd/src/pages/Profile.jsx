// src/pages/Profile.jsx

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${import.meta.env.VITE_API_URI}/api/profile/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Profile updated successfully!");
        setFile(null);
        setPreview(null);

        // optionally, reload sidebar avatar (you may use context/state for better UX)
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Profile Picture</h1>
      <Card className="p-6 shadow-lg">
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="file" className="mb-2 block text-sm font-medium">
              Choose your profile image
            </Label>
            <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border shadow-sm"
              />
            </div>
          )}

          <Button onClick={handleUpload} disabled={loading || !file} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </span>
            ) : (
              "Add"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
