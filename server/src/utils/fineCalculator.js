const FINE_PER_DAY = 5; // ₹5 per day

const calculateFine = (returnDate, actualReturnDate) => {
  const expected = new Date(returnDate);
  const actual = new Date(actualReturnDate);
  
  // Reset time parts for accurate day calculation
  expected.setHours(0, 0, 0, 0);
  actual.setHours(0, 0, 0, 0);
  
  const diffTime = actual.getTime() - expected.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 0;
  
  return diffDays * FINE_PER_DAY;
};

module.exports = { calculateFine, FINE_PER_DAY };
