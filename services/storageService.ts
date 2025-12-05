import { AppState } from '../types';
import { STORAGE_KEY } from '../constants';

const DEFAULT_STATE: AppState = {
  checks: {},
  timestamps: {},
};

export const saveState = (state: AppState): void => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return DEFAULT_STATE;
    return JSON.parse(serialized) as AppState;
  } catch (error) {
    console.error("Failed to load state:", error);
    return DEFAULT_STATE;
  }
};

export const clearStoredState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear state:", error);
  }
};