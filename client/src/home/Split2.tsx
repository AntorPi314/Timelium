import { useState } from 'react';
import TimeliumAI from './split2/TimeliumAI';
import TitleAndSearch from './split2/TitleAndSearch';
import SearchResult from './split2/SearchResult';

const Split2 = () => {
  // Search state parent e manage hobe
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className='w-[32%] h-full bg-[#381B5E] flex flex-col'>
      {/* Input box e current value pathano hocche jate tag click korle input update hoy */}
      <TitleAndSearch 
        searchTerm={searchQuery} 
        onSearch={setSearchQuery} 
      />
      
      {/* SearchResult e function pass kora hocche jate tag click korle query update hoy */}
      <SearchResult 
        query={searchQuery} 
        onTagClick={setSearchQuery} 
      />
      
      <TimeliumAI/>
    </div>
  );
};

export default Split2;