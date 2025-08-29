import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export const useFormLocalStorage = (formKey, category) => {
  const storageKey = `memorial_form_${category}_${formKey}`;
  
  // Save form data to localStorage
  const saveFormData = (data) => {
    try {
      const formData = {
        ...data,
        timestamp: new Date().toISOString(),
        category: category
      };
      window.localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data to localStorage:', error);
    }
  };

  // Load form data from localStorage
  const loadFormData = () => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const data = JSON.parse(item);
        // Check if data is not too old (optional: expire after 24 hours)
        const dataAge = new Date() - new Date(data.timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (dataAge < maxAge) {
          return data;
        } else {
          // Data is too old, remove it
          clearFormData();
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
      return null;
    }
  };

  // Clear form data from localStorage
  const clearFormData = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing form data from localStorage:', error);
    }
  };

  // Check if saved data exists
  const hasSavedData = () => {
    try {
      const item = window.localStorage.getItem(storageKey);
      return !!item;
    } catch (error) {
      return false;
    }
  };

  return {
    saveFormData,
    loadFormData,
    clearFormData,
    hasSavedData
  };
}; 