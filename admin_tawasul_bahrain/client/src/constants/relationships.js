// Relationship options based on gender
export const getRelationshipOptions = (gender) => {
  const maleRelationships = [
    'الابن',
    'البنت',
    'الأخ الشقيق',
    'الأخت الشقيقة',
    'الأخ',
    'الأخت',
    'النسيب',
    'أخرى'
  ];

  const femaleRelationships = [
    'الزوج',
    'الابن',
    'البنت',
    'الأخ الشقيق',
    'الأخت الشقيقة',
    'الأخ',
    'الأخت',
    'أخرى'
  ];

  return gender === 'ذكر' ? maleRelationships : femaleRelationships;
}; 