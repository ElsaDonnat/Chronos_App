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
    <div className="min-h-[100dvh] flex flex-col" style={{ backgroundColor: 'var(--color-parchment)' }}>
      <TopBar />

      <main className="flex-1 w-full max-w-[440px] mx-auto px-4 pb-20 pt-2">
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'learn' && <LearnPage />}
          {activeTab === 'timeline' && <TimelinePage />}
          {activeTab === 'practice' && <PracticePage />}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      {state.settingsOpen && <Settings />}
    </div>
  );
}
