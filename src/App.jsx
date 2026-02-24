import { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import LearnPage from './pages/LearnPage';
import TimelinePage from './pages/TimelinePage';
import PracticePage from './pages/PracticePage';
import Settings from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const { state } = useApp();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-8" style={{ backgroundColor: 'var(--color-parchment-dark)' }}>
      <div className="w-full h-full max-w-[440px] sm:max-h-[850px] relative flex flex-col bg-[var(--color-parchment)] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden sm:border-[12px] sm:border-white/40">

        <TopBar />

        <main className="flex-1 overflow-y-auto w-full px-4 pb-20 pt-2 relative z-0">
          <div className="animate-fade-in" key={activeTab}>
            {activeTab === 'learn' && <LearnPage />}
            {activeTab === 'timeline' && <TimelinePage />}
            {activeTab === 'practice' && <PracticePage />}
          </div>
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        {state.settingsOpen && <Settings />}
      </div>
    </div>
  );
}
