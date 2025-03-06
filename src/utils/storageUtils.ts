
// Helper functions for localStorage operations

const STORAGE_KEYS = {
  TRANSACTIONS: "expense-tracker-transactions",
  BUDGETS: "expense-tracker-budgets",
  SETTINGS: "expense-tracker-settings",
};

/**
 * Get data from localStorage
 */
export function getStorageData<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Save data to localStorage
 */
export function setStorageData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Remove data from localStorage
 */
export function removeStorageData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

export { STORAGE_KEYS };
