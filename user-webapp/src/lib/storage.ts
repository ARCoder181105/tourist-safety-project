/**
 * Saves an item to the browser's localStorage.
 * @param {string} key The key to store the item under.
 * @param {string} value The value to store.
 */
export const saveItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
};

/**
 * Retrieves an item from localStorage.
 * This is the function being imported by your api.ts file.
 * @param {string} key The key of the item to retrieve.
 * @returns {string|null} The stored value, or null if not found.
 */
export const getItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
};

/**
 * Deletes an item from localStorage.
 * @param {string} key The key of the item to delete.
 */
export const deleteItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from localStorage:", error);
    }
};