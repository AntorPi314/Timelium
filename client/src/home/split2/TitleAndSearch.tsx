import { Search } from "lucide-react";

const TitleAndSearch = () => {
  return (
    <div className="w-full h-[10%] flex items-center pl-4 py-2">
      <div className="flex items-center space-x-4">
        <p className="bg-[linear-gradient(90deg,rgba(199,191,200,1)_0%,rgba(174,79,133,1)_50%,rgba(217,77,133,1)_75%,rgba(222,69,94,1)_100%)] bg-clip-text text-transparent font-semibold text-2xl whitespace-nowrap">
          Who’s trending near you
        </p>
        <Search className="w-8 h-auto text-white" />
      </div>
    </div>
  );
};

export default TitleAndSearch;
