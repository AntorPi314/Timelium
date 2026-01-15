import React from "react";
import { FolderGit2, Plus, ExternalLink, Trash2 } from "lucide-react";

interface Project {
  title: string;
  description: string;
  technologies?: string[];
  link?: string;
  image?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  isMyProfile: boolean;
  onAdd: () => void;
  onDelete?: (index: number) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isMyProfile,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="bg-[#1F1D47] rounded-3xl p-8 border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <FolderGit2 size={24} className="text-pink-500" />
          </div>
          Featured Projects
        </h2>
        {isMyProfile && (
          <button
            onClick={onAdd}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-pink-500 rounded-full transition-all duration-300"
          >
            <span className="text-sm font-medium text-pink-500 group-hover:text-white">
              Add Project
            </span>
            <Plus size={16} className="text-pink-500 group-hover:text-white" />
          </button>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative bg-[#2A284D] hover:bg-[#2f2c54] p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
            >
              {/* Delete Button */}
              {isMyProfile && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(i);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/40 hover:text-red-500 hover:bg-white/10 transition z-10 opacity-0 group-hover:opacity-100"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="flex justify-between items-start mb-3 pr-8">
                <h3 className="text-white font-bold text-xl leading-tight group-hover:text-pink-400 transition-colors">
                  {project.title}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/5 rounded-full hover:bg-pink-500 text-white/50 hover:text-white transition-all"
                    title="View Project"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              <p className="text-white/60 text-sm mb-6 leading-relaxed line-clamp-3 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                {project.technologies?.map((tech, j) => (
                  <span
                    key={j}
                    className="bg-[#1F1D47] text-cyan-300 px-3 py-1 rounded-md text-[11px] font-semibold border border-cyan-500/10 tracking-wide"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <FolderGit2 className="mx-auto h-12 w-12 text-white/20 mb-3" />
          <p className="text-white/40 italic">Showcase your best work here.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
