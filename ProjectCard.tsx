
import React from 'react';
import { ProjectSuggestion } from '../types';

interface ProjectCardProps {
  project: ProjectSuggestion;
  onSelect: (project: ProjectSuggestion) => void;
  isGeneratingRoadmap: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, isGeneratingRoadmap }) => {
  return (
    <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center space-x-2">
           <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">
            {project.difficulty}
          </span>
        </div>
        <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest flex items-center">
          <i className="far fa-clock mr-1.5"></i> {project.estimatedTime}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors font-lexend leading-tight relative z-10">
        {project.title}
      </h3>
      
      <p className="text-slate-500 text-xs font-medium mb-6 flex-grow leading-relaxed relative z-10">
        {project.description}
      </p>

      <div className="space-y-6 relative z-10">
        <div>
          <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-2">Core Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="bg-slate-50 text-slate-500 text-[8px] px-2 py-1 rounded-lg font-bold uppercase tracking-widest border border-slate-100">
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && <span className="text-[8px] font-bold text-slate-300 flex items-center">+{project.techStack.length - 4} more</span>}
          </div>
        </div>

        {project.sourceUrls && project.sourceUrls.length > 0 && (
          <div className="pt-4 border-t border-slate-50">
            <div className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center">
              <i className="fas fa-search-nodes mr-1.5"></i> Academic Sources
            </div>
            <div className="space-y-1.5">
              {project.sourceUrls.map((url, i) => (
                <a 
                  key={i} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[9px] text-slate-400 hover:text-blue-500 font-bold truncate flex items-center group/link transition-colors"
                >
                  <i className="fas fa-arrow-up-right-from-square mr-2 opacity-30 group-hover/link:opacity-100 text-[7px]"></i>
                  {new URL(url).hostname.replace('www.', '')}
                </a>
              ))}
            </div>
          </div>
        )}

        <button
          disabled={isGeneratingRoadmap}
          onClick={() => onSelect(project)}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center group/btn shadow-xl shadow-slate-100 disabled:opacity-50"
        >
          {isGeneratingRoadmap ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <>
              <span>Build Roadmap</span>
              <i className="fas fa-chevron-right ml-2 text-[8px] group-hover/btn:translate-x-1 transition-transform"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
