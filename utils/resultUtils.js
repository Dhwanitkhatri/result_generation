const { Model } = require("sequelize");

function calculateResultSummary(results) {
  let totalMarks = 0;
  let maxTotal = 0;

  results.forEach(r => {
    totalMarks += Number(r.marks);       //  convert to number
    maxTotal += Number(r.Max_marks);     //  convert to number
  });

  const percentage = maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;

  let grade = "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 75) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 40) grade = "D";

  return {
    totalMarks,
    maxTotal,
    percentage: percentage.toFixed(2) + "%",
    grade
  };
}
module.exports = { calculateResultSummary };