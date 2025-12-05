import React, { useState, useEffect, useCallback } from 'react';
import { DRUG_DATA } from './constants';
import { AppState } from './types';
import { loadState, saveState, clearStoredState } from './services/storageService';
import DrugItem from './components/DrugItem';

const App: React.FC = () => {
  // State for application data (persisted)
  const [appState, setAppState] = useState<AppState>({ checks: {}, timestamps: {} });
  // State for UI (accordion) - not persisted
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const loaded = loadState();
    setAppState(loaded);
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever appState changes
  useEffect(() => {
    if (isLoaded) {
      saveState(appState);
    }
  }, [appState, isLoaded]);

  // Handler: Toggle a checkbox
  const handleCheckChange = useCallback((checkId: string) => {
    setAppState((prev) => ({
      ...prev,
      checks: {
        ...prev.checks,
        [checkId]: !prev.checks[checkId],
      },
    }));
  }, []);

  // Handler: Record timestamp for a drug
  const handleRecordAction = useCallback((drugId: string) => {
    const now = new Date();
    // Format: HH:mm:ss (or customized as needed)
    const timeString = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setAppState((prev) => ({
      ...prev,
      timestamps: {
        ...prev.timestamps,
        [drugId]: timeString,
      },
    }));
  }, []);

  // Handler: Reset everything
  const handleReset = useCallback(() => {
    if (window.confirm('確定要重置所有紀錄嗎？此動作無法復原。')) {
      // 1. Clear LocalStorage
      clearStoredState();
      // 2. Reset React State (this will trigger the effect to save empty state, which is fine)
      setAppState({ checks: {}, timestamps: {} });
      // 3. Collapse all items
      setExpandedId(null);
    }
  }, []);

  // Handler: Accordion Toggle
  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (!isLoaded) return null; // Prevent flash of default state

  return (
    <div className="min-h-screen bg-[#111] text-white p-4 pb-20 sm:p-6 max-w-3xl mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col items-center justify-center mb-8 relative">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#5dc1ff] text-center mb-4 sm:mb-0">
          ACS藥物禁忌症核對
        </h2>
        
        {/* Reset Button (Top Right on large screens, Under title on mobile) */}
        <button 
          onClick={handleReset}
          className="mt-4 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 text-xs sm:text-sm bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-white px-3 py-2 rounded border border-gray-600 transition-colors z-10 cursor-pointer"
        >
          重置表格 ↺
        </button>
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-4">
        {DRUG_DATA.map((drug) => (
          <DrugItem
            key={drug.id}
            drug={drug}
            isOpen={expandedId === drug.id}
            onToggle={() => handleToggle(drug.id)}
            checks={appState.checks}
            timestamp={appState.timestamps[drug.id]}
            onCheckChange={handleCheckChange}
            onRecordAction={handleRecordAction}
          />
        ))}
      </div>

      {/* Footer / Status */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>資料會自動儲存於此裝置</p>
      </div>
    </div>
  );
};

export default App;