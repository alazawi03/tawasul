import { useState, useCallback } from 'react';

export const useMemorialFormState = () => {
  const [loading, setLoading] = useState(false);
  const [burialTimeType, setBurialTimeType] = useState('manual');
  const [selectedCategory, setSelectedCategory] = useState('death_announcement');
  const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
  const [preferredGender, setPreferredGender] = useState('');
  const [showGenderDetails, setShowGenderDetails] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [skipBurialDetails, setSkipBurialDetails] = useState(false);
  const [burialCompleted, setBurialCompleted] = useState(false);

  // Blood type management
  const toggleBloodType = useCallback((type) => {
    setSelectedBloodTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleCategoryChange = useCallback((categoryId, onCategoryChange, initializeContactNumbers) => {
    setSelectedCategory(categoryId);
    
    // Auto-initialize contact numbers for blood donation
    if (initializeContactNumbers) {
      initializeContactNumbers(categoryId);
    }
    
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  }, []);

  return {
    loading,
    setLoading,
    burialTimeType,
    setBurialTimeType,
    selectedCategory,
    setSelectedCategory,
    selectedBloodTypes,
    setSelectedBloodTypes,
    preferredGender,
    setPreferredGender,
    showGenderDetails,
    setShowGenderDetails,
    templateData,
    setTemplateData,
    skipBurialDetails,
    setSkipBurialDetails,
    burialCompleted,
    setBurialCompleted,
    toggleBloodType,
    handleCategoryChange
  };
}; 