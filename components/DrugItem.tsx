import React, { useMemo } from 'react';
import { DrugConfig } from '../types';

interface DrugItemProps {
  drug: DrugConfig;
  isOpen: boolean;
  onToggle: () => void;
  checks: Record<string, boolean>;
  timestamp: string | undefined;
  onCheckChange: (checkId: string) => void;
  onRecordAction: (drugId: string) => void;
}

const DrugItem: React.FC<DrugItemProps> = ({
  drug,
  isOpen,
  onToggle,
  checks,
  timestamp,
  onCheckChange,
  onRecordAction,
}) => {
  
  // Determine if all checks for this specific drug are checked
  const allChecked = useMemo(() => {
    return drug.checklist.every((item) => checks[item.id] === true);
  }, [drug.checklist, checks]);

  return (
    <div className="bg-[#1b1b1b] rounded-lg border-2 border-[#333] overflow-hidden transition-all duration-300">
      {/* Header / Button */}
      <button
        onClick={onToggle}
        className={`w-full text-center py-5 text-xl sm:text-2xl font-bold transition-all duration-300 relative
          ${isOpen ? 'bg-[#e91e63] shadow-[0_0_12px_rgba(233,30,99,0.5)]' : 'bg-[#1b1b1b] hover:bg-[#252525]'}
          text-white
        `}
      >
        {drug.name} <span className="text-[#ffd700] mx-1">{drug.doseHighlight}</span> {drug.suffixNote}
        
        {/* Checkmark indicator if done */}
        {timestamp && !isOpen && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm font-normal border border-green-500 px-2 py-1 rounded hidden sm:block">
                已完成
            </span>
        )}
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-[#333] animate-fadeIn">
          <p className="text-[#ccc] font-bold mb-4 text-lg">請確認無以下禁忌症：</p>
          
          <div className="space-y-3">
            {drug.checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-start sm:items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={!!checks[item.id]}
                  onChange={() => onCheckChange(item.id)}
                  disabled={!!timestamp} // Disable changing checks after action is recorded
                  className="mt-1 sm:mt-0 w-6 h-6 border-2 border-gray-500 rounded bg-gray-700 text-[#e91e63] focus:ring-offset-0 focus:ring-0 checked:bg-[#e91e63] checked:border-[#e91e63] transition cursor-pointer"
                />
                <span className={`text-[15px] sm:text-[16px] leading-relaxed select-none ${!!checks[item.id] ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>

          {/* Action Area */}
          <div className={`mt-6 transition-all duration-500 ${allChecked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute'}`}>
            {allChecked && (
              timestamp ? (
                // State: Completed (Timestamp recorded)
                <div className="bg-[#1b3a1b] border border-[#008800] text-white p-4 rounded-lg text-center shadow-[0_0_10px_#008800]">
                    <div className="text-sm text-green-300 mb-1">已執行於</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-[#ffd700]">
                        {timestamp}
                    </div>
                    <div className="mt-2 text-sm opacity-75">{drug.actionLabel}</div>
                </div>
              ) : (
                // State: Ready to record
                <button
                  onClick={() => onRecordAction(drug.id)}
                  className="w-full bg-[#008800] hover:bg-[#00a000] active:scale-[0.98] text-white p-4 rounded-lg text-lg sm:text-xl font-bold text-center shadow-[0_0_10px_#008800] transition-all duration-200 flex flex-col items-center justify-center gap-2"
                >
                  <span className="animate-pulse">⚠️ 點擊紀錄時間</span>
                  <span>{drug.actionLabel}</span>
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugItem;