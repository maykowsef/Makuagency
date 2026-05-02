// Comprehensive date validation utility to prevent Invalid time value errors

export const safeToISOString = (date) => {
  try {
    if (!date) return null;
    
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date detected:', date);
      return null;
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.warn('Date toISOString error:', error, date);
    return null;
  }
};

export const safeDate = (date) => {
  try {
    if (!date) return null;
    
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date detected:', date);
      return null;
    }
    
    return dateObj;
  } catch (error) {
    console.warn('Date parsing error:', error, date);
    return null;
  }
};

export const isValidDate = (date) => {
  try {
    if (!date) return false;
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return !isNaN(dateObj.getTime());
  } catch (error) {
    return false;
  }
};

export const safeNow = () => {
  return new Date().toISOString();
};
