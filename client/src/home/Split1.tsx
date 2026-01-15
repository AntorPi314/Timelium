import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PostCard from "../components/ui/PostCard";
import toast from "react-hot-toast";

interface Post {
  _id: string;
  content: string;
  image?: string;
  createdAt: string;
  user: {
    _id: string;
    fullname: string;
    username: string;
    avatar: string;
  };
  likes: string[];
}

const Split1 = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Stores current search query

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch Logic
  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let response;

      const params = query ? { q: query } : {};

      if (token && currentUser) {
        // Logged in: Fetch Personalized Feed + Optional Search
        response = await axios.get(`${API_URL}/posts/feed`, {
          headers: { Authorization: `Bearer ${token}` },
          params: params
        });
      } else {
        // Guest: Fetch Generic Feed + Optional Search
        response = await axios.get(`${API_URL}/posts`, {
            params: params
        });
      }
      
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch & Listener for Search Event from Split0
  useEffect(() => {
    // Initial Load
    fetchPosts();

    // Event Listener Handler
    const handleSearchEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        const query = customEvent.detail;
        setSearchQuery(query);
        fetchPosts(query); // Refetch with new query
    };

    window.addEventListener('post-search-trigger', handleSearchEvent);

    return () => {
        window.removeEventListener('post-search-trigger', handleSearchEvent);
    };
  }, [API_URL]);


  const handleToggleLike = async (postId: string) => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

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
      // Update local state
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

  return (
    <div className="w-[43%] h-full bg-[#33175B] flex flex-col">
      {/* Header */}
      <div className="w-full h-14 flex items-center justify-center border-b border-white/10">
        <h2 className="text-white text-2xl font-semibold tracking-wide">
          {searchQuery ? `Search: "${searchQuery}"` : (currentUser ? "Your Feed" : "Trending")}
        </h2>
      </div>

      {/* Posts Scroll Section */}
      <div className="flex-1 w-full px-6 py-8 space-y-8 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-pink-500" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              avatarUrl={post.user?.avatar || "https://i.imgur.com/6VBx3io.jpeg"}
              name={post.user?.fullname || "Anonymous"}
              // [FIXED] Passing username so click works
              username={post.user?.username || ""} 
              likes={post.likes.length}
              time={new Date(post.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              content={post.content}
              images={post.image ? [post.image] : []}
              liked={currentUser ? post.likes.includes(currentUser.id) : false}
              onToggleLike={() => handleToggleLike(post._id)}
            />
          ))
        ) : (
          <div className="text-center text-white/50 py-20">
            <p className="text-xl">No posts found</p>
            {searchQuery ? (
                 <p className="text-sm mt-2">Try searching for something else.</p>
            ) : (
                 <p className="text-sm mt-2">Be the first to share something!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Split1;