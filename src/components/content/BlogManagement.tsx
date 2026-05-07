// src/pages/Admin/content/BlogManagement.tsx
import React, { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url: string;
  status: string;
  views: number;
  created_at: string;
}

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // READ - Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to load blogs");
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  };

  // Image upload to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("blogs")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image");
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("blogs").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image (JPEG, PNG, WebP, or GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  // CREATE - Add new blog
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const uploadedImageUrl = await uploadImage(imageFile);
    if (!uploadedImageUrl) {
      alert("Failed to upload image");
      return;
    }

    const { error } = await supabase.from("blogs").insert([
      {
        title,
        content,
        image_url: uploadedImageUrl,
        status: "published",
        user_id: user?.id,
      },
    ]);

    if (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog");
    } else {
      alert("Blog created successfully!");
      resetForm();
      fetchBlogs();
      setShowForm(false);
    }
  };

  // UPDATE - Edit existing blog
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBlog) return;

    let uploadedImageUrl = editingBlog.image_url;

    if (imageFile) {
      const newImageUrl = await uploadImage(imageFile);
      if (!newImageUrl) {
        alert("Failed to upload image");
        return;
      }
      uploadedImageUrl = newImageUrl;
    }

    const { error } = await supabase
      .from("blogs")
      .update({
        title,
        content,
        image_url: uploadedImageUrl,
        status: "published",
      })
      .eq("id", editingBlog.id);

    if (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog");
    } else {
      alert("Blog updated successfully!");
      resetForm();
      fetchBlogs();
      setShowForm(false);
      setEditingBlog(null);
    }
  };

  // DELETE - Remove blog
  const handleDelete = async (id: number, imageUrl?: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    if (imageUrl) {
      const imagePath = imageUrl.split("/").pop();
      if (imagePath) {
        await supabase.storage
          .from("blogs")
          .remove([imagePath])
          .catch(console.error);
      }
    }

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    } else {
      alert("Blog deleted successfully!");
      fetchBlogs();
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setImageUrl(blog.image_url || "");
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setImageFile(null);
    setEditingBlog(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create New Blog
        </button>
      </div>

      <div className="space-y-4">
        {blogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No blogs yet. Create your first blog!
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {blog.content}
                  </p>
                  {blog.image_url && (
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-32 h-32 object-cover rounded mb-2"
                    />
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Views: {blog.views}</span>
                    <span>Created: {formatDate(blog.created_at)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id, blog.image_url)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h2>

            <form onSubmit={editingBlog ? handleUpdate : handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image * (Required)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    required={!editingBlog}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingImage && (
                    <p className="text-sm text-blue-600 mt-1">
                      Uploading image...
                    </p>
                  )}
                  {imageUrl && !uploadingImage && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      {editingBlog && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current image preview. Choose new file to change.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : editingBlog
                        ? "Update"
                        : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
