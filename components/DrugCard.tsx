import React, { useMemo } from 'react';
import { Drug, DrugState } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DrugCardProps {
  drug: Drug;
  isOpen: boolean;
  drugState: DrugState;
  onToggleOpen: () => void;
  onToggleCheck: (checkId: string) => void;
  onRecordTime: () => void;
}

export const DrugCard: React.FC<DrugCardProps> = ({
  drug,
  isOpen,
  drugState,
  onToggleOpen,
  onToggleCheck,
  onRecordTime,
}) => {
  // Check if all checkboxes for this drug are checked
  const allChecked = useMemo(() => {
    return drug.checklist.every((item) => drugState.checkedIds.includes(item.id));
  }, [drug.checklist, drugState.checkedIds]);

  const hasAdministered = !!drugState.administeredTime;

  // Formatting the Highlighted parts of the title
  const renderTitle = () => (
    <span className="text-xl md:text-2xl font-bold flex items-center justify-center gap-2">
      {drug.name} <span className="text-yellow-400">{drug.dosage}</span> ▶️ {drug.action}
    </span>
  );

  return (
    <div className={`rounded-xl overflow-hidden border-2 transition-colors duration-300 ${isOpen ? 'border-pink-600 bg-neutral-900' : 'border-neutral-800 bg-neutral-900'}`}>
      {/* Header / Accordion Button */}
      <button
        onClick={onToggleOpen}
        className={`w-full p-5 flex items-center justify-between text-left transition-all duration-300 ${
          isOpen ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(233,30,99,0.5)]' : 'bg-neutral-900 text-gray-200 hover:bg-neutral-800'
        }`}
      >
        <div className="w-full text-center relative">
            {renderTitle()}
            {hasAdministered && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center text-sm font-normal bg-green-900/50 px-2 py-1 rounded border border-green-500/50">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                    已執行
                </div>
            )}
        </div>
        <div className="absolute right-4">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {/* Content Area */}
      {isOpen && (
        <div className="p-4 md:p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
            <p className="text-gray-300 font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-sky-400" />
              請確認無以下禁忌症：
            </p>
            
            <div className="space-y-3">
              {drug.checklist.map((item) => {
                const isChecked = drugState.checkedIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-start p-3 rounded cursor-pointer transition-colors ${
                      isChecked ? 'bg-neutral-700/60' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleCheck(item.id)}
                        disabled={hasAdministered} // Lock if already administered
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded border-2 border-gray-500 bg-neutral-900 transition-all checked:border-green-500 checked:bg-green-600 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 focus:ring-offset-neutral-900"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="ml-3 text-base md:text-lg text-gray-200 select-none leading-tight">
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-2">
            {!allChecked ? (
               <div className="p-4 text-center text-gray-500 italic bg-neutral-950/50 rounded-lg border border-neutral-800">
                 請先勾選確認所有禁忌症以解鎖給藥選項
               </div>
            ) : (
                <button
                    onClick={onRecordTime}
                    disabled={hasAdministered}
                    className={`w-full p-4 md:p-6 rounded-lg font-bold text-lg md:text-xl transition-all duration-300 transform flex flex-col items-center justify-center gap-2 shadow-lg
                        ${hasAdministered 
                            ? 'bg-neutral-800 text-green-400 border-2 border-green-600/50 cursor-default' 
                            : 'bg-green-700 hover:bg-green-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-green-900/50 border-2 border-green-500'
                        }`}
                >
                    {hasAdministered ? (
                        <>
                            <div className="flex items-center gap-2 text-2xl">
                                <CheckCircle className="w-8 h-8" />
                                <span>已完成紀錄</span>
                            </div>
                            <div className="flex items-center gap-2 text-base font-mono bg-black/30 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4" />
                                {drugState.administeredTime}
                            </div>
                        </>
                    ) : (
                        <div dangerouslySetInnerHTML={{ 
                            __html: drug.actionDetail.replace(/(\d+顆|\(\d+mg\))/g, '<span class="text-yellow-300 mx-1">$1</span>') 
                        }} />
                    )}
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
