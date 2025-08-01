import Joi from 'joi'


export const adminSchema = Joi.object({
  firstname: Joi.string().alphanum()
    .messages({ 'string.empty': 'Firstname is required. ', 'string.alphanum' : 'Only alphanumeric values are allowed' })
    .required(),
  lastname: Joi.string().alphanum()
    .messages({ 'string.empty': `Lastname is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' })
    .required(),
  dob: Joi.date()
    .required()
    .max('now')
    .min('1900-01-01')
    .messages({
      'any.required': 'Please provide your date of birth',
      'date.base': 'Date of birth must be a valid date',
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Date of birth is not valid'
    }),
  mobile_number: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
    .required(),
  address: Joi.string().alphanum()
    .required()
    .messages({ 'string.empty': `Address is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' }),
  gender: Joi.string()
    .required()
    .messages({ 'string.empty': `Gender is required. ` }),
  designation: Joi.string().alphanum()
    .required()
    .messages({ 'string.empty': `Designation is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' }),
  organization: Joi.string().alphanum()
    .required()
    .messages({ 'string.empty': `Organization Name is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' }),
  experience: Joi.number()
    .required()
    .messages({ 'string.empty': `Year of Experience is required. ` }),
  speciality: Joi.string().alphanum()
    .required()
    .messages({ 'string.empty': `Speciality is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' })
})


export const studentSchema = Joi.object({
  firstname: Joi.string().alphanum()
    .messages({ 'string.empty': 'Firstname is required. ', 'string.alphanum' : 'Only alphanumeric values are allowed' })
    .required(),
  lastname: Joi.string().alphanum()
    .messages({ 'string.empty': `Lastname is required. `, 'string.alphanum' : 'Only alphanumeric values are allowed' })
    .required(),
})