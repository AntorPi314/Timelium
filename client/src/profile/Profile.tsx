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
  Code,
  FolderGit2,
} from "lucide-react";
import PostCard from "../components/ui/PostCard";
import EditProfileDialog, {
  type UserProfileData,
} from "../components/ui/EditProfileDialog";
import CreatePostDialog from "../components/ui/CreatePostDialog";
import AddSkillDialog from "../components/ui/AddSkillDialog";
import AddProjectDialog from "../components/ui/AddProjectDialog";
import AddExperienceDialog from "../components/ui/AddExperienceDialog";
import AddEducationDialog from "../components/ui/AddEducationDialog";

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

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Posts");
  const tabs = ["Posts", "Skills", "Projects", "Experience", "Education"];

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

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
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isMyProfile = currentUser?.username === username;

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
        });

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
      };

      await axios.put(`${API_URL}/users/profile/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(updatedData);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Update failed.");
    }
  };

  const handleOpenDialog = () => {
    if (activeTab === "Posts") {
      setIsCreatePostOpen(true);
    } else if (activeTab === "Skills") {
      setIsAddSkillOpen(true);
    } else if (activeTab === "Projects") {
      setIsAddProjectOpen(true);
    } else if (activeTab === "Experience") {
      setIsAddExperienceOpen(true);
    } else if (activeTab === "Education") {
      setIsAddEducationOpen(true);
    }
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 z-10 gap-6">
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
                    <span className="absolute bottom-0 left-0 w-8 h-1 bg-white rounded-full transition-all duration-300" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <button className="bg-white text-[#2E1065] px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-lg">
            <MessageSquare className="fill-[#2E1065]" size={18} />
            Hire me
          </button>
        </div>

        {/* GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 z-10 h-full">
          {/* Left Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2">
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

            {activeTab === "Skills" && (
              <SkillsSection skills={skills} isMyProfile={isMyProfile} onAdd={() => setIsAddSkillOpen(true)} />
            )}

            {activeTab === "Projects" && (
              <ProjectsSection projects={projects} isMyProfile={isMyProfile} onAdd={() => setIsAddProjectOpen(true)} />
            )}

            {activeTab === "Experience" && (
              <ExperienceSection
                experience={experience}
                isMyProfile={isMyProfile}
                onAdd={() => setIsAddExperienceOpen(true)}
              />
            )}

            {activeTab === "Education" && (
              <EducationSection
                education={education}
                isMyProfile={isMyProfile}
                onAdd={() => setIsAddEducationOpen(true)}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
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
                className="bg-[#D4E936] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 mb-4 hover:bg-[#c3d632] transition shadow-lg hover:shadow-[#D4E936]/20"
              >
                <PlusCircle size={18} className="text-black" />
                Create Post
              </button>
            ) : (
              <button className="bg-[#D4E936] text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 mb-4 hover:bg-[#c3d632] transition">
                <PlusCircle size={18} className="text-black" />
                Follow
              </button>
            )}

            <div className="flex items-center justify-center gap-3">
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

            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              {profile.title || "No Title Added"}
            </p>

            <div className="flex items-center gap-4 mb-8">
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

            <div className="text-left w-full mb-6">
              <h3 className="text-pink-500 text-xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={18} /> Location
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                {profile.location || "N/A"}
              </p>
            </div>

            <div className="text-left w-full">
              <h3 className="text-pink-500 text-xl font-bold mb-2">About</h3>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {profile.about || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
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
            onSkillAdded={fetchProfileAndPosts}
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

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-white/50 text-center py-10 bg-[#1F1D47] rounded-2xl">
    {message}
  </div>
);

const SkillsSection = ({
  skills,
  isMyProfile,
  onAdd,
}: {
  skills: string[];
  isMyProfile: boolean;
  onAdd: () => void;
}) => (
  <div className="bg-[#1F1D47] rounded-2xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Code size={24} className="text-pink-500" /> Skills
      </h2>
      {isMyProfile && (
        <button onClick={onAdd} className="text-pink-500 hover:text-pink-400 transition">
          <Plus size={20} />
        </button>
      )}
    </div>
    {skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="bg-purple-600/30 text-white px-4 py-2 rounded-full text-sm font-medium border border-purple-500/50"
          >
            {skill}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-white/50">No skills added yet.</p>
    )}
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
  <div className="bg-[#1F1D47] rounded-2xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <FolderGit2 size={24} className="text-pink-500" /> Projects
      </h2>
      {isMyProfile && (
        <button onClick={onAdd} className="text-pink-500 hover:text-pink-400 transition">
          <Plus size={20} />
        </button>
      )}
    </div>
    {projects.length > 0 ? (
      <div className="space-y-4">
        {projects.map((project, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-4 rounded-xl border border-white/10"
          >
            <h3 className="text-white font-bold text-lg mb-2">
              {project.title}
            </h3>
            <p className="text-white/70 text-sm mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies?.map((tech: string, j: number) => (
                <span
                  key={j}
                  className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs"
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
                className="text-pink-400 hover:text-pink-300 text-sm underline"
              >
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50">No projects added yet.</p>
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
  <div className="bg-[#1F1D47] rounded-2xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Briefcase size={24} className="text-pink-500" /> Experience
      </h2>
      {isMyProfile && (
        <button onClick={onAdd} className="text-pink-500 hover:text-pink-400 transition">
          <Plus size={20} />
        </button>
      )}
    </div>
    {experience.length > 0 ? (
      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-4 rounded-xl border border-white/10"
          >
            <h3 className="text-white font-bold text-lg">{exp.position}</h3>
            <p className="text-pink-400 text-sm mb-2">{exp.company}</p>
            <p className="text-white/60 text-xs mb-3">{exp.duration}</p>
            <p className="text-white/70 text-sm">{exp.description}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50">No experience added yet.</p>
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
  <div className="bg-[#1F1D47] rounded-2xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <GraduationCap size={24} className="text-pink-500" /> Education
      </h2>
      {isMyProfile && (
        <button onClick={onAdd} className="text-pink-500 hover:text-pink-400 transition">
          <Plus size={20} />
        </button>
      )}
    </div>
    {education.length > 0 ? (
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div
            key={i}
            className="bg-[#2A284D] p-4 rounded-xl border border-white/10"
          >
            <h3 className="text-white font-bold text-lg">{edu.degree}</h3>
            <p className="text-pink-400 text-sm mb-2">{edu.institution}</p>
            <p className="text-white/60 text-xs mb-2">{edu.field}</p>
            <p className="text-white/70 text-sm">{edu.year}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-white/50">No education added yet.</p>
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