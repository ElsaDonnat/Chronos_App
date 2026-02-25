import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import Sidebar, { MobileTabBar } from './components/layout/Sidebar';
import LearnPage from './pages/LearnPage';
import TimelinePage from './pages/TimelinePage';
import PracticePage from './pages/PracticePage';
import Settings from './components/Settings';

const TAB_KEYS = { '1': 'learn', '2': 'timeline', '3': 'practice' };

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [inSession, setInSession] = useState(false);
  const { state, dispatch } = useApp();
  const mainRef = useRef(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [activeTab]);

  const handleKeyDown = useCallback((e) => {
    // Don't capture when user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape' && state.settingsOpen) {
      dispatch({ type: 'TOGGLE_SETTINGS' });
      return;
    }

    if (TAB_KEYS[e.key]) {
      setActiveTab(TAB_KEYS[e.key]);
    }
  }, [state.settingsOpen, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app-shell">
      <TopBar activeTab={activeTab} />
      <div className="app-body">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="main-content" ref={mainRef}>
          <div className="main-content-inner">
            <div className="animate-fade-in" key={activeTab}>
              {activeTab === 'learn' && <LearnPage onSessionChange={setInSession} />}
              {activeTab === 'timeline' && <TimelinePage />}
              {activeTab === 'practice' && <PracticePage onSessionChange={setInSession} />}
            </div>
          </div>
        </main>
      </div>
      {!inSession && <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />}
      {state.settingsOpen && <Settings />}
    </div>
  );
}
