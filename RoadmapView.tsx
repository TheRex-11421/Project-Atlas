
import React, { useRef } from 'react';
import { ProjectRoadmap } from '../types';

interface RoadmapViewProps {
  roadmap: ProjectRoadmap;
  onReset: () => void;
  onToggleTask: (milestoneId: string, taskId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onReset, onToggleTask }) => {
  const roadmapRef = useRef<HTMLDivElement>(null);
  
  const totalTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleExportPDF = () => {
    if (!roadmapRef.current) return;
    const element = roadmapRef.current;
    const opt = {
      margin: [10, 10],
      filename: `Project_Atlas_${roadmap.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save();
  };

  return (
    <div ref={roadmapRef} className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Dashboard */}
      <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex-1">
          <button 
            onClick={onReset}
            className="text-slate-400 hover:text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] mb-6 transition-colors flex items-center print:hidden"
          >
            <i className="fas fa-arrow-left mr-2"></i> New Project Scope
          </button>
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            <span>Strategic Architecture Active</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-lexend">
            {roadmap.title}
          </h2>
        </div>

        <div className="w-full md:w-auto flex flex-col items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
              <circle 
                cx="64" 
                cy="64" 
                r="58" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * progressPercent) / 100}
                className="text-blue-600 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 font-lexend">{progressPercent}%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            </div>
          </div>
          <button 
            onClick={handleExportPDF}
            className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all flex items-center justify-center shadow-xl shadow-slate-200 print:hidden"
          >
            <i className="fas fa-file-export mr-2"></i> Export Academic PDF
          </button>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-12 relative mb-20">
        <div className="absolute left-4 md:left-[2.5rem] top-10 bottom-10 w-[2px] bg-slate-50 hidden md:block"></div>
        
        {roadmap.milestones.map((milestone, index) => {
          const isDone = milestone.tasks.every(t => t.completed);
          return (
            <div key={milestone.id} className="relative md:pl-24">
              <div className={`absolute left-0 md:left-[1.25rem] top-0 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center z-10 shadow-lg transition-all hidden md:flex ${
                isDone ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'
              }`}>
                {isDone ? <i className="fas fa-check text-xs"></i> : <span className="font-bold text-xs">{index + 1}</span>}
              </div>
              
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-blue-100 transition-colors group">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-slate-50">
                  <div className="max-w-lg">
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">
                      Phase {index + 1} • {milestone.duration}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-lexend mb-3">{milestone.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed italic">{milestone.description}</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center min-w-[140px] border border-slate-100">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Status</span>
                    <span className={`text-center font-bold text-[10px] uppercase tracking-widest ${isDone ? 'text-green-600' : 'text-slate-400'}`}>
                      {isDone ? 'Verified' : 'In Progress'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-list-check mr-2"></i> Deliverables
                    </h4>
                    {milestone.tasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => onToggleTask(milestone.id, task.id)}
                        className={`group/task flex items-center p-4 rounded-2xl cursor-pointer border transition-all ${
                          task.completed 
                          ? 'bg-green-50/50 border-green-100 text-slate-400' 
                          : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700 shadow-sm'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          task.completed ? 'bg-green-500 border-green-500' : 'border-slate-100 group-hover/task:border-blue-400'
                        }`}>
                          {task.completed && <i className="fas fa-check text-[10px] text-white"></i>}
                        </div>
                        <span className={`text-xs font-semibold ml-4 ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="print:hidden">
                    <h4 className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center">
                      <i className="fas fa-graduation-cap mr-2"></i> Learning Resources
                    </h4>
                    <div className="space-y-2">
                      {milestone.resources.map((res, i) => (
                        <div key={i} className="bg-slate-50 hover:bg-white hover:border-blue-100 hover:text-blue-600 border border-transparent p-4 rounded-2xl text-[10px] font-bold text-slate-500 transition-all cursor-pointer flex items-center group/res">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm group-hover/res:bg-blue-50">
                            <i className="fas fa-link text-[10px] opacity-40 group-hover/res:opacity-100"></i>
                          </div>
                          <span className="truncate flex-1">{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expert Summary Footer */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
              <i className="fas fa-quote-left text-blue-400"></i>
            </div>
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em]">Expert Strategy Advice</span>
          </div>
          <p className="text-xl md:text-3xl font-medium leading-relaxed font-lexend italic text-slate-100 mb-12">
            "{roadmap.finalAdvice}"
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center">
                <i className="fas fa-shield-halved text-blue-500 mr-3"></i>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Verified by Atlas AI</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
