
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentStep }) => {
  const steps = ["Start", "Profile", "Selection", "Plan"];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-slate-900 w-8 h-8 rounded-lg flex items-center justify-center">
                <i className="fas fa-atlas text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight font-lexend">
                Project <span className="text-blue-600">Atlas</span>
              </span>
            </div>

            {/* Subtle Stepper */}
            <nav className="flex items-center space-x-1 sm:space-x-4">
              {steps.map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStep ? 'bg-blue-600 ring-4 ring-blue-50' : 
                      idx < currentStep ? 'bg-blue-400' : 'bg-slate-200'
                    }`} />
                    <span className={`ml-2 text-[9px] font-bold uppercase tracking-widest hidden sm:block ${
                      idx === currentStep ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-2 sm:w-6 h-[1px] mx-1 sm:mx-2 bg-slate-100" />
                  )}
                </div>
              ))}
            </nav>

            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-circle-info"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="py-12 border-t border-slate-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            © 2024 Project Atlas • Engineering Intelligence
          </p>
          <div className="flex items-center space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-400 hover:text-slate-900 transition-colors group">
              <i className="fab fa-github text-lg mr-2"></i>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Repository</span>
            </a>
            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
            <a href="#" className="text-slate-400 hover:text-blue-600 text-[10px] font-bold uppercase tracking-widest transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
