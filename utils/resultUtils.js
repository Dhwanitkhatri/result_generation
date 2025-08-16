function calculateResultSummary(results) {
  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const maxTotal = results.reduce((sum, r) => sum + r.Max_marks, 0);
  const percentage = maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;

  // Grade logic 
  let grade;
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 50) grade = "D";
  else grade = "F";

  return {
    totalMarks,
    maxTotal,
    percentage: `${percentage.toFixed(2)}%`,
    grade,
  };
}

module.exports = { calculateResultSummary };
