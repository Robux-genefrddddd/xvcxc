import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Download,
  Share2,
  Trash2,
  Users,
  Palette,
  Search,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Copy,
} from "lucide-react";
import { auth, db, storage } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getBytes,
  deleteObject,
  listAll,
} from "firebase/storage";

interface FileItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  shared: boolean;
  shareUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("files");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    if (auth.currentUser) {
      setUserName(auth.currentUser.displayName || "User");
      setUserEmail(auth.currentUser.email || "");
    }
    const savedTheme = localStorage.getItem("app-theme") || "dark";
    setTheme(savedTheme);
    loadFiles();
    loadUsers();
  }, []);

  // ============= FILES MANAGEMENT =============
  const loadFiles = async () => {
    setLoading(true);
    try {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "files"),
        where("userId", "==", auth.currentUser.uid),
      );
      const docs = await getDocs(q);
      const fileList: FileItem[] = docs.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        size: doc.data().size,
        uploadedAt: new Date(doc.data().uploadedAt).toLocaleDateString(),
        shared: doc.data().shared || false,
        shareUrl: doc.data().shareUrl,
      }));
      setFiles(fileList);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    try {
      const fileRef = ref(
        storage,
        `files/${auth.currentUser.uid}/${Date.now()}_${file.name}`,
      );
      await uploadBytes(fileRef, file);

      const fileSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)}MB`
          : `${(file.size / 1024).toFixed(2)}KB`;

      await addDoc(collection(db, "files"), {
        userId: auth.currentUser.uid,
        name: file.name,
        size: fileSize,
        uploadedAt: new Date().toISOString(),
        shared: false,
        storagePath: fileRef.fullPath,
      });

      loadFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleShareFile = async (fileId: string) => {
    try {
      const shareUrl = `${window.location.origin}/share/${fileId}`;
      const fileRef = doc(db, "files", fileId);
      await updateDoc(fileRef, {
        shared: true,
        shareUrl: shareUrl,
      });
      loadFiles();
      alert("File shared! URL: " + shareUrl);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const handleDeleteFile = async (fileId: string, storagePath: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteDoc(doc(db, "files", fileId));
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      loadFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // ============= USERS MANAGEMENT =============
  const loadUsers = async () => {
    try {
      const docs = await getDocs(collection(db, "users"));
      const userList: User[] = docs.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        role: doc.data().role || "user",
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        createdAt: new Date().toISOString(),
      });
      setNewUserName("");
      setNewUserEmail("");
      loadUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    newRole: "admin" | "user",
  ) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // ============= THEME MANAGEMENT =============
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: theme === "dark" ? "#0E0E0F" : "#FFFFFF",
        backgroundImage:
          theme === "dark"
            ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222223' fill-opacity='0.08'%3E%3Cpath d='M29 30l-1-1 1-1 1 1-1 1M30 29l-1-1 1-1 1 1-1 1M30 31l-1 1 1 1 1-1-1-1M31 30l 1-1-1-1-1 1 1 1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            : "none",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-64 text-white p-6 flex flex-col fixed left-0 top-0 h-screen overflow-y-auto border-r"
        style={{
          backgroundColor: theme === "dark" ? "#111214" : "#F3F4F6",
          borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
          color: theme === "dark" ? "#FFFFFF" : "#111827",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 mb-10 hover:opacity-80 transition"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F91e2732f1c03487e879c66ee97e72712%2Fee08390eccc04e8dbea3ce5415d97e92?format=webp&width=800"
            alt="PinPinCloud"
            className="w-7 h-7"
          />
          <span className="text-lg font-bold">PinPinCloud</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {[
            { id: "files", label: "Files", icon: "📁" },
            { id: "users", label: "Manage Users", icon: "👥" },
            { id: "theme", label: "Theme", icon: "🎨" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id
                  ? theme === "dark"
                    ? "bg-blue-900 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                  : theme === "dark"
                    ? "text-gray-400 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div
          className="mt-6 p-4 rounded-lg border space-y-4"
          style={{
            backgroundColor: theme === "dark" ? "#141518" : "#F9FAFB",
            borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold"
              style={{
                backgroundColor: theme === "dark" ? "#1A2647" : "#DBEAFE",
                color: theme === "dark" ? "#FFFFFF" : "#1E40AF",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
              >
                {userName}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
              >
                {userEmail}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border"
            style={{
              backgroundColor: theme === "dark" ? "#0F1113" : "#F3F4F6",
              borderColor: theme === "dark" ? "#1F2124" : "#D1D5DB",
              color: theme === "dark" ? "#9CA3AF" : "#6B7280",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                theme === "dark" ? "#FFFFFF" : "#111827";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                theme === "dark" ? "#9CA3AF" : "#6B7280";
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        {/* Header */}
        <header
          className="border-b px-8 py-6 sticky top-0 z-40"
          style={{
            backgroundColor: theme === "dark" ? "#111214" : "#FFFFFF",
            borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
              >
                Welcome {userName}! 👋
              </h1>
              <p style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}>
                {activeTab === "files" && "Manage and share your files"}
                {activeTab === "users" && "Manage team members"}
                {activeTab === "theme" && "Customize your theme"}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* FILES TAB */}
          {activeTab === "files" && (
            <div className="space-y-6">
              {/* Upload Section */}
              <div
                className="rounded-lg border p-8 text-center"
                style={{
                  backgroundColor: theme === "dark" ? "#111214" : "#F9FAFB",
                  borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                  borderStyle: "dashed",
                }}
              >
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <Upload
                      className="w-10 h-10"
                      style={{
                        color: theme === "dark" ? "#60A5FA" : "#3B82F6",
                      }}
                    />
                    <div>
                      <p
                        className="font-semibold"
                        style={{
                          color: theme === "dark" ? "#FFFFFF" : "#111827",
                        }}
                      >
                        Click to upload or drag and drop
                      </p>
                      <p
                        style={{
                          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        PNG, JPG, PDF or any file up to 100MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Files List */}
              <div
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: theme === "dark" ? "#111214" : "#FFFFFF",
                  borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
                  >
                    My Files {files.length > 0 && `(${files.length})`}
                  </h2>
                </div>
                <div
                  className="divide-y"
                  style={{
                    borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                  }}
                >
                  {loading ? (
                    <div className="px-6 py-8 text-center">
                      <p
                        style={{
                          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        Loading files...
                      </p>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p
                        style={{
                          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        No files yet. Upload one to get started!
                      </p>
                    </div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-opacity-50"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "transparent" : "#F9FAFB",
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="font-medium"
                            style={{
                              color: theme === "dark" ? "#FFFFFF" : "#111827",
                            }}
                          >
                            {file.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                            }}
                          >
                            {file.size} • {file.uploadedAt}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.shared && (
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor:
                                  theme === "dark" ? "#1A2647" : "#DBEAFE",
                                color: theme === "dark" ? "#60A5FA" : "#1E40AF",
                              }}
                            >
                              Shared
                            </span>
                          )}
                          <button
                            onClick={() => handleShareFile(file.id)}
                            className="p-2 rounded hover:opacity-80"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id, file.name)}
                            className="p-2 rounded hover:opacity-80"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Add User */}
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: theme === "dark" ? "#111214" : "#F9FAFB",
                  borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
                >
                  Add New User
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: theme === "dark" ? "#141518" : "#FFFFFF",
                      borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                      color: theme === "dark" ? "#FFFFFF" : "#111827",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: theme === "dark" ? "#141518" : "#FFFFFF",
                      borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                      color: theme === "dark" ? "#FFFFFF" : "#111827",
                    }}
                  />
                  <select
                    value={newUserRole}
                    onChange={(e) =>
                      setNewUserRole(e.target.value as "admin" | "user")
                    }
                    className="px-4 py-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: theme === "dark" ? "#141518" : "#FFFFFF",
                      borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                      color: theme === "dark" ? "#FFFFFF" : "#111827",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleAddUser}
                    className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-80"
                    style={{
                      backgroundColor: theme === "dark" ? "#1A2647" : "#DBEAFE",
                      color: theme === "dark" ? "#60A5FA" : "#1E40AF",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Users List */}
              <div
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: theme === "dark" ? "#111214" : "#FFFFFF",
                  borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{
                    borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
                  >
                    Team Members
                  </h2>
                </div>
                <div
                  className="divide-y"
                  style={{
                    borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                  }}
                >
                  {users.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <p
                        style={{
                          color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                        }}
                      >
                        No users yet
                      </p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="px-6 py-4 flex items-center justify-between"
                      >
                        <div>
                          <p
                            className="font-medium"
                            style={{
                              color: theme === "dark" ? "#FFFFFF" : "#111827",
                            }}
                          >
                            {user.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: theme === "dark" ? "#9CA3AF" : "#6B7280",
                            }}
                          >
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateUserRole(
                                user.id,
                                e.target.value as "admin" | "user",
                              )
                            }
                            className="px-3 py-1 rounded text-sm border"
                            style={{
                              backgroundColor:
                                theme === "dark" ? "#141518" : "#FFFFFF",
                              borderColor:
                                theme === "dark" ? "#1F2124" : "#E5E7EB",
                              color: theme === "dark" ? "#FFFFFF" : "#111827",
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded hover:opacity-80"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* THEME TAB */}
          {activeTab === "theme" && (
            <div className="space-y-6">
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: theme === "dark" ? "#111214" : "#F9FAFB",
                  borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
                >
                  Select Theme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      id: "dark",
                      name: "Dark Mode",
                      color: "bg-slate-900",
                    },
                    {
                      id: "light",
                      name: "Light Mode",
                      color: "bg-white",
                    },
                    {
                      id: "blue",
                      name: "Blue Theme",
                      color: "bg-blue-900",
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        theme === t.id
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#141518" : "#FFFFFF",
                        borderColor:
                          theme === t.id
                            ? "#3B82F6"
                            : theme === "dark"
                              ? "#1F2124"
                              : "#E5E7EB",
                      }}
                    >
                      <div
                        className={`w-full h-20 rounded-lg mb-3 ${t.color}`}
                      ></div>
                      <p
                        className="font-medium"
                        style={{
                          color: theme === "dark" ? "#FFFFFF" : "#111827",
                        }}
                      >
                        {t.name}
                      </p>
                      {theme === t.id && (
                        <p
                          className="text-sm mt-2"
                          style={{ color: "#3B82F6" }}
                        >
                          ✓ Active
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
