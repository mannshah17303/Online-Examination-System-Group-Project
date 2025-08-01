import { databaseQuery } from '../../database/databaseQuery.js';

const check_Login_Credentials = async (email) => {
    try {
        const query = "SELECT * FROM admins_tbl WHERE email = ? and role = 1";
        const result = await databaseQuery(query, [email]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user from the database.");
    }
}

// Password Update Funuctions
const updateUserPassword = async (userId, newPassword) => {
    try {
        const query = `UPDATE admins_tbl SET password = ? WHERE admin_id = ? AND is_deleted = 0 `;
        const result = await databaseQuery(query, [newPassword, userId]);

        if (result.affectedRows === 0) {
            throw new Error("User  not found or already deleted");
        }

        return true; // Return true if the update was successful
    } catch (error) {
        console.error("Error updating user password:", error);
        throw error; // Rethrow the error to be handled by the calling function
    }
};

// Profile Management Funuctions
const get_UserAdmin_Data = async (adminId) => {
    try {
        const query = "SELECT admin_id, first_name, last_name, email, address, dob , mobile_number , gender, role FROM admins_tbl WHERE admin_id = ? AND is_deleted = 0";
        const result = await databaseQuery(query, [adminId]);
        return result;
    } catch (error) {
        console.error("Error Fetching Admin Data:", error);
        throw error;
    }
}
const update_UserAdmin_Data = async (superAdminId, firstName, lastName, email, address, dob, mobile_number, gender, role) => {
    try {
        const query = `
            UPDATE admins_tbl 
            SET first_name = ?, last_name = ?, email = ?, address = ?, dob = ?, mobile_number = ?, gender = ?, role = ? 
            WHERE admin_id = ? AND is_deleted = 0;
        `;
        const result = await databaseQuery(query, [firstName, lastName, email, address, dob, mobile_number, gender, role, superAdminId]);
        return result;
    }
    catch (error) {
        console.error("Error Updating Admin Data:", error);
        throw error;
    }
}

// Manage Admins Functions
const getAdmins_List = async () => {
    try {
        const query = "SELECT * FROM admins_tbl WHERE is_deleted = 0 AND role = 0";
        const result = await databaseQuery(query);
        return result;
    }
    catch (error) {
        console.error("Error Listing Admin Data", error);
        throw error;
    }
}
const deactivateAdmin = async (adminId) => {
    try {
        // Update query
        const query = "UPDATE admins_tbl SET is_deleted = 1 WHERE admin_id = ? AND is_deleted = 0";
        const result = await databaseQuery(query, [adminId]);
        return result;
    }
    catch (error) {
        console.error("Error Deactivating Admin", error);
        throw error;
    }
}
const getDeactivatedAdmins_List = async () => {
    try {
        const query = "SELECT * from admins_tbl WHERE is_deleted = 1";
        const result = await databaseQuery(query);
        return result;
    }
    catch (error) {
        console.error("Error Fetching Deactived Admin List", error);
        throw error;
    }
}
const activateAdmin = async (adminId) => {
    try {
        const query = "UPDATE admins_tbl SET is_deleted = 0 WHERE admin_id = ? AND is_deleted = 1";
        const email_fetch = "Select email from admins_tbl where admin_id = ?";
        const result = await databaseQuery(query, [adminId]);
        const result_email = await databaseQuery(email_fetch, [adminId]);
        return { result_email, result };
    }
    catch (error) {
        console.error("Error Fetching Deactived Admin List", error);
        throw error;
    }

}
const deleteAdmin = async (adminId) => {
    try {
        const query = "DELETE FROM admins_tbl WHERE admin_id = ? AND is_deleted = 1";
        const result = await databaseQuery(query, [adminId]);
        return result;
    }
    catch (error) {
        console.error("Error Fetching Deactived Admin List", error);
        throw error;
    }
}
const check_Existing_Email = async (email) => {
    try {
        const existingAdminQuery = `SELECT admin_id FROM admins_tbl WHERE email = ?`;
        const existingAdmin = await databaseQuery(existingAdminQuery, [email]);
        if (existingAdmin.length > 0) {
            return { affectedRows: 0 };
        }
        else {
            return { affectedRows: 1 };
        }
    } catch (error) {
        console.error("Error checking existing email:", error);
        throw error;
    }
}


export {
    check_Login_Credentials,
    updateUserPassword,
    get_UserAdmin_Data,
    update_UserAdmin_Data,
    getAdmins_List,
    deactivateAdmin,
    getDeactivatedAdmins_List,
    activateAdmin,
    deleteAdmin,
    check_Existing_Email,
}