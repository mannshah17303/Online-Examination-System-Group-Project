import { databaseQuery } from "../../database/databaseQuery.js";

export const startExam = async (req, res) => {
  const { exam_id, student_id } = req.body;
  
  try {
    // First check if an attempt already exists
    const existingAttempt = await databaseQuery(`
      SELECT attempt_id FROM exam_attempts_tbl 
      WHERE student_id = ? AND exam_id = ?
    `, [student_id, exam_id]);
    
    let attempt_id;
    
    if (existingAttempt.length > 0) {
      // Attempt already exists, use existing attempt_id
      attempt_id = existingAttempt[0].attempt_id;
    } else {
      // Create a new attempt record
      const result = await databaseQuery(`
        INSERT INTO exam_attempts_tbl (student_id, exam_id, attempt_date) 
        VALUES (?, ?, NOW())
      `, [student_id, exam_id]);
      
      attempt_id = result.insertId;
      
      // Create a placeholder result
      await databaseQuery(`
        INSERT INTO exam_results_tbl (attempt_id, obtained_marks, result_date)
        VALUES (?, 0, NOW())
      `, [attempt_id]);
    }
    
    res.status(200).json({ success: true, attempt_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error starting exam" });
  }
};