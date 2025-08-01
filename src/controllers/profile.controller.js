import { responseObj } from '../utils/responseObj.js'
import { databaseQuery } from '../database/databaseQuery.js'
import { adminSchema ,studentSchema} from '../middlewares/profile.validation.js'



export async function getAdminProfile (req, res) {
  try {
    // const id = req.query.id
    const id = req.userId
    // console.log(id)
    const results = await databaseQuery(
      `SELECT * FROM admins_tbl WHERE admin_id= ${id}`
    )

    if (results.length == 0) {
      return res.json(responseObj(false, 404, 'User Not Found', results))
    }

    return res.json(responseObj(true, 201, 'Admin Data', results))
  } catch (error) {
    return res.json(responseObj(false, 500, error.message, 'Data Not Found'))
  }
}

export async function updateAdminProfile (req, res) {
  try {
    // const id = req.query.id
    const id = req.userId
    // console.log(id)

    const {
      firstname,
      lastname,
      dob,
      mobile_number,
      address,
      gender,
      designation,
      organization,
      experience,
      speciality
    } = req.body

    const value = await adminSchema.validateAsync({
      firstname: firstname,
      lastname: lastname,
      dob: dob,
      mobile_number: mobile_number,
      address: address,
      gender: gender,
      designation: designation,
      organization,
      experience: experience,
      speciality: speciality
    })
    // console.log(value)
    const results = await databaseQuery(
      `SELECT admin_id FROM admins_tbl WHERE admin_id = ${id}`
    )
    // console.log(results)
    if (results.length == 0) {
      return res.json(responseObj(false, 404, 'User Not Found', results))
    }

    const update = await databaseQuery(
      `UPDATE admins_tbl SET first_name='${firstname}',last_name='${lastname}',address='${address}',dob='${dob}',mobile_number='${mobile_number}',designation='${designation}',organization_name='${organization}',gender='${gender}',years_of_experience='${experience}',field_of_speciality='${speciality}' WHERE admin_id = ${id}`
    )
    // console.log(update)
    res.json(responseObj(true, 200, 'Updated Successfully', update))
  } catch (error) {
    return res.json(
      responseObj(false, 500, error.message, 'Internal Server Error!')
    )
  }
}

export async function getStudentProfile (req, res) {
  try {
    // let id = req.query.id
    const id = req.userId
    const results = await databaseQuery(
      `SELECT * FROM students_tbl WHERE  student_id = ${id} and is_deleted=0`
    )

    if (results.length == 0) {
      return res.json(responseObj(false, 404, 'User Not Found', results))
    }

    return res.json(responseObj(true, 201, 'Student Data', results))
  } catch (error) {
    return res.json(responseObj(false, 500, error.message, 'Data Not Found!'))
  }
}

export async function updateStudentProfile (req, res) {
  try {
    // console.log(req.body)
    // const id = req.query.id
    const id = req.userId
    // console.log(id)
    const { firstName, lastName } = req.body

    const check = await studentSchema.validateAsync({firstname: firstName,lastname : lastName});
    // console.log(check)

    const results = await databaseQuery(
      `SELECT * FROM students_tbl WHERE  student_id = ${id} and is_deleted=0`
    )
    // console.log(results)
    if (results.length == 0) {
      return res.json(responseObj(false, 404, 'User Not Found', results))
    }

    const update = await databaseQuery(
      `UPDATE students_tbl SET first_name= '${firstName}', last_name= '${lastName}' WHERE student_id = ${id} AND is_deleted = 0 `
    )
    res.json(responseObj(true, 200, 'Updated Successfully', update))
  } catch (error) {
    return res.json(
      responseObj(false, 500, error.message, 'Internal Server Error!')
    )
  }
}
