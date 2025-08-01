import Joi from "joi";


// Validation for initial exam creation stage
export const initialExamCreateSchema = Joi.object({
    examName: Joi.string().regex(/.*[a-zA-Z].*/).required().min(2).max(50).messages({
        'string.empty': 'Exam name cannot be empty.',
        'string.pattern.base':'Exam name must contain least one charecter',
        'string.min': 'Exam name must be at least 2 characters long.',
        'string.max': 'Exam name cannot exceed 50 characters.'
    }),
    examDescription: Joi.string().required().max(100).messages({
       'string.empty': 'Exam description cannot be empty.',
        'string.max': 'Exam description cannot exceed 100 characters.'
    })
});
// Validation for marks entry
export const marksSchema = Joi.object({
    marks: Joi.number().min(1).messages({
        'number.base': 'Marks must be a valid number.',
        'number.min': 'Marks must be at least 1.'
    })
});

// Validation for final stage exam creation
export const finalExamCreateSchema = Joi.object({
    examName: Joi.string().regex(/.*[a-zA-Z].*/).required().min(2).max(50).messages({
        'string.empty': 'Exam name cannot be empty.',
        'string.pattern.base':'Exam name must contain least one charecter',
        'string.min': 'Exam name must be at least 2 characters long.',
        'string.max': 'Exam name cannot exceed 50 characters.'
    }),
    examDescription: Joi.string().required().max(100).messages({
       'string.empty': 'Exam description cannot be empty.',
        'string.max': 'Exam description cannot exceed 100 characters.'
    }),
    passingMarks: Joi.number().required().messages({
        'number.base': 'Passing marks must be a valid number.',
        'any.required': 'Passing marks are a required field.'
    }),
    startTime: Joi.date().required().messages({
        'date.base': 'Start time must be a valid date.',
        'any.required': 'Start time is a required field.'
    }),
    endTime: Joi.date().required().messages({
        'date.base': 'End time must be a valid date.',
        'any.required': 'End time is a required field.'
    }),
    duration: Joi.number().required().messages({
        'number.base': 'Duration must be a valid.',
        'any.required': 'Duration is a required field.'
    })
});

//joi schema for assessment
export const assessment_mark = Joi.object({
    marks: Joi.number().min(0).messages({
        'number.base': 'Marks must be a valid number.',
        'number.min': 'Marks must be at least 0.'
    })
});

