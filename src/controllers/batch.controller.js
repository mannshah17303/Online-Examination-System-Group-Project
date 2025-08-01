import { databaseQuery } from "../database/databaseQuery.js";
import { responseObj } from "../utils/responseObj.js";
import fs from "fs";
import csv from "csv-parser";

// for displaying main page
export const displayPage = async (req, res) => {
  try {
    res.render("batch/batch-page", { layout: "layouts/admin-layout.ejs" });
  } catch (err) {
    // console.log("error in displayPage");
    console.log(err);
    res.send(
      responseObj(false, 500, "Error while displaying batch-list.ejs page")
    );
  }
};

// get batch wise all students list
export const getAllStudents = async (req, res) => {
  try {
    const data = {};
    const batchId = req.body.batchId;
    data.batchName = await databaseQuery(
      "select * from batches_tbl where batch_id = ?;",
      [batchId]
    );
    data.studentList = await databaseQuery(
      "select bst.id, bst.batch_id, bst.created_at, st.student_id, st.first_name, st.last_name, st.email from batch_students_tbl bst join students_tbl st on bst.student_id = st.student_id where bst.batch_id = ?;",
      [batchId]
    );

    return res
      .status(200)
      .json(
        responseObj(true, 200, "get student list by batch successfully!", data)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        responseObj(
          false,
          500,
          "Error while getting student list by batch!",
          error
        )
      );
  }
};

// add student in particular batch
export const addStudent = async (req, res) => {
  try {
    const { email } = req.body;
    const batchId = req.body.batchId;

    const studentId = await databaseQuery(
      `select student_id from students_tbl where email in (?);`,
      [email]
    );

    if (studentId.length == 0) {
      return res
        .status(404)
        .json(responseObj(true, 404, "Add Valid Student Email!"));
    }

    let studentIdArray = studentId.map((ele) => ele.student_id);
    const checkEmail = await databaseQuery(
      `select student_id from batch_students_tbl where batch_id = ${batchId} and student_id in (${studentIdArray})`
    );

    const newStudentIdArray = studentId.filter(
      (ele) =>
        !checkEmail
          .map((student) => student.student_id)
          .includes(ele.student_id)
    );
    if (newStudentIdArray.length == 0) {
      return res
        .status(200)
        .json(responseObj(true, 200, "Email Already Exists!"));
    } else {
      const insertQueryValues = newStudentIdArray.map((ele) => [
        batchId,
        ele.student_id,
      ]);
      const result = await databaseQuery(
        "insert into batch_students_tbl(batch_id, student_id) values ?;",
        [insertQueryValues]
      );

      return res
        .status(201)
        .json(responseObj(true, 201, "Student added successfully!"));
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        responseObj(false, 500, "Error while adding student in batch!", error)
      );
  }
};

// delete list of student from batch
export const deleteStudent = async (req, res) => {
  try {
    const batchId = req.body.batchId;
    const studentIds = req.body.student_id;
    // console.log("studentIds: ", studentIds);

    const result = await databaseQuery(
      `delete from batch_students_tbl where batch_id = ${batchId} and student_id in (${studentIds});`
    );
    // const result = await databaseQuery(`update batch_students_tbl set is_deleted = true where batch_id = ${batchId} and student_id in (${studentIds});`)
    return res
      .status(200)
      .json(responseObj(true, 200, "Students deleted successfully!"));
  } catch (error) {
    return res
      .status(500)
      .json(
        responseObj(
          false,
          500,
          "Error while delete student from batch students list!"
        )
      );
  }
};

export const studentFileHandler = async (req, res) => {
  try {
    let emailArray = [];
    
    fs.createReadStream(`${req.file.path}`, { encoding: "utf-8" })
      .pipe(csv())
      .on("data", (data) => {
        emailArray.push(data.Email);
      })
      .on("error", (error) => {
        return res
          .status(500)
          .json(responseObj(false, 500, "Error while reading file!", error));
      })
      .on("end", () => {
        fs.unlinkSync(`${req.file.path}`);
        return res
          .status(200)
          .json(
            responseObj(true, 200, "Email list get successfully!", emailArray)
          );
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(responseObj(false, 500, "Error while parsing csv file", error));
  }
};

// create new batch
export const addBatch = async (req, res) => {
  try {
    let data_received = req.body;

        let batchExists = await databaseQuery(`select * from batches_tbl where batch_name = '${data_received.batchName}' and created_by = ${req.userId} and is_deleted = 0`);

        if (Object.entries(batchExists).length > 0){
            res.send(responseObj(false, 400, 'Batch already exist. Try with another name for batch!!'));
        }
        else{
            let addedBatch = await databaseQuery(`insert into batches_tbl (batch_name, created_by) values ("${data_received.batchName}", ${req.userId})`);
    
            res.send(responseObj(true, 200, 'Batch added successfully!!'));
        }
    } catch (err) {
    console.log("error in addBatch");
    console.log(err);
    res.send(
      responseObj(
        false,
        500,
        "Add batch request failed for some reason. Please try again..."
      )
    );
  }
};

// update an existing batch
export const editBatch = async (req, res) => {
  try {
    let batchData = await databaseQuery(
      `select * from batches_tbl where batch_id = ${req.body.batchId} and batch_name = '${req.body.batchName}' and is_deleted = 0 and created_by = ${req.userId}`
    );

    if (Object.entries(batchData).length > 0) {
      res.send(responseObj(false, 400, "Batch already exists!!"));
    } else {
      let editQuery = await databaseQuery(
        `update batches_tbl set batch_name = '${req.body.batchName}' where batch_id = ${req.body.batchId}`
      );

      res.send(
        responseObj(
          true,
          200,
          "Batch updated successfully!!",
          req.body.batchName
        )
      );
    }
  } catch (err) {
    console.log("error in editBatch");
    console.log(err);
    res.send(
      responseObj(false, 500, "Batch data fetch failed for single batch")
    );
  }
};

// delete an existing batch
export const deleteBatch = async (req, res) => {
  try {
    let batchIds = req.body.batchIds;

    let deleteBatchResult = await databaseQuery(
      `update batches_tbl set is_deleted = 1 where batch_id in (${batchIds})`
    );

    // let deleteStudentFromBatch = await databaseQuery(
    //   `update batch_students_tbl set is_deleted = 1 where batch_id in (${batchIds})`
    // );

    res.send(responseObj(true, 200, "Batch(es) deleted successfully!!"));
  } catch (err) {
    console.log("error in deleteBatch");
    console.log(err);
    res.send(responseObj(false, 500, "deleteBatch failed"));
  }
};

// listing all batches
export const getAllBatches = async (req, res) => {
  try {
    let allBatches = await databaseQuery(
      `select * from batches_tbl where created_by = ${req.userId} and is_deleted = 0`
    );

    res.render(
      "batch/batch-list",
      { allBatches: allBatches, layout: false },
      (err, html) => {
        if (err) {
          res.send(
            responseObj(false, 500, "can not get html of batch listing")
          );
        } else {
          res.send(
            responseObj(true, 200, "get all batches successfully!", html)
          );
        }
      }
    );
  } catch (err) {
    console.log("error in getAllBatches");
    console.log(err);
    res.send(responseObj(false, 500, "getAllBatches failed"));
  }
};
