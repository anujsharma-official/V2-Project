// src/pages/Certificates.jsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Trash2, Pencil } from "lucide-react";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    image: null,
    category: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchCertificates = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/api/certificates`);
    const data = await res.json();
    setCertificates(data);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.issuer || !form.image || !form.category) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("issuer", form.issuer);
      formData.append("category", form.category);
      formData.append("image", form.image);

      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/api/certificates${
          editingId ? `/${editingId}` : ""
        }`,
        {
          method: editingId ? "PUT" : "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setForm({ title: "", issuer: "", image: null, category: "" });
        setPreview(null);
        setEditingId(null);
        fetchCertificates();
        setFormVisible(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_URI}/api/certificates/${id}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (data.success) {
      toast.success("Deleted successfully");
      fetchCertificates();
    }
  };

  const handleEdit = (cert) => {
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      image: null,
      category: cert.category,
    });
    setEditingId(cert._id);
    setPreview(cert.imageUrl);
    setFormVisible(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">🎓 Certificates</h2>
        <Button onClick={() => setFormVisible(!formVisible)} variant="outline">
          {formVisible ? "Hide Form" : "Add Certificate"}
        </Button>
      </div>

      {formVisible && (
        <Card className="shadow-xl border rounded-2xl">
          <CardHeader>
            <CardTitle>
              {editingId ? "Update Certificate" : "Add New Certificate"}
            </CardTitle>
            <CardDescription>
              Fill all fields and upload your certificate image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Certificate Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Issuer Name"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            />
            <Select
              value={form.category}
              onValueChange={(value) => setForm({ ...form, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="fullstack">Fullstack</SelectItem>
              </SelectContent>
            </Select>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border shadow"
                />
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </span>
              ) : editingId ? (
                "Update Certificate"
              ) : (
                "Add Certificate"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <Card
            key={cert._id}
            className="rounded-2xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300 bg-background"
          >
            <img
              src={cert.imageUrl}
              alt={cert.title}
              className="w-full h-48 object-cover px-3"
            />
            <CardContent className="p-4 space-y-2">
              <h4 className="font-bold text-xl tracking-wide text-foreground">
                {cert.title}
              </h4>
              <p className="text-muted-foreground text-xl">
                Issuer: {cert.issuer}
              </p>
              <p className="text-xl text-primary capitalize ">
                Category: {cert.category}
              </p>
              <div className="flex justify-end items-center gap-3 pt-4 flex-wrap">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-yellow-100 transition-all"
                  onClick={() => handleEdit(cert)}
                >
                  <Pencil className="w-4 h-4 text-yellow-600 hover:scale-110 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-red-100 transition-all"
                  onClick={() => handleDelete(cert._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600 hover:scale-110 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
