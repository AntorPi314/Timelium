import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  MessageSquare,
  Linkedin,
  Youtube,
  Facebook,
  PlusCircle,
  UserRoundPen,
  MapPin,
  Github,
  Loader2,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  LayoutGrid,
} from "lucide-react";

// Components
import PostCard from "../components/ui/PostCard";
import EditProfileDialog, {
  type UserProfileData,
} from "../components/ui/EditProfileDialog";
import CreatePostDialog from "../components/ui/CreatePostDialog";
import AddProjectDialog from "../components/ui/AddProjectDialog";
import AddExperienceDialog from "../components/ui/AddExperienceDialog";
import AddEducationDialog from "../components/ui/AddEducationDialog";
import ShowHireMeDialog, {
  HireMeData,
} from "../components/ui/ShowHireMeDialog";
import SkillCategoryCard from "../components/ui/SkillCategoryCard";
import AddSkillDialog from "../components/ui/AddSkillDialog";


// Interfaces
interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  likes: string[];
}

// Updated Skill Interface
interface SkillCategory {
  title: string;
  items: string[];
}

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Posts");
  const tabs = ["Posts", "Skills", "Projects", "Experience", "Education"];

  // Dialog States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]); // Array of Categories
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
 

  // New Skill Input State
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const [profile, setProfile] = useState<UserProfileData>({
    avatar: null,
    name: null,
    title: null,
    location: null,
    about: null,
    linkedin: null,
    youtube: null,
    github: null,
    facebook: null,
    hireMe: {
      whatsapp: null,
      messenger: null,
      telegram: null,
      contactEmail: null,
    },
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isMyProfile = currentUser?.username === username;

  // --- Handlers ---

  const handleToggleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to like posts");
        return;
      }

      await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(currentUser.id);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== currentUser.id)
                : [...post.likes, currentUser.id],
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Like toggle failed", error);
      toast.error("Failed to update like");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully");
      fetchProfileAndPosts();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete post");
    }
  };

  const handleHireMeSave = async (data: HireMeData) => {
    const updatedProfile = { ...profile, hireMe: data };
    await handleSaveProfile(updatedProfile);
  };

  // --- SKILL BOARD HANDLERS ---

  // Helper to save to backend
  const saveSkillsToBackend = async (updatedSkills: SkillCategory[]) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/users/profile/update`,
        { skills: updatedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to sync skills", error);
      toast.error("Failed to save changes");
    }
  };

  // 1. Add New Card (Category)
  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) return;

    const newSkillCategory: SkillCategory = {
      title: newCategoryTitle,
      items: [],
    };

    const updatedSkills = [...skills, newSkillCategory];
    setSkills(updatedSkills);
    setNewCategoryTitle("");
    toast.success("Category added!");
    await saveSkillsToBackend(updatedSkills);
  };

  // 2. Delete Card
  const handleDeleteCategory = async (index: number) => {
    if (!window.confirm("Delete this category?")) return;

    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    toast.success("Category deleted");
    await saveSkillsToBackend(updatedSkills);
  };

  // 3. Add Item to Card
  const handleAddItemToCategory = async (
    categoryIndex: number,
    item: string
  ) => {
    const updatedSkills = skills.map((cat, i) =>
      i === categoryIndex ? { ...cat, items: [...cat.items, item] } : cat
    );
    setSkills(updatedSkills);
    await saveSkillsToBackend(updatedSkills);
  };

  // 4. Delete Item from Card
  const handleDeleteItemFromCategory = async (
    categoryIndex: number,
    itemIndex: number
  ) => {
    const updatedSkills = skills.map((cat, i) =>
      i === categoryIndex
        ? { ...cat, items: cat.items.filter((_, j) => j !== itemIndex) }
        : cat
    );
    setSkills(updatedSkills);
    await saveSkillsToBackend(updatedSkills);
  };

  // --- DATA FETCHING ---

  const fetchProfileAndPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/users/${username}`);
      const userData = res.data;

      if (userData) {
        setProfile({
          avatar: userData.avatar,
          name: userData.fullname,
          title: userData.title,
          location: userData.location,
          about: userData.about,
          linkedin: userData.links?.linkedin,
          youtube: userData.links?.youtube,
          github: userData.links?.github,
          facebook: userData.links?.facebook,
          hireMe: userData.hireMe || {
            whatsapp: null,
            messenger: null,
            telegram: null,
            contactEmail: null,
          },
        });

        // Set Skills (Assuming backend returns array of objects now)
        setSkills(userData.skills || []);

        setProjects(userData.projects || []);
        setExperience(userData.experience || []);
        setEducation(userData.education || []);

        if (userData._id) {
          const postRes = await axios.get(
            `${API_URL}/posts/user/${userData._id}`
          );
          setPosts(postRes.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Could not load profile data.");
    } finally {
      setLoading(false);
    }
  }, [username, API_URL]);

  useEffect(() => {
    if (username) fetchProfileAndPosts();
  }, [username, fetchProfileAndPosts]);

  const handleSaveProfile = async (updatedData: UserProfileData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized");

      const payload = {
        fullname: updatedData.name,
        title: updatedData.title,
        location: updatedData.location,
        about: updatedData.about,
        avatar: updatedData.avatar,
        links: {
          linkedin: updatedData.linkedin,
          youtube: updatedData.youtube,
          github: updatedData.github,
          facebook: updatedData.facebook,
        },
        hireMe: updatedData.hireMe,
      };

      await axios.put(`${API_URL}/users/profile/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(updatedData);

      if (isMyProfile) {
        const updatedUser = {
          ...currentUser,
          fullname: updatedData.name,
          avatar: updatedData.avatar,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-update"));
      }

      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleAddSkillCategory = async (title: string) => {
    try {
      const token = localStorage.getItem("token");
      const newCategory = { title, items: [] };
      const updatedSkills = [...skills, newCategory];

      await axios.put(
        `${API_URL}/users/profile/update`,
        { skills: updatedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSkills(updatedSkills);
      toast.success("New category added!");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleOpenDialog = () => {
    if (activeTab === "Posts") setIsCreatePostOpen(true);
    else if (activeTab === "Projects") setIsAddProjectOpen(true);
    else if (activeTab === "Experience") setIsAddExperienceOpen(true);
    else if (activeTab === "Education") setIsAddEducationOpen(true);
    else if (activeTab === "Skills") setIsAddSkillOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#381B5E] flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-10 h-10 text-pink-500" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#381B5E] p-4 md:p-4 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1400px] bg-[#2E1065] rounded-[40px] p-6 md:p-4 shadow-2xl h-[90vh] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-10 z-10 gap-6 shrink-0">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <h1 className="text-4xl font-cursive text-white italic font-bold">
              Hi, {profile.name || username}
            </h1>

            {isMyProfile && (
              <button
                onClick={handleOpenDialog}
                className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition"
              >
                <Plus size={24} />
              </button>
            )}

            <nav className="hidden md:flex items-center gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-lg font-medium transition-all duration-300 relative pb-1 ${
                    activeTab === tab
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full transition-all duration-300" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => setIsHireMeOpen(true)}
            className="bg-white text-[#2E1065] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-lg active:scale-95"
          >
            <MessageSquare className="fill-[#2E1065]" size={18} />
            {isMyProfile ? "Edit Contact Info" : "Hire me"}
          </button>
        </div>

        {/* GRID CONTENT (Full Height & Scrollable) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 z-10 h-full overflow-hidden">
          {/* Left Content Area (Scrollable) */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2 h-full pb-24">
            {/* POSTS TAB */}
            {activeTab === "Posts" && (
              <>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post._id}
                      avatarUrl={
                        post.user?.avatar || "https://i.imgur.com/6VBx3io.jpeg"
                      }
                      name={post.user?.fullname || "User"}
                      username={post.user?.username || ""}
                      likes={post.likes.length}
                      time={new Date(post.createdAt).toLocaleDateString()}
                      content={post.content}
                      images={post.image ? [post.image] : []}
                      liked={post.likes.includes(currentUser.id)}
                      onToggleLike={() => handleToggleLike(post._id)}
                      onDelete={
                        isMyProfile
                          ? () => handleDeletePost(post._id)
                          : undefined
                      }
                    />
                  ))
                ) : (
                  <EmptyState message="No posts yet." />
                )}
              </>
            )}

            {/* SKILLS TAB (NEW DESIGN) */}
            {activeTab === "Skills" && (
              <div className="space-y-6">

                {/* Categories Grid */}
                {skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.map((category, index) => (
                      <SkillCategoryCard
                        key={index}
                        id={index}
                        title={category.title}
                        items={category.items}
                        isMyProfile={isMyProfile}
                        onDeleteCard={() => handleDeleteCategory(index)}
                        onAddItem={(item) =>
                          handleAddItemToCategory(index, item)
                        }
                        onDeleteItem={(itemIndex) =>
                          handleDeleteItemFromCategory(index, itemIndex)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No skill categories added yet." />
                )}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "Projects" && (
              <ProjectsSection
                projects={projects}
                isMyProfile={isMyProfile}
                onAdd={() => setIsAddProjectOpen(true)}
              />
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === "Experience" && (
              <ExperienceSection
                experience={experience}
                isMyProfile={isMyProfile}
                onAdd={() => setIsAddExperienceOpen(true)}
              />
            )}

            {/* EDUCATION TAB */}
            {activeTab === "Education" && (
              <EducationSection
                education={education}
                isMyProfile={isMyProfile}
                onAdd={() => setIsAddEducationOpen(true)}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col items-center text-center overflow-y-auto no-scrollbar h-full pb-24">
            <div className="relative mb-4 group shrink-0">
              <div className="w-40 h-40 rounded-full p-[4px] bg-gradient-to-tr from-blue-400 to-purple-500">
                <img
                  src={profile.avatar || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#2E1065] bg-white"
                />
              </div>
            </div>

            {isMyProfile ? (
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-[#D4E936] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 mb-4 hover:bg-[#c3d632] transition shadow-lg hover:shadow-[#D4E936]/20 shrink-0"
              >
                <PlusCircle size={18} className="text-black" />
                Create Post
              </button>
            ) : (
              <button className="bg-[#D4E936] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 mb-4 hover:bg-[#c3d632] transition shrink-0">
                <PlusCircle size={18} className="text-black" />
                Follow
              </button>
            )}

            <div className="flex items-center justify-center gap-3 shrink-0">
              <h2 className="text-3xl font-bold text-white mb-2 capitalize">
                {profile.name || username}
              </h2>
              {isMyProfile && (
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="hover:bg-white/10 p-2 rounded-full transition"
                >
                  <UserRoundPen className="text-pink-500 w-6 h-6" />
                </button>
              )}
            </div>

            <p className="text-white/80 text-sm mb-6 leading-relaxed shrink-0">
              {profile.title || "No Title Added"}
            </p>

            <div className="flex items-center gap-4 mb-8 shrink-0">
              {profile.linkedin && (
                <SocialIcon
                  icon={<Linkedin size={20} />}
                  color="bg-[#0077B5]"
                  link={profile.linkedin}
                />
              )}
              {profile.github && (
                <SocialIcon
                  icon={<Github size={20} />}
                  color="bg-[#333]"
                  link={profile.github}
                />
              )}
              {profile.youtube && (
                <SocialIcon
                  icon={<Youtube size={20} />}
                  color="bg-[#FF0000]"
                  link={profile.youtube}
                />
              )}
              {profile.facebook && (
                <SocialIcon
                  icon={<Facebook size={20} />}
                  color="bg-[#1877F2]"
                  link={profile.facebook}
                />
              )}
            </div>

            <div className="text-left w-full mb-6 shrink-0">
              <h3 className="text-pink-500 text-xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={18} /> Location
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-3 break-words">
                {profile.location || "N/A"}
              </p>
            </div>

            <div className="text-left w-full shrink-0">
              <h3 className="text-pink-500 text-xl font-bold mb-2">About</h3>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {profile.about || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL MODALS */}
      <ShowHireMeDialog
        open={isHireMeOpen}
        onClose={() => setIsHireMeOpen(false)}
        isOwnProfile={isMyProfile}
        ownerName={profile.name || "User"}
        initialData={
          profile.hireMe || {
            whatsapp: null,
            messenger: null,
            telegram: null,
            contactEmail: null,
          }
        }
        onSave={handleHireMeSave}
      />

      {/* ACTION MODALS */}
      {isMyProfile && (
        <>
          <EditProfileDialog
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            profileData={profile}
            onSave={handleSaveProfile}
          />

          <CreatePostDialog
            open={isCreatePostOpen}
            onClose={() => setIsCreatePostOpen(false)}
            onPostCreated={fetchProfileAndPosts}
          />

          <AddSkillDialog
            open={isAddSkillOpen}
            onClose={() => setIsAddSkillOpen(false)}
            onSkillAdded={handleAddSkillCategory}
          />

          <AddProjectDialog
            open={isAddProjectOpen}
            onClose={() => setIsAddProjectOpen(false)}
            onProjectAdded={fetchProfileAndPosts}
          />

          <AddExperienceDialog
            open={isAddExperienceOpen}
            onClose={() => setIsAddExperienceOpen(false)}
            onExperienceAdded={fetchProfileAndPosts}
          />

          <AddEducationDialog
            open={isAddEducationOpen}
            onClose={() => setIsAddEducationOpen(false)}
            onEducationAdded={fetchProfileAndPosts}
          />
        </>
      )}
    </div>
  );
};

// --- Helper Components ---

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-white/50 text-center py-10 bg-[#1F1D47] rounded-2xl border border-white/5">
    {message}
  </div>
);

const ProjectsSection = ({
  projects,
  isMyProfile,
  onAdd,
}: {
  projects: any[];
  isMyProfile: boolean;
  onAdd: () => void;
}) => (
  <div className="bg-[#1F1D47] rounded-2xl p-6 border border-white/5">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <FolderGit2 size={24} className="text-pink-500" /> Projects
      </h2>
      {isMyProfile && (
        <button
          onClick={onAdd}
          className="text-pink-500 hover:text-pink-400 transition"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
    {projects.length > 0 ? (
      <div className="space-y-4">
        {projects.map((project, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-5 rounded-xl border border-white/10 hover:border-pink-500/30 transition"
          >
            <h3 className="text-white font-bold text-lg mb-2">
              {project.title}
            </h3>
            <p className="text-white/70 text-sm mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies?.map((tech: string, j: number) => (
                <span
                  key={j}
                  className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 hover:text-pink-300 text-sm font-medium hover:underline"
              >
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50 italic">No projects added yet.</p>
    )}
  </div>
);

const ExperienceSection = ({
  experience,
  isMyProfile,
  onAdd,
}: {
  experience: any[];
  isMyProfile: boolean;
  onAdd: () => void;
}) => (
  <div className="bg-[#1F1D47] rounded-2xl p-6 border border-white/5">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Briefcase size={24} className="text-pink-500" /> Experience
      </h2>
      {isMyProfile && (
        <button
          onClick={onAdd}
          className="text-pink-500 hover:text-pink-400 transition"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
    {experience.length > 0 ? (
      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-5 rounded-xl border border-white/10"
          >
            <h3 className="text-white font-bold text-lg">{exp.position}</h3>
            <p className="text-pink-400 text-sm font-medium mb-1">
              {exp.company}
            </p>
            <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">
              {exp.duration}
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50 italic">No experience added yet.</p>
    )}
  </div>
);

const EducationSection = ({
  education,
  isMyProfile,
  onAdd,
}: {
  education: any[];
  isMyProfile: boolean;
  onAdd: () => void;
}) => (
  <div className="bg-[#1F1D47] rounded-2xl p-6 border border-white/5">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <GraduationCap size={24} className="text-pink-500" /> Education
      </h2>
      {isMyProfile && (
        <button
          onClick={onAdd}
          className="text-pink-500 hover:text-pink-400 transition"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
    {education.length > 0 ? (
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-5 rounded-xl border border-white/10"
          >
            <h3 className="text-white font-bold text-lg">{edu.degree}</h3>
            <p className="text-pink-400 text-sm font-medium mb-1">
              {edu.institution}
            </p>
            <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">
              {edu.field}
            </p>
            <p className="text-white/70 text-sm">{edu.year}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50 italic">No education added yet.</p>
    )}
  </div>
);

const SocialIcon = ({
  icon,
  color,
  link,
}: {
  icon: React.ReactNode;
  color: string;
  link: string;
}) => (
  <a
    href={link.startsWith("http") ? link : `https://${link}`}
    target="_blank"
    rel="noreferrer"
    className={`${color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg cursor-pointer`}
  >
    {icon}
  </a>
);

export default Profile;
