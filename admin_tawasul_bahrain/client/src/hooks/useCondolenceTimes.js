import { useState, useCallback } from 'react';

export const useCondolenceTimes = () => {
  const [condolenceTimesMen, setCondolenceTimesMen] = useState([]);
  const [condolenceTimesWomen, setCondolenceTimesWomen] = useState([]);

  const addCondolenceTime = useCallback((gender) => {
    const newTime = {
      id: Date.now(),
      day: '',
      timeRanges: [{ fromType: 'manual', from: '', toType: 'manual', to: '' }]
    };

    if (gender === 'men') {
      setCondolenceTimesMen(prev => [...prev, newTime]);
    } else {
      setCondolenceTimesWomen(prev => [...prev, newTime]);
    }
  }, []);

  const removeCondolenceTime = useCallback((gender, timeId) => {
    if (gender === 'men') {
      setCondolenceTimesMen(prev => prev.filter(time => time.id !== timeId));
    } else {
      setCondolenceTimesWomen(prev => prev.filter(time => time.id !== timeId));
    }
  }, []);

  const updateCondolenceTime = useCallback((gender, timeId, field, value) => {
    const updateTimes = (times) => 
      times.map(time => 
        time.id === timeId ? { ...time, [field]: value } : time
      );

    if (gender === 'men') {
      setCondolenceTimesMen(prev => updateTimes(prev));
    } else {
      setCondolenceTimesWomen(prev => updateTimes(prev));
    }
  }, []);

  const addTimeRange = useCallback((gender, timeId) => {
    const updateTimes = (times) => 
      times.map(time => 
        time.id === timeId 
          ? { ...time, timeRanges: [...time.timeRanges, { fromType: 'manual', from: '', toType: 'manual', to: '' }] }
          : time
      );

    if (gender === 'men') {
      setCondolenceTimesMen(prev => updateTimes(prev));
    } else {
      setCondolenceTimesWomen(prev => updateTimes(prev));
    }
  }, []);

  const removeTimeRange = useCallback((gender, timeId, rangeIndex) => {
    const updateTimes = (times) => 
      times.map(time => 
        time.id === timeId 
          ? { ...time, timeRanges: time.timeRanges.filter((_, i) => i !== rangeIndex) }
          : time
      );

    if (gender === 'men') {
      setCondolenceTimesMen(prev => updateTimes(prev));
    } else {
      setCondolenceTimesWomen(prev => updateTimes(prev));
    }
  }, []);

  const updateTimeRange = useCallback((gender, timeId, rangeIndex, field, value) => {
    const updateTimes = (times) => 
      times.map(time => 
        time.id === timeId 
          ? { 
              ...time, 
              timeRanges: time.timeRanges.map((range, i) => 
                i === rangeIndex ? { ...range, [field]: value } : range
              )
            }
          : time
      );

    if (gender === 'men') {
      setCondolenceTimesMen(prev => updateTimes(prev));
    } else {
      setCondolenceTimesWomen(prev => updateTimes(prev));
    }
  }, []);

  return {
    condolenceTimesMen,
    condolenceTimesWomen,
    addCondolenceTime,
    removeCondolenceTime,
    updateCondolenceTime,
    addTimeRange,
    removeTimeRange,
    updateTimeRange,
    setCondolenceTimesMen,
    setCondolenceTimesWomen
  };
}; 