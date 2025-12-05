import React, { useState, useEffect } from 'react';
import { RefreshCcw, ShieldCheck } from 'lucide-react';
import { DRUG_DATA } from './constants';
import { AppState, DrugState } from './types';
import { DrugCard } from './components/DrugCard';

const STORAGE_KEY = 'acs_checklist_v1';

// Initial state generator
const getInitialState = (): AppState => {
  const initialState: AppState = {};
  DRUG_DATA.forEach(drug => {
    initialState[drug.id] = { checkedIds: [], administeredTime: null };
  });
  return initialState;
};

const App: React.FC = () => {
  // State initialization with lazy loading from LocalStorage
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
    return getInitialState();
  });

  const [openDrugId, setOpenDrugId] = useState<string | null>(null);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // Handlers
  const handleToggleCheck = (drugId: string, checkId: string) => {
    setAppState(prev => {
      const drugState = prev[drugId];
      const newCheckedIds = drugState.checkedIds.includes(checkId)
        ? drugState.checkedIds.filter(id => id !== checkId)
        : [...drugState.checkedIds, checkId];
      
      return {
        ...prev,
        [drugId]: { ...drugState, checkedIds: newCheckedIds }
      };
    });
  };

  const handleRecordTime = (drugId: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setAppState(prev => ({
      ...prev,
      [drugId]: { ...prev[drugId], administeredTime: timeString }
    }));
  };

  const handleReset = () => {
    if (window.confirm('確定要重置所有紀錄嗎？所有勾選與時間將會清除。')) {
      setAppState(getInitialState());
      setOpenDrugId(null);
    }
  };

  const handleToggleOpen = (id: string) => {
    setOpenDrugId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="relative flex flex-col items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-10 h-10 text-sky-400" />
             <h2 className="text-3xl md:text-4xl font-bold text-sky-400 tracking-tight">
                ACS 藥物禁忌症核對
             </h2>
          </div>
          
          <button 
            onClick={handleReset}
            className="absolute top-0 right-0 md:relative md:top-auto md:right-auto flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-red-900/50 text-gray-400 hover:text-red-200 rounded-full transition-colors text-sm border border-neutral-700"
          >
            <RefreshCcw className="w-4 h-4" />
            <span className="hidden md:inline">重置清單</span>
          </button>
        </header>

        {/* Drug List */}
        <div className="flex flex-col gap-4">
          {DRUG_DATA.map(drug => (
            <DrugCard
              key={drug.id}
              drug={drug}
              drugState={appState[drug.id]}
              isOpen={openDrugId === drug.id}
              onToggleOpen={() => handleToggleOpen(drug.id)}
              onToggleCheck={(checkId) => handleToggleCheck(drug.id, checkId)}
              onRecordTime={() => handleRecordTime(drug.id)}
            />
          ))}
        </div>
        
        <footer className="text-center text-neutral-600 text-sm mt-12 pb-8">
          <p>© ACS Safety Protocol Checklist</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
