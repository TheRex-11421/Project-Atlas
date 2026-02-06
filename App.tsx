
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { ProjectCard } from './components/ProjectCard';
import { RoadmapView } from './components/RoadmapView';
import { UserPreferences, ProjectSuggestion, ProjectRoadmap } from './types';
import { suggestProjects, generateRoadmap } from './services/geminiService';

enum AppScreen {
  HOME,
  SETUP,
  SUGGESTIONS,
  ROADMAP
}

const STORAGE_KEY = 'project_atlas_v6';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.HOME);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Architecting...");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [roadmap, setRoadmap] = useState<ProjectRoadmap | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const currentStep = useMemo(() => {
    switch (screen) {
      case AppScreen.HOME: return 0;
      case AppScreen.SETUP: return 1;
      case AppScreen.SUGGESTIONS: return 2;
      case AppScreen.ROADMAP: return 3;
      default: return 0;
    }
  }, [screen]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { screen: savedScreen, roadmap: savedRoadmap, prefs } = JSON.parse(saved);
        if (savedScreen === AppScreen.ROADMAP && savedRoadmap) {
          setRoadmap(savedRoadmap);
          setPreferences(prefs);
          setScreen(AppScreen.ROADMAP);
        }
      } catch (e) { console.error("Restore failed", e); }
    }
  }, []);

  useEffect(() => {
    if (screen === AppScreen.ROADMAP && roadmap) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, roadmap, prefs: preferences }));
    } else if (screen === AppScreen.HOME) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [screen, roadmap, preferences]);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setLoadingMessage("Analyzing engineering landscape...");
    setError(null);
    setPreferences(prefs);
    try {
      const results = await suggestProjects(prefs);
      setSuggestions(results);
      setScreen(AppScreen.SUGGESTIONS);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (err) {
      setError("AI core busy. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = async (project: ProjectSuggestion) => {
    if (!preferences) return;
    setLoading(true);
    setLoadingMessage("Synthesizing actionable roadmap...");
    setError(null);
    try {
      const result = await generateRoadmap(project, preferences);
      setRoadmap(result);
      setScreen(AppScreen.ROADMAP);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (err) {
      setError("Strategic synthesis failed. Please re-select the project.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (milestoneId: string, taskId: string) => {
    if (!roadmap) return;
    const newMilestones = roadmap.milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, tasks: m.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) };
      }
      return m;
    });
    setRoadmap({ ...roadmap, milestones: newMilestones });
  };

  const handleReset = () => {
    if (confirm("Reset current project workspace? This will clear all progress.")) {
      setScreen(AppScreen.HOME);
      setSuggestions([]);
      setRoadmap(null);
      setPreferences(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <Layout currentStep={currentStep}>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col relative app-screen overflow-hidden">
        {/* Error Toast */}
        {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm">
            <div className="bg-red-500 text-white p-5 rounded-3xl shadow-2xl flex items-center animate-in slide-in-from-top-4">
              <i className="fas fa-triangle-exclamation mr-4 text-xl"></i>
              <div className="flex-grow">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">System Error</p>
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"><i className="fas fa-times"></i></button>
            </div>
          </div>
        )}

        {/* Home Screen */}
        {screen === AppScreen.HOME && (
          <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center animate-in fade-in duration-1000 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 blur-[120px] rounded-full -z-10"></div>
            
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm mb-12">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">2024-2025 Academic Engine v2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 font-lexend max-w-4xl mx-auto">
              Bridge Theory <br/><span className="text-blue-600">to Execution.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto mb-12 leading-relaxed">
              The AI-powered architect for engineering students. Transform academic requirements into professional roadmaps in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setScreen(AppScreen.SETUP)}
                className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 flex items-center group w-full sm:w-auto justify-center"
              >
                <span>Initiate Project Architect</span>
                <i className="fas fa-bolt-lightning ml-3 text-sm group-hover:text-yellow-300 transition-colors"></i>
              </button>
              <a href="https://github.com" target="_blank" className="px-10 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all w-full sm:w-auto text-center border border-transparent hover:border-slate-100">
                View Repository
              </a>
            </div>
            
            <div className="mt-24 flex flex-wrap justify-center gap-8 md:gap-16">
               {[
                 { label: 'Intelligence', val: 'Gemini 3 Pro' },
                 { label: 'Grounding', val: 'Google Search' },
                 { label: 'Format', val: 'PDF/JSON Export' },
                 { label: 'Updates', val: 'Real-time Trends' }
               ].map(stat => (
                 <div key={stat.label} className="text-left">
                   <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">{stat.label}</div>
                   <div className="text-sm font-bold text-slate-900 font-lexend">{stat.val}</div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Setup Screen */}
        {screen === AppScreen.SETUP && (
          <InputForm 
            onBack={() => setScreen(AppScreen.HOME)} 
            onSubmit={handleFormSubmit} 
            isLoading={loading} 
          />
        )}

        {/* Suggestions Screen */}
        {screen === AppScreen.SUGGESTIONS && (
          <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="text-center md:text-left">
                <button onClick={() => setScreen(AppScreen.SETUP)} className="text-slate-400 hover:text-blue-600 font-bold text-[9px] uppercase tracking-[0.2em] mb-4 inline-flex items-center transition-colors">
                  <i className="fas fa-arrow-left mr-2"></i> Update Preferences
                </button>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-lexend">Strategic Trajectories</h2>
                <p className="text-slate-500 mt-2 font-medium text-lg">AI-selected paths based on your academic profile.</p>
              </div>
              <div className="hidden md:block text-right">
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Source Grounding</span>
                <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[9px] font-bold">Active Industry Analysis</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {suggestions.map((p) => (
                <ProjectCard 
                  key={p.id} 
                  project={p} 
                  onSelect={handleProjectSelect} 
                  isGeneratingRoadmap={loading}
                />
              ))}
            </div>
          </div>
        )}

        {/* Roadmap Screen */}
        {screen === AppScreen.ROADMAP && roadmap && (
          <RoadmapView 
            roadmap={roadmap} 
            onReset={handleReset} 
            onToggleTask={handleToggleTask} 
          />
        )}
      </div>

      {/* High-Fidelity Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-pulse">
            <i className="fas fa-atlas text-white text-3xl"></i>
          </div>
          <div className="max-w-xs">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 font-lexend">Processing</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
              {loadingMessage}
            </p>
            <div className="mt-8 flex justify-center space-x-1.5">
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></span>
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
