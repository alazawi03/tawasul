import { useState, useCallback } from 'react';

export const useContactNumbers = () => {
  const [contactNumbers, setContactNumbers] = useState([]);
  const [showContactHours, setShowContactHours] = useState({});

  const addContactNumber = useCallback(() => {
    setContactNumbers(prev => [...prev, { 
      name: '', 
      phone: '', 
      relationship: '', 
      customRelationship: '', 
      contactHours: '' 
    }]);
  }, []);

  const removeContactNumber = useCallback((index) => {
    setContactNumbers(prev => prev.filter((_, i) => i !== index));
    // Clean up showContactHours state
    setShowContactHours(prev => {
      const newShowContactHours = { ...prev };
      delete newShowContactHours[index];
      return newShowContactHours;
    });
  }, []);

  const updateContactNumber = useCallback((index, field, value) => {
    setContactNumbers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const toggleContactHours = useCallback((index) => {
    setShowContactHours(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const initializeContactNumbers = useCallback((categoryId) => {
    // Auto-initialize contact numbers for blood donation
    if (categoryId === 'blood_donation' && contactNumbers.length === 0) {
      setContactNumbers([{ 
        name: '', 
        phone: '', 
        relationship: '', 
        customRelationship: '', 
        contactHours: '' 
      }]);
    }
  }, [contactNumbers.length]);

  return {
    contactNumbers,
    showContactHours,
    addContactNumber,
    removeContactNumber,
    updateContactNumber,
    toggleContactHours,
    initializeContactNumbers,
    setContactNumbers,
    setShowContactHours
  };
}; 