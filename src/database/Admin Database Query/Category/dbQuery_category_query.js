import { databaseQuery } from "../../databaseQuery.js";

const fetchAllCategories = async (adminId) => {
    const query = `SELECT * FROM category_tbl WHERE created_by = ${adminId}`;
    try {
        // console.log(query);

        const result = await databaseQuery(query);
        // console.log(result);

        return result;
    } catch (error) {
        // console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories from the database.");
    }
};

const addCategory = async (category_name, adminId) => {
    // Check if the category_name already exists for the given adminId
    const checkQuery = `SELECT COUNT(*) as count FROM category_tbl WHERE category_name = ? AND created_by = ?`;
    const insertQuery = `INSERT INTO category_tbl (category_name, created_by) VALUES (?, ?)`;

    try {
        const checkResult = await databaseQuery(checkQuery, [category_name, adminId]);

        if (checkResult[0].count > 0) {
            return { success: false, message: "Category already exists for this admin" };
        }

        // Proceed to insert the new category
        const result = await databaseQuery(insertQuery, [category_name, adminId]);
        return { success: true, data: result };
    } catch (error) {
        // Handle any errors that occur during the database operations
        return { success: false, message: error.message };
    }
};

const fetchCategoryById = async (category_id, adminSessionId) => {
    const categoryQuery = `SELECT * FROM category_tbl WHERE category_id = ? and created_by = ?`;
    try {
        const category = await databaseQuery(categoryQuery, [
            category_id,
            adminSessionId,
        ]);
        return category;
    } catch (error) {
        // console.error("Error fetching category by id", error);
        throw new Error("Failed to fetch category by id from the database.");
    }
};

const fetchCategoryById_For_Edit = async (id) => {
    const query = `SELECT category_id, category_name FROM category_tbl WHERE category_id = ?`;

    try {
        const result = await databaseQuery(query, [id]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        // console.error("Error fetching category from the database:", error);
        throw new Error("Failed to fetch category from the database.");
    }
};

const fetchCategoriesBySearchTerm = async (adminId, searchTerm) => {
    const query = `SELECT * FROM category_tbl WHERE created_by = ? AND category_name LIKE ?`;
    const values = [adminId, `%${searchTerm}%`];

    try {
        const result = await databaseQuery(query, values);
        return Array.isArray(result) ? result : [result];
    } catch (error) {
        // console.error("Error fetching categories:", error);
        throw new Error("Failed to fetch categories from the database.");
    }
};

const updateCategoryInDatabase = async (id, category_name) => {
    const query = `UPDATE category_tbl SET category_name = ? WHERE category_id = ?`;

    try {
        const result = await databaseQuery(query, [category_name, id]);
        return result;
    } catch (error) {
        // console.error("Error updating category in the database:", error);
        throw new Error("Failed to update category in the database.");
    }
};

const deleteCategoryFromDatabase = async (id) => {
    const query = `DELETE FROM category_tbl WHERE category_id = ?`;
    try {
        const result = await databaseQuery(query, [id]);
        return result;
    } catch (error) {
        // console.error("Error deleting category from the database:", error);
        throw new Error("Failed to delete category from the database.");
    }
}

const Count_Total_Student = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }

    const query = `SELECT 
                        COUNT(DISTINCT s.student_id) AS total_students
                    FROM 
                        batches_tbl b
                    JOIN 
                        batch_students_tbl bs ON b.batch_id = bs.batch_id
                    JOIN 
                        students_tbl s ON bs.student_id = s.student_id
                    WHERE 
                        b.created_by = ? 
                    AND b.is_deleted = 0
    `;

    try {
        const result = await databaseQuery(query, [admin_id]);
        if (result && result.length > 0) {
            return result[0].total_students;
        } else {
            return 0;
        }
    } catch (error) {
        // console.error("Error fetching total student from the database:", error);
        throw new Error("Failed to fetch total student from the database.");
    }
}

const Count_Past_Exams = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }

    const query = `
        SELECT COUNT(*) AS past_exam_count
        FROM exam_tbl
        WHERE exam_start_datetime < NOW()
        AND is_setup_done = 1
        AND is_deleted = 0
        AND created_by = ?;
    `;

    try {
        const result = await databaseQuery(query, [admin_id]);
        if (result && result.length > 0) {
            return result[0].past_exam_count;
        } else {
            return 0;
        }
    } catch (error) {
        // console.error("Error fetching past exam count from the database:", error);
        throw new Error("Failed to fetch past exam count from the database.");
    }
}

const Count_Category = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    try {
        const query = `SELECT COUNT(*) AS category_count FROM category_tbl WHERE created_by = ?; `;
        const result = await databaseQuery(query, [admin_id]);
        if (result && result.length > 0) {
            return result[0].category_count;
        } else {
            return 0;
        }
    } catch (error) {
        // console.error("Error fetching category count from the database:", error);
        throw new Error("Failed to fetch category count from the database.");
    }
}

const Count_Batch = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    const query = `
        SELECT COUNT(*) AS total_batch
        FROM batches_tbl
        WHERE created_by = ? AND is_deleted = 0;
    `;

    try {
        const result = await databaseQuery(query, [admin_id]);
        if (result && result.length > 0) {
            return result[0].total_batch;
        } else {
            return 0;
        }
    } catch (error) {
        // console.error("Error fetching batch count from the database:", error);
        throw new Error("Failed to fetch batch count from the database.");
    }
}

const get_Exams = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    const query = ` SELECT exam_id, exam_name FROM exam_tbl WHERE created_by = ? AND is_deleted = 0 AND is_setup_done = 0`;
    try {
        const result = await databaseQuery(query, [admin_id]);
        if (result && result.length > 0) {
            return result;
        } else {
            return [];
        }
    } catch (error) {
        // console.error("Error fetching exams from the database:", error);
        throw new Error("Failed to fetch exams from the database.");
    }
}

const get_Performance = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    try {
        // const query = `
        //      SELECT
        //         s.student_id,
        //         s.first_name,
        //         s.last_name,
        //         s.email,
        //         s.mobile_no,
        //         e.exam_id,
        //         e.exam_name,
        //         er.obtained_marks,
        //         e.total_marks,
        //         (er.obtained_marks / e.total_marks) * 100 AS percentage,
        //         ea.attempt_date,
        //         ea.submission_time
        //     FROM
        //         students_tbl s
        //     JOIN
        //         exam_attempts_tbl ea ON s.student_id = ea.student_id
        //     JOIN
        //         exam_tbl e ON ea.exam_id = e.exam_id
        //     JOIN
        //         exam_results_tbl er ON ea.attempt_id = er.attempt_id
        //     WHERE
        //         e.created_by = ?
        //         AND e.is_deleted = 0
        //         AND er.obtained_marks >= (0.3 * e.total_marks)
        //     ORDER BY
        //         s.student_id, e.exam_id;
        //     `;
        const query = `
            SELECT
                s.student_id,
                s.first_name,
                s.last_name,
                s.email,
                s.mobile_no,
                e.exam_id,
                e.exam_name,
                er.obtained_marks,
                e.total_marks,
                (er.obtained_marks / e.total_marks) * 100 AS percentage,
                ea.attempt_date,
                ea.submission_time
            FROM
                students_tbl s
            JOIN
                exam_attempts_tbl ea ON s.student_id = ea.student_id
            JOIN
                exam_tbl e ON ea.exam_id = e.exam_id
            JOIN
                exam_results_tbl er ON ea.attempt_id = er.attempt_id
            WHERE
                e.created_by = ?
                AND e.is_deleted = 0
                AND s.is_deleted = 0
                AND er.obtained_marks >= (0.3 * e.total_marks)
                AND er.obtained_marks = (
                    SELECT MAX(er2.obtained_marks)
                    FROM exam_results_tbl er2
                    JOIN exam_attempts_tbl ea2 ON er2.attempt_id = ea2.attempt_id
                    WHERE ea2.exam_id = e.exam_id
                    AND er2.obtained_marks >= (0.3 * e.total_marks)
                )
            ORDER BY
                e.exam_id, s.student_id;
            `;
        const results = await databaseQuery(query, [admin_id]);
        return results;
    } catch (error) {
        // console.error("Error fetching student performance data:", error);
        throw new Error("Database query failed");
    }
}

const get_Batch_Analysis = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    try {
        const query = `
           SELECT
                b.batch_id,
                b.batch_name,
                e.exam_id,
                e.exam_name,
                AVG(er.obtained_marks) AS average_marks,
                COUNT(es.student_id) AS total_students,
                a.admin_id,
                a.first_name AS admin_first_name,
                a.last_name AS admin_last_name
            FROM
                exam_batches_tbl eb
            JOIN
                batches_tbl b ON eb.batch_id = b.batch_id
            JOIN
                exam_student_tbl es ON eb.exam_id = es.exam_id
            JOIN
                exam_results_tbl er ON es.exam_student_id = er.attempt_id
            JOIN
                exam_tbl e ON eb.exam_id = e.exam_id
            JOIN
                admins_tbl a ON b.created_by = a.admin_id  -- Join to get admin details
            WHERE
                a.admin_id = ?
            GROUP BY
                b.batch_id, b.batch_name, e.exam_id, a.admin_id, a.first_name, a.last_name;
        `;
        const results = await databaseQuery(query, [admin_id]);
        return results;
    } catch (error) {
        // console.error("Error fetching batch analysis data:", error);
        throw new Error("Database query failed");
    }
}

const get_Setup_Deletion_Analysis = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    try {
        const query = `
            SELECT
                e.exam_id,
                e.exam_name,
                e.is_setup_done,
                e.is_deleted,
                COUNT(es.exam_student_id) AS total_participants
            FROM
                exam_tbl e
            LEFT JOIN
                exam_student_tbl es ON e.exam_id = es.exam_id
            WHERE
                e.is_deleted = 0
                AND e.created_by = ?  -- Placeholder for the admin ID
            GROUP BY
                e.is_setup_done, e.exam_id, e.exam_name, e.is_deleted
            ORDER BY
                e.is_setup_done;
        `;
        const results = await databaseQuery(query, [admin_id]);
        return results;
    } catch (error) {
        // console.error("Error fetching setup and deletion analysis data:", error);
        throw new Error("Database query failed");
    }
}

const get_Engagement_Analysis = async (admin_id) => {
    if (typeof admin_id !== 'number') {
        throw new Error("Invalid admin_id. It must be a number.");
    }
    try {
        const query = `
            SELECT
                es.student_id,
                e.exam_id,
                e.exam_name,
                COUNT(es.exam_student_id) AS attempts,
                MIN(es.timestamp) AS first_attempt,
                MAX(es.timestamp) AS last_attempt
            FROM
                exam_student_tbl es
            JOIN
                exam_tbl e ON es.exam_id = e.exam_id
            WHERE
                e.is_deleted = 0 
                AND e.created_by = ?  
            GROUP BY
                es.student_id, e.exam_id;
        `;
        const results = await databaseQuery(query, [admin_id]);
        return results;
    } catch (error) {
        // console.error("Error fetching engagement analysis data:", error);
        throw new Error("Database query failed");
    }
}

const checkEmailExists = async (email) => {
    try {
        const checkStudentQuery = `SELECT email FROM students_tbl WHERE email = ?`;
        const checkAdminQuery = `SELECT email FROM admins_tbl WHERE email = ?`;

        const studentResult = await databaseQuery(checkStudentQuery, [email]);
        const adminResult = await databaseQuery(checkAdminQuery, [email]);

        if (studentResult.length > 0) {
            throw new Error("This email is registered as a student and cannot be used for an admin account.");
        }
        return adminResult.length > 0;
    } catch (error) {
        console.error("Error checking email existence:", error);
        throw error;
    }
};

const add_New_Admin_Records = async (first_name, last_name, email, address, dob, mobile_number, aadhar_number, designation, organization_name, gender, field_of_speciality, hashedPassword) => {
    try {
        const insertAdminQuery = `
            INSERT INTO admins_tbl 
            (first_name, last_name, email, password, address, dob, mobile_number, aadhar_number, designation, organization_name, gender, field_of_speciality) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await databaseQuery(insertAdminQuery, [
            first_name,
            last_name,
            email,
            hashedPassword,
            address,
            dob,
            mobile_number,
            aadhar_number,
            designation,
            organization_name,
            gender,
            field_of_speciality
        ]);

        return result;
    } catch (error) {
        console.error("Error adding new admin record:", error);
        throw error;
    }
};


export {
    fetchAllCategories,
    addCategory,
    fetchCategoryById,
    fetchCategoryById_For_Edit,
    updateCategoryInDatabase,
    deleteCategoryFromDatabase,
    Count_Total_Student,
    Count_Past_Exams,
    Count_Category,
    Count_Batch,
    get_Performance,
    get_Batch_Analysis,
    get_Setup_Deletion_Analysis,
    get_Engagement_Analysis,
    get_Exams,
    fetchCategoriesBySearchTerm,
    checkEmailExists,
    add_New_Admin_Records,
}
