import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchProfileCard from "../../components/ui/SearchProfileCard";
import toast from "react-hot-toast";

interface User {
  _id: string;
  fullname: string;
  username: string;
  avatar: string;
  skills: string[];
}

interface SearchResultProps {
  query: string;
  onTagClick: (tag: string) => void; // New prop to handle tag clicks
}

const SearchResult: React.FC<SearchResultProps> = ({ query, onTagClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        let response;
        
        if (query.trim()) {
          response = await axios.get(`${API_URL}/users/search`, {
            params: { q: query }
          });
          setUsers(response.data);
        } else {
          response = await axios.get(`${API_URL}/users`);
          const shuffled = response.data.sort(() => 0.5 - Math.random());
          const randomUsers = shuffled.slice(0, Math.min(5, shuffled.length));
          setUsers(randomUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [API_URL, query]);

  const handleViewProfile = (username: string) => {
    navigate(`/${username}`);
  };

  if (loading) {
    return (
      <div className="w-full h-[40%] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-pink-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full h-[40%] flex items-center justify-center">
        <p className="text-white/50 text-sm">
          {query ? "No match found" : "No users found"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[40%] items-center flex flex-col overflow-y-auto no-scrollbar pt-2 pb-4">
      {users.map((user) => (
        <SearchProfileCard
          key={user._id}
          name={user.fullname}
          tags={user.skills?.length > 0 ? user.skills : ["No Skills"]}
          avatar={user.avatar || "https://i.imgur.com/6VBx3io.jpeg"}
          onView={() => handleViewProfile(user.username)}
          onTagClick={onTagClick} // Pass the handler down
        />
      ))}
    </div>
  );
};

export default SearchResult;