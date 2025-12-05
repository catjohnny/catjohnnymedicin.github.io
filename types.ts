export interface ChecklistItem {
  id: string;
  label: React.ReactNode; // Allow JSX for bolding specific parts
}

export interface DrugConfig {
  id: string;
  name: string;
  doseHighlight: string;
  suffixNote: string;
  actionLabel: React.ReactNode;
  checklist: ChecklistItem[];
}

export interface AppState {
  checks: Record<string, boolean>; // Maps checklistItem.id to boolean
  timestamps: Record<string, string>; // Maps drugConfig.id to timestamp string
}