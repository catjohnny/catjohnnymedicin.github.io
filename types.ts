export interface DrugChecklist {
  id: string;
  label: string;
  isBold?: boolean; // For highlighting specific parts like "<90mmHg"
}

export interface Drug {
  id: string;
  name: string;
  dosage: string;
  action: string;
  actionDetail: string; // The text inside the result box
  checklist: DrugChecklist[];
}

export interface DrugState {
  checkedIds: string[]; // Array of checklist IDs that are checked
  administeredTime: string | null; // Timestamp or null
}

export type AppState = Record<string, DrugState>;
