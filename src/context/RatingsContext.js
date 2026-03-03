// src/context/RatingsContext.js
import React, { createContext, useState, useCallback } from 'react';

export const RatingsContext = createContext({
  ratings: {},
  updateRating: () => {},
  resetRatings: () => {},
});

const MAX_RATING = 6;

export const RatingsProvider = ({ children }) => {
  const [ratings, setRatings] = useState({});

  const updateRating = useCallback((courseId, newRating) => {
    setRatings((prev) => ({
      ...prev,
      [courseId]: Math.min(newRating, MAX_RATING),
    }));
  }, []);

  const resetRatings = useCallback(() => {
    setRatings({});
  }, []);

  return (
    <RatingsContext.Provider value={{ ratings, updateRating, resetRatings }}>
      {children}
    </RatingsContext.Provider>
  );
};
