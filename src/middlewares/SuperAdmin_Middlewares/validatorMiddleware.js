import Joi from 'joi';
import { responseObj } from '../../utils/responseObj.js';

const validateProfileSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'First name must be a string.',
            'string.min': 'First name must be at least 1 character long.',
            'string.max': 'First name must be at most 50 characters long.',
            'string.empty': 'First name cannot be empty.',
            'string.pattern.base': 'First name must contain only alphabetic characters.',
        }),
    lastName: Joi.string().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'Last name must be a string.',
            'string.min': 'Last name must be at least 1 character long.',
            'string.max': 'Last name must be at most 50 characters long.',
            'string.empty': 'Last name cannot be empty.',
            'string.pattern.base': 'Last name must contain only alphabetic characters.',
        }),
    email: Joi.string().email().required()
        .messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email cannot be empty.',
        }),
    address: Joi.string().min(10).max(100).required()
        .messages({
            'string.base': 'Address must be a string.',
            'string.min': 'Address must be at least 10 characters long.',
            'string.max': 'Address must be at most 100 characters long.',
            'string.empty': 'Address cannot be empty.',
        }),
    dob: Joi.date().iso().required()
        .messages({
            'date.base': 'Date of birth must be a valid date.',
            'date.iso': 'Date of birth must be in ISO format.',
            'any.required': 'Date of birth is required.',
        }),
    mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.base': 'Mobile number must be a string.',
            'string.pattern.base': 'Mobile number must be exactly 10 digits.',
            'string.empty': 'Mobile number cannot be empty.',
        }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required()
        .messages({
            'string.base': 'Gender must be a string.',
            'any.only': 'Gender must be one of Male, Female, or Other.',
            'string.empty': 'Gender cannot be empty.',
        }),
    role: Joi.string().valid('Super-Admin').required()
        .messages({
            'string.base': 'Role must be a string.',
            'any.only': 'Role must be Super-Admin.',
            'string.empty': 'Role cannot be empty.',
        }),
});

const validateNewAdminDetailsSchema = Joi.object({
    f_name: Joi.string().alphanum().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'First name must be a string.',
            'string.min': 'First name must be at least 1 character long.',
            'string.max': 'First name must be at most 50 characters long.',
            'string.empty': 'First name cannot be empty.',
            'string.pattern.base': 'First name must contain only alphabetic characters.',
            'string.alphanum' : 'Only alphanumeric values are allowed in first name'
        }),
    l_name: Joi.string().alphanum().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'Last name must be a string.',
            'string.min': 'Last name must be at least 1 character long.',
            'string.max': 'Last name must be at most 50 characters long.',
            'string.empty': 'Last name cannot be empty.',
            'string.pattern.base': 'Last name must contain only alphabetic characters.',
            'string.alphanum' : 'Only alphanumeric values are allowed in last name'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email cannot be empty.',
        }),
    mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.base': 'Mobile number must be a string.',
            'string.pattern.base': 'Mobile number must be exactly 10 digits.',
            'string.empty': 'Mobile number cannot be empty.',
        }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required()
        .messages({
            'string.base': 'Gender must be a string.',
            'any.only': 'Gender must be one of Male, Female, or Other.',
            'string.empty': 'Gender cannot be empty.',
        }),
    aadhar_number: Joi.string().pattern(/^[0-9]{12}$/).required()
        .messages({
            'string.base': 'Aadhar number must be a string.',
            'string.pattern.base': 'Aadhar number must be exactly 12 digits.',
            'string.empty': 'Aadhar number cannot be empty.',
        }),
});

const validateNewAdminEntries = Joi.object({
    first_name: Joi.string().alphanum().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'First name must be a string.',
            'string.min': 'First name must be at least 1 character long.',
            'string.max': 'First name must be at most 50 characters long.',
            'string.empty': 'First name cannot be empty.',
            'string.pattern.base': 'First name must contain only alphabetic characters.',
            'string.alphanum' : 'Only alphanumeric values are allowed'
        }),
    last_name: Joi.string().alphanum().min(1).max(50).required()
        .pattern(/^[A-Za-z]+$/)
        .messages({
            'string.base': 'Last name must be a string.',
            'string.min': 'Last name must be at least 1 character long.',
            'string.max': 'Last name must be at most 50 characters long.',
            'string.empty': 'Last name cannot be empty.',
            'string.pattern.base': 'Last name must contain only alphabetic characters.',
            'string.alphanum' : 'Only alphanumeric values are allowed'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.base': 'Email must be a string.',
            'string.empty': 'Email cannot be empty.',
        }),
    password: Joi.string().min(6).max(100).required()
        .messages({
            'string.base': 'Password must be a string.',
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Password must be at most 100 characters long.',
            'string.empty': 'Password cannot be empty.',
        }),
    confirm_password: Joi.string().valid(Joi.ref('password')).required()
        .messages({
            'any.only': 'Confirm password must match the password.',
            'string.empty': 'Confirm password cannot be empty.',
        }),
    address: Joi.string().min(1).max(255).required()
        .messages({
            'string.base': 'Address must be a string.',
            'string.empty': 'Address cannot be empty.',
            'string.min': 'Address must be at least 1 character long.',
            'string.max': 'Address must be at most 255 characters long.',
        }),
    dob: Joi.date().iso().required()
        .messages({
            'date.base': 'Date of birth must be a valid date.',
            'date.empty': 'Date of birth cannot be empty.',
        }),
    mobile_number: Joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
            'string.base': 'Mobile number must be a string.',
            'string.pattern.base': 'Mobile number must be exactly 10 digits.',
            'string.empty': 'Mobile number cannot be empty.',
        }),
    aadhar_number: Joi.string().pattern(/^[0-9]{12}$/).required()
        .messages({
            'string.base': 'Aadhar number must be a string.',
            'string.pattern.base': 'Aadhar number must be exactly 12 digits.',
            'string.empty': 'Aadhar number cannot be empty.',
        }),
    designation: Joi.string().alphanum().min(1).max(100).required()
        .messages({
            'string.base': 'Designation must be a string.',
            'string.empty': 'Designation cannot be empty.',
            'string.min': 'Designation must be at least 1 character long.',
            'string.max': 'Designation must be at most 100 characters long.',
            'string.alphanum' : 'Only alphanumeric values are allowed in designation'
        }),
    organization_name: Joi.string().alphanum().min(1).max(100).required()
        .messages({
            'string.base': 'Organization name must be a string.',
            'string.empty': 'Organization name cannot be empty.',
            'string.min': 'Organization name must be at least 1 character long.',
            'string.max': 'Organization name must be at most 100 characters long.',
            'string.alphanum' : 'Only alphanumeric values are allowed in organization name'
        }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required()
        .messages({
            'string.base': 'Gender must be a string.',
            'any.only': 'Gender must be one of Male, Female, or Other.',
            'string.empty': 'Gender cannot be empty.',
        }),
    field_of_speciality: Joi.string().alphanum().min(1).max(100).required()
        .messages({
            'string.base': 'Field of speciality must be a string.',
            'string.empty': 'Field of speciality cannot be empty.',
            'string.min': 'Field of speciality must be at least 1 character long.',
            'string.max': ' Field of speciality must be at most 100 characters long.',
            'string.alphanum' : 'Only alphanumeric values are allowed in field of speciality'
        }),
});

export const validateProfile = async (req, res, next) => {
    try {
        // Destructure the body to get the fields
        const { firstName, lastName, email, address, dob, mobile_number, gender, role } = req.body;

        // Validate the destructured fields
        const { error } = validateProfileSchema.validate({
            firstName,
            lastName,
            email,
            address,
            dob,
            mobile_number,
            gender,
            role,
        });

        if (error) {
            console.log(error.message);
            return res.json(responseObj(false, 400, "Validation Failed", error.message));
            // return (new Error(error.message));
        }
        next();
    } catch (err) {
        return res.json(responseObj(false, 500, "Internal Server Error", err.message));
    }
};

export const validateNewAdmin = async (req, res, next) => {
    try {
        // Destructure the body to get the fields
        const { f_name, l_name, email, mobile_number, gender, aadhar_number } = req.body;

        // Validate the destructured fields
        const { error } = validateNewAdminDetailsSchema.validate({
            f_name,
            l_name,
            email,
            mobile_number,
            gender,
            aadhar_number,
        });

        if (error) {
            console.log(error.message);
            return res.json(responseObj(false, 400, "Validation Failed", error.message));
            // return (new Error(error.message));
        }
        next();
    } catch (err) {
        return res.json(responseObj(false, 500, "Internal Server Error", err.message));
    }
};

export const ValidateAdminEntries = async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            confirm_password,
            address,
            dob,
            mobile_number,
            aadhar_number,
            designation,
            organization_name,
            gender,
            field_of_speciality
        } = req.body;

        const { error } = validateNewAdminEntries.validate({
            first_name,
            last_name,
            email,
            password,
            confirm_password,
            address,
            dob,
            mobile_number,
            aadhar_number,
            designation,
            organization_name,
            gender,
            field_of_speciality
        });

        if (error) {
            console.log(error.message);
            return res.json(responseObj(false, 400, "Validation Failed", error.message));
        }

        next();
    } catch (err) {
        console.error("Internal Server Error:", err.message); // Log the error for debugging
        return res.json(responseObj(false, 500, "Internal Server Error", err.message));
    }
};