// src/pages/Projects.jsx

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
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  PlusCircle,
} from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
    tags: "",
    liveUrl: "",
    githubUrl: "",
    category: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URI}/api/projects`);
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const { title, description, image, tags, liveUrl, githubUrl, category } =
      form;
    if (!title || !description || !image || !category) {
      return toast.error(
        "Title, description, image, and category are required"
      );
    }

    try {
      setLoading(true);
      const formData = new FormData();
      for (let key in form) formData.append(key, form[key]);

      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/api/projects${
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
        setForm({
          title: "",
          description: "",
          image: null,
          tags: "",
          liveUrl: "",
          githubUrl: "",
          category: "",
        });
        setPreview(null);
        setEditingId(null);
        fetchProjects();
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_URI}/api/projects/${id}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    if (data.success) {
      toast.success("Deleted successfully");
      fetchProjects();
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      image: null,
      tags: project.tags.join(", "),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      category: project.category,
    });
    setPreview(project.image);
    setEditingId(project._id);
    setFormVisible(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">🛠️ Projects</h2>
        <Button onClick={() => setFormVisible(!formVisible)} variant="outline">
          {formVisible ? (
            "Hide Form"
          ) : (
            <>
              {" "}
              <PlusCircle className="w-4 h-4 mr-2" /> Add Project{" "}
            </>
          )}
        </Button>
      </div>

      {formVisible && (
        <Card className="shadow-xl border rounded-2xl">
          <CardHeader>
            <CardTitle>
              {editingId ? "Update Project" : "Add New Project"}
            </CardTitle>
            <CardDescription>
              Fill all fields and upload your project image.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Project Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Project Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <Input
              placeholder="Live URL"
              value={form.liveUrl}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            />
            <Input
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : editingId ? (
                "Update Project"
              ) : (
                "Add Project"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((proj) => (
          <Card key={proj._id} className="rounded-xl shadow-md overflow-hidden">
            <img
              src={proj.image}
              alt={proj.title}
              className="w-full h-40 object-cover px-3"
            />
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold text-lg line-clamp-1">
                {proj.title}
              </h4>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {proj.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {proj.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 flex-wrap gap-2">
                <div className="flex flex-wrap gap-2">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border hover:bg-green-100 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
                      </Button>
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border hover:bg-gray-100 transition-all"
                      >
                        <Github className="w-4 h-4 text-gray-700 group-hover:scale-110 transition-transform" />
                      </Button>
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-yellow-100 transition-all"
                    onClick={() => handleEdit(proj)}
                  >
                    <Pencil className="w-4 h-4 text-yellow-600 hover:scale-110 transition-transform" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full hover:bg-red-100 transition-all"
                    onClick={() => handleDelete(proj._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
