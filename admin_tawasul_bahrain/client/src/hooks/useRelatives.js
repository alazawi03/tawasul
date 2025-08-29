import { useState, useCallback } from "react";

export const useRelatives = () => {
  const [relatives, setRelatives] = useState([]);

  const addRelative = useCallback(() => {
    setRelatives((prev) => [
      ...prev,
      {
        relationship: "",
        customRelationship: "",
        names: [{ name: "", isDeceased: false }],
      },
    ]);
  }, []);

  const removeRelative = useCallback((index) => {
    setRelatives((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateRelative = useCallback((index, field, value) => {
    setRelatives((prev) =>
      prev.map((rel, i) => (i === index ? { ...rel, [field]: value } : rel))
    );
  }, []);

  // const addNameToRelative = useCallback((relativeIndex) => {
  //   setRelatives((prev) => {
  //     const updated = [...prev];
  //     // Ensure the names array exists on the relative object
  //     if (!updated[relativeIndex].names) {
  //       updated[relativeIndex].names = [];
  //     }
  //     updated[relativeIndex].names.push({ name: "", isDeceased: false });
  //     return updated;
  //   });
  // }, []);

  const addNameToRelative = useCallback((relativeIndex) => {
    setRelatives((prev) => {
      // Create a new top-level array
      const updated = prev.map((relative, index) => {
        // If this isn't the relative we're updating, return the original
        if (index !== relativeIndex) {
          return relative;
        }

        // If it IS the correct relative, create a new object for it
        return {
          ...relative,
          // Create a new 'names' array, copying old names and adding the new one
          names: [...(relative.names || []), { name: "", isDeceased: false }],
        };
      });
      return updated;
    });
  }, []);

  // const removeNameFromRelative = useCallback((relativeIndex, nameIndex) => {
  //   setRelatives((prev) => {
  //     const updated = [...prev];
  //     updated[relativeIndex].names = updated[relativeIndex].names.filter(
  //       (_, i) => i !== nameIndex
  //     );
  //     return updated;
  //   });
  // }, []);
  const removeNameFromRelative = useCallback((relativeIndex, nameIndex) => {
    setRelatives((prev) => {
      // .map() creates a new array every time
      return prev.map((relative, rIndex) => {
        // If this is not the relative we want to change, return it untouched
        if (rIndex !== relativeIndex) {
          return relative;
        }

        // If it IS the relative we want to change, create a NEW object
        return {
          ...relative, // Copy all properties from the old relative object
          // Create a NEW names array by filtering the old one
          names: relative.names.filter((_, nIndex) => nIndex !== nameIndex),
        };
      });
    });
  }, []);

  const updateRelativeName = useCallback(
    (relativeIndex, nameIndex, field, value) => {
      setRelatives((prev) => {
        const updated = [...prev];
        updated[relativeIndex].names[nameIndex] = {
          ...updated[relativeIndex].names[nameIndex],
          [field]: value,
        };
        return updated;
      });
    },
    []
  );

  return {
    relatives,
    addRelative,
    removeRelative,
    updateRelative,
    addNameToRelative,
    removeNameFromRelative,
    updateRelativeName,
    setRelatives,
  };
};
