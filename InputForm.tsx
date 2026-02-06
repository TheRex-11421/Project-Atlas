
import React from 'react';
import { UserPreferences, SkillLevel } from '../types';

interface InputFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
  onBack: () => void;
}

const BRANCHES = [
  "Computer Science & Engineering",
  "Mechanical Engineering",
  "Electrical & Electronics Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biomedical Engineering"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters"];
const DURATIONS = ["2 Weeks", "1 Month", "3 Months", "6 Months"];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onBack }) => {
  const [prefs, setPrefs] = React.useState<UserPreferences>({
    branch: BRANCHES[0],
    year: YEARS[0],
    interests: '',
    skillLevel: SkillLevel.BEGINNER,
    duration: DURATIONS[1],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 space-y-8 relative overflow-hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-lexend">Project Profile</h2>
          <p className="text-slate-400 font-medium text-sm">Define your current technical scope.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
              Engineering Branch
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl text-slate-900 font-semibold focus:ring-0 focus:border-blue-500 text-sm transition-all outline-none cursor-pointer"
                value={prefs.branch}
                onChange={(e) => setPrefs({ ...prefs, branch: e.target.value })}
              >
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Academic Year
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl text-slate-900 font-semibold focus:ring-0 text-sm outline-none cursor-pointer"
                  value={prefs.year}
                  onChange={(e) => setPrefs({ ...prefs, year: e.target.value })}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Timeline
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl text-slate-900 font-semibold focus:ring-0 text-sm outline-none cursor-pointer"
                  value={prefs.duration}
                  onChange={(e) => setPrefs({ ...prefs, duration: e.target.value })}
                >
                  {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Interests
            </label>
            <textarea
              required
              placeholder="e.g. Computer Vision, CFD analysis, EV Systems..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-xl text-slate-900 font-semibold focus:ring-0 text-sm outline-none resize-none"
              value={prefs.interests}
              onChange={(e) => setPrefs({ ...prefs, interests: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Current Proficiency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(SkillLevel).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    prefs.skillLevel === level
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                  onClick={() => setPrefs({ ...prefs, skillLevel: level })}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isLoading ? (
            <i className="fas fa-circle-notch fa-spin"></i>
          ) : (
            <>
              <span>Forge Vision</span>
              <i className="fas fa-bolt-lightning text-[10px] text-yellow-300"></i>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
          Return to Hub
        </button>
      </div>
    </div>
  );
};
