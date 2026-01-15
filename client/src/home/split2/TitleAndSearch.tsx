import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface TitleAndSearchProps {
  searchTerm: string; 
  onSearch: (query: string) => void;
}

const TitleAndSearch: React.FC<TitleAndSearchProps> = ({ searchTerm, onSearch }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when active
  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive]);

  // Jodhi onno kothao theke search term ashe (jemon Tag click), tokhon auto open hobe
  useEffect(() => {
    if (searchTerm && !isSearchActive) {
      setIsSearchActive(true);
    }
  }, [searchTerm]);

  const handleClose = () => {
    setIsSearchActive(false);
    onSearch(""); 
  };

  return (
    <div className="w-full h-[10%] flex items-center pl-4 py-2 relative">
      <div className="flex items-center space-x-4 w-full pr-4">
        
        {!isSearchActive ? (
          <>
            <p className="bg-[linear-gradient(90deg,rgba(199,191,200,1)_0%,rgba(174,79,133,1)_50%,rgba(217,77,133,1)_75%,rgba(222,69,94,1)_100%)] bg-clip-text text-transparent font-semibold text-2xl whitespace-nowrap transition-opacity duration-300">
              Who’s trending near you
            </p>
            <Search 
              className="w-8 h-auto text-white cursor-pointer hover:text-pink-500 transition-colors" 
              onClick={() => setIsSearchActive(true)}
            />
          </>
        ) : (
          <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-5 duration-300">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm} // Controlled Input (Syncs with Tag Click)
              placeholder="Search people or #tags..."
              className="w-full bg-[#2A284D] text-white px-4 py-2 rounded-full outline-none border border-white/20 focus:border-pink-500 transition-all placeholder:text-gray-400"
              onChange={(e) => onSearch(e.target.value)}
            />
            <button 
              onClick={handleClose}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TitleAndSearch;