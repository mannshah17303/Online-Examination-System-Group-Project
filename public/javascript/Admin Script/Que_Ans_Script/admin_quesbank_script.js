const categoryId = new URLSearchParams(window.location.search).get(
  "categoryId"
);

document.addEventListener("DOMContentLoaded", async function () {
  // console.log("Ques-Script Loaded");
  await fetchAllQues(categoryId);
});

async function fetchAllQues(categoryId) {
  addLoader();
  const questions = await fetchQuesByCategory(categoryId);
  populateQuestionsTable(questions);
  setTimeout(() => {
    removeLoader();
  }, 500);
}

// List All Questions Front End
async function fetchQuesByCategory(categoryId) {
  try {
    const response = await fetch(
      `/que-bank/api/questions/by-category/${categoryId}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const all_ques = await response.json();
    // console.log(all_ques.status);
    if (all_ques.success) {
      return all_ques.data;
    } else {
      if (all_ques.status === 403) {
        window.location.href = "/admin/category/";
      }
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    alert("Something went wrong. Please try again.");
  }
}

function populateQuestionsTable(questions) {
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  if (Array.isArray(questions) && questions.length > 0) {
    questions.forEach((question) => {
      const questionCard = document.createElement("div");
      questionCard.classList.add("question-card");

      const questionHeader = document.createElement("div");
      questionHeader.classList.add("question-header");

      // Create question text element
      const questionText = document.createElement("h3");
      questionText.textContent = question.question_text;

      // Create a Delete Image button next to question
      const deleteButtonImg = document.createElement("img");
      deleteButtonImg.src = "/logo/delete_img.png";
      deleteButtonImg.alt = "Delete Question";
      deleteButtonImg.title = "Delete Question";
      deleteButtonImg.classList.add("delete-button-img");
      deleteButtonImg.onclick = (e) => {
        e.stopPropagation();
        deleteQuestion(question.question_id);
      };

      questionHeader.appendChild(questionText);
      questionHeader.appendChild(deleteButtonImg);

      const questionType = document.createElement("p");
      questionType.textContent = `Type: ${question.question_type}`;

      const actionsDropdown = document.createElement("div");
      actionsDropdown.classList.add("actions-dropdown");

      const dropdownButton = document.createElement("button");
      dropdownButton.textContent = "Actions";
      dropdownButton.classList.add("btn", "dropdown-button");

      const dropdownContent = document.createElement("div");
      dropdownContent.classList.add("dropdown-content");

      if (question.question_type === "MCQ") {
        const viewOptionButton = document.createElement("button");
        viewOptionButton.textContent = "View Option";
        viewOptionButton.classList.add("btn", "view-option-button");
        viewOptionButton.onclick = (e) => {
          e.stopPropagation();
          viewQuestionOption(question.question_id);
        };
        dropdownContent.appendChild(viewOptionButton);
      }

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "edit-button");
      editButton.onclick = (e) => {
        e.stopPropagation();
        editQuestion(question.question_id);
      };
      dropdownContent.appendChild(editButton);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "delete-button");
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteQuestion(question.question_id); // Implement this function
      };
      dropdownContent.appendChild(deleteButton);

      // Append dropdown content to dropdown
      actionsDropdown.appendChild(dropdownButton);
      actionsDropdown.appendChild(dropdownContent);

      // Append elements to the question card
      questionCard.appendChild(questionHeader); // Append the flex container
      questionCard.appendChild(questionType);
      questionCard.appendChild(actionsDropdown);

      // Make the card clickable to view the question
      questionCard.onclick = () => viewQuestion(question.question_id);

      // Append the question card to the container
      container.appendChild(questionCard);

      // Toggle dropdown visibility on button click
      dropdownButton.onclick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        dropdownContent.classList.toggle("show"); // Toggle dropdown visibility
      };

      // Close dropdown if clicked outside
      document.addEventListener("click", (e) => {
        if (!actionsDropdown.contains(e.target)) {
          dropdownContent.classList.remove("show"); // Hide dropdown
        }
      });
    });
  } else {
    const noQuestionsMessage = document.createElement("p");
    noQuestionsMessage.textContent =
      "No questions available for this category.";
    container.appendChild(noQuestionsMessage);
  }
}

// View Individual Question
function viewQuestion(questionId) {}

async function viewQuestionOption(questionId) {
  const get_mcq_option = await fetch(
    `/que-bank/api/fetch-mcq/by-question/${questionId}`
  );

  if (get_mcq_option.ok) {
    const option_data = await get_mcq_option.json();

    const optionsContainer = document.getElementById("view-mcq-option-div");
    optionsContainer.innerHTML = "";

    option_data.data.forEach((option) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option-container";

      const radioInput = document.createElement("input");
      radioInput.disabled = false;
      radioInput.type = "radio";
      radioInput.name = "mcq-option";
      radioInput.value = option.answer_id;
      radioInput.id = `option-${option.answer_id}`;

      radioInput.addEventListener("change", () => {
        highlightTextBox(option.answer_id);
      });

      if (option.is_correct) {
        radioInput.checked = true;
        radioInput.classList.add("correct-option");
      }

      const textBox = document.createElement("input");
      textBox.type = "text";
      textBox.value = option.answer_text;
      textBox.readOnly = true;
      textBox.id = option.answer_id;
      textBox.className = "readonly-textbox";

      if (option.is_correct) {
        textBox.classList.add("correct-answer");
      }

      // Create Edit img button
      const editButton = document.createElement("img");
      editButton.src = "/logo/editing.png";
      editButton.id = `edit-${option.answer_id}`;
      editButton.className = "mcq-edit-img-button";
      editButton.onclick = () => editOption(option.answer_id, questionId);

      // // Create Delete img button
      // const deleteButton = document.createElement("img");
      // deleteButton.src = "/logo/delete_img.png";
      // deleteButton.id = `delete-${option.answer_id}`;
      // deleteButton.className = "mcq-delete-img-button";
      // deleteButton.onclick = () => deleteOption(option.answer_id);

      // Append elements to the option div
      optionDiv.appendChild(radioInput);
      optionDiv.appendChild(textBox);
      optionDiv.appendChild(editButton);
      // optionDiv.appendChild(deleteButton);
      optionsContainer.appendChild(optionDiv);
    });

    document.getElementById("view-mcq-option-modal").style.display = "block";
  } else {
    alert("Something Went Wrong. Try Later!");
    CloseMcqOptionModal();
  }
}
function editOption(answerId, questionId) {
  const allTextBoxes = document.querySelectorAll(".readonly-textbox");
  const allEditButtons = document.querySelectorAll(".mcq-edit-img-button");

  allTextBoxes.forEach((textBox) => {
    if (textBox.id !== answerId) {
      textBox.readOnly = true; // Keep other text boxes read-only
    }
  });

  allEditButtons.forEach((button) => {
    if (button.id !== `edit-${answerId}`) {
      button.style.display = "none"; // Hide other edit buttons
    }
  });

  const textBox = document.querySelector(`.readonly-textbox[id="${answerId}"]`);
  textBox.readOnly = false;
  textBox.focus();
  highlightTextBox(answerId);
  const editButton = document.querySelector(
    `.mcq-edit-img-button[id="edit-${answerId}"]`
  );
  editButton.src = "/logo/save.png";
  editButton.onclick = () => saveOption(questionId);
}
function highlightTextBox(answerId) {
  const allTextBoxes = document.querySelectorAll(".readonly-textbox");
  allTextBoxes.forEach((textBox) => {
    textBox.style.border = "";
    textBox.style.backgroundColor = "";
  });

  // Highlight the selected text box
  const selectedTextBox = document.querySelector(
    `.readonly-textbox[id="${answerId}"]`
  );
  selectedTextBox.style.border = "2px solid blue";
  selectedTextBox.style.backgroundColor = "#e0f7fa";
}
async function saveOption(questionId) {
  const options = document.querySelectorAll('input[name="mcq-option"]');

  for (const option of options) {
    const textBox = document.querySelector(
      `.readonly-textbox[id="${option.value}"]`
    );
    const is_correct = option.checked;

    const data = {
      answer_id: option.value,
      answer_text: textBox.value,
      is_correct: is_correct,
      question_id: questionId,
    };
    // console.log(data);
    const response = await fetch(
      `/que-bank/api/mcq-answers/update/${data.answer_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(
        `Error updating answer ${data.answer_id}: ${
          errorData.message || "Something Went Wrong. Try Later!"
        }`
      );
      return;
    }
  }

  alert("All options have been edited successfully.");
  viewQuestionOption(questionId);
}
// For adding MCQ options
// const tinymceInstances = [];
// function addMcqOptions() {
//     const addContainer = document.getElementById('mcq-add-option-modal-div');

//     const optionSection = document.createElement('div');
//     optionSection.className = 'option-section';

//     const optionInput = document.createElement('textarea');
//     optionInput.placeholder = 'Option';
//     optionInput.className = 'mcq-option-input';

//     tinymce.init({
//         target: optionInput,
//         width: '100%',
//         height: '180px',
//         plugins: [
//             'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
//             'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
//         ],
//         toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
//         tinycomments_mode: 'embedded',
//         tinycomments_author: 'Author name',
//         mergetags_list: [
//             { value: 'First.Name', title: 'First Name' },
//             { value: 'Email', title: 'Email' },
//         ],
//         ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
//         setup: function (editor) {
//             tinymceInstances.push(editor);
//         }
//     });

//     const removeButton = document.createElement('button');
//     removeButton.textContent = 'Remove';
//     removeButton.classList.add('remove-option-button');
//     removeButton.onclick = function () {
//         addContainer.removeChild(optionSection);
//         const editorIndex = tinymceInstances.indexOf(tinymce.get(optionInput.id));
//         if (editorIndex !== -1) {
//             tinymceInstances.splice(editorIndex, 1);
//         }
//         tinymce.get(optionInput.id).remove();
//         toggleSubmitButton();
//     };

//     optionSection.appendChild(optionInput);
//     optionSection.appendChild(removeButton);
//     addContainer.appendChild(optionSection);
//     toggleSubmitButton();
// }
// function toggleSubmitButton() {
//     const submitButton = document.getElementById('submit-mcq-options');
//     const addContainer = document.getElementById('mcq-add-option-modal-div');
//     if (addContainer.children.length > 0) {
//         submitButton.style.display = 'block';
//     } else {
//         submitButton.style.display = 'none';
//     }
// }
// function getMcqOptionValues() {
//     const values = tinymceInstances.map(editor => editor.getContent());
//     const all_values = stripHtmlTags(values);
//     console.log(all_values);
//     return all_values;
// }
// function SubmitMCQOption() {
//     const values = getMcqOptionValues();
//     // console.log("Submitting values:", values);
// }
function CloseMcqOptionModal() {
  document.getElementById("view-mcq-option-modal").style.display = "none";
}

// Edit Ques Modal and Functions
async function fetchIndividualQues(questionId) {
  const response = await fetch(`/que-bank/api/questions/update/${questionId}`);
  if (response.ok) {
    const data = await response.json();
    const ques = data.data;
    return ques;
  } else {
    // console.log("Failed to fetch question");
    alert("Something Went Wrong. Try Later!");
  }
}

async function fetchQueAnswer(questionId) {
  const response = await fetch(`/que-bank/api/answer/update/${questionId}`);
  if (response.ok) {
    const data = await response.json();
    const answer = data.data;
    return answer;
  } else {
    // console.log("Failed to fetch question");
    alert("Something Went Wrong. Try Later!");
  }
}
async function editQuestion(questionId) {
  const question = await fetchIndividualQues(questionId);

  const answer = await fetchQueAnswer(questionId);

  if (question && question.length > 0) {
    const modal = document.getElementById("edit-myModal");

    // Load the current question text and type here
    const questionData = question[0];
    document.getElementById("edit-questionIdDisplay").value =
      questionData.question_id;
    document.getElementById("edit-questionText").value =
      questionData.question_text;
    document.getElementById("edit-questionType").value =
      questionData.question_type;
    if (questionData.question_type == 'MCQ'){
      document.getElementById('answerInp').hidden = true;
    }
    else{
      document.getElementById('answerInp').hidden = false;
    }

    // Display the question ID for saving later
    document.getElementById(
      "edit-questionIdDisplay"
    ).textContent = `Question ID: ${questionData.question_id}`;

    // Open the modal
    modal.style.display = "block";

    // Initialize TinyMCE with the current question text
    tinymce.get("edit-questionText").setContent(questionData.question_text);

    document.getElementById("answerInp").value = answer[0]["answer_text"];
  } else {
    // console.log("Failed to fetch question data.");
    alert("Something Went Wrong. Try Later!");
  }
}
async function edit_saveQuestion() {
  tinymce.triggerSave();

  // Get the question text from the textarea
  const questionTextWithHtml =
    document.getElementById("edit-questionText").value;

  // Remove HTML tags from the question text
  const questionText = removeHtmlTags(questionTextWithHtml);

  const questionId = document
    .getElementById("edit-questionIdDisplay")
    .textContent.split(": ")[1];

  const answerOfQuestion = document.getElementById("answerInp").value;

  // console.log("Saving Question ID:", questionId, "with Text:", questionText);

  try {
    const response = await fetch(
      `/que-bank/api/questions/update/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: questionText,
          answerOfQuestion: answerOfQuestion,
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert(result.message || "Question updated successfully!");
      edit_closeModal();
      fetchAllQues(categoryId);
    } else {
      const error = await response.json();
      alert(error.message || "Failed to update question.");
    }
  } catch (error) {
    // console.error("Error during save operation:", error);
    alert("Something went wrong. Please try again.");
  }
}
function removeHtmlTags(text) {
  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  text = text.replace(/&[a-zA-Z0-9#]+;/g, "");
  text = text.replace(/[^\w\s.?]/g, ""); // allows words, periods, and question marks
  text = text.replace(/\s+/g, " ");
  return text.trim();
}
function edit_closeModal() {
  const modal = document.getElementById("edit-myModal");
  modal.style.display = "none";
  document.getElementById("edit-questionText").value = "";
  document.getElementById("edit-questionType").value = "";
  tinymce.get("edit-questionText").setContent("");
}
window.onclick = function (event) {
  const modal = document.getElementById("edit-myModal");
  if (event.target === modal) {
    edit_closeModal();
  }
};

// Initialize TinyMCE
tinymce.init({
  selector: "#edit-questionText",
  menubar: false,
  toolbar:
    "undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
  setup: function (editor) {
    editor.on("change", function () {
      editor.save();
    });
  },
});

// Delete Question
async function deleteQuestion(questionId) {
  const confirmation = confirm(
    "Are you sure you want to delete this question?"
  );

  if (confirmation) {
    try {
      const response = await fetch(
        `/que-bank/api/questions/delete/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Question has been deleted successfully.");
        fetchAllQues(categoryId);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete question.");
      }
    } catch (error) {
      // console.error("Error during delete operation:", error);
      alert("Something went wrong. Please try again.");
    }
  } else {
    // console.log("Deletion canceled by user.");
    alert("Something went wrong. Please try again.");
  }
}

// Question Type Modal Option
function OpenQueTypeModal() {
  document.getElementById("add-ques-type-modal").style.display = "block";
}
function add_ques_type_closeModal() {
  document.getElementById("add-ques-type-modal").style.display = "none";
}
function add_ques_type_save() {
  const selectedType = document.getElementById("add-ques-type").value;
  if (selectedType) {
    // console.log("Selected Question Type:", selectedType);

    let questionType = selectedType;
    if (questionType === "Subjective") {
      openSubjectiveQuestionForm();
    } else {
      openMCQQuestionForm();
    }
    add_ques_type_closeModal();
  } else {
    alert("Please select a question type.");
  }
}

// Subjective Ques
function openSubjectiveQuestionForm() {
  tinymce.init({
    selector: "#subjective-question-input",
    menubar: false,
    toolbar:
      "undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
    setup: function (editor) {
      editor.on("change", function () {
        editor.save();
      });
    },
  });

  let addAnsInp = document.createElement("input");
  addAnsInp.type = "text";
  addAnsInp.id = "subjectiveAns";
  addAnsInp.name = "subjectiveAns";
  addAnsInp.placeholder = "Enter your answer here";
  addAnsInp.classList.add("subjective-answer");
  document.getElementById("subjective-ans-input-div").appendChild(addAnsInp);

  // Clear the TinyMCE editor content on load
  tinymce.get("subjective-question-input").setContent("");
  document.getElementById("subjective-question-modal").style.display = "block";
}
async function saveSubjectiveQuestion() {
  let questionContent = tinymce.get("subjective-question-input").getContent();
  questionContent = removeHtmlTags(questionContent);

  let questionAnswer = document.getElementById("subjectiveAns").value.trim();
  // console.log(questionContent);

  if (!questionContent) {
    alert("Please enter a question.");
    return;
  }
  try {
    const response = await fetch("/que-bank/api/questions/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: questionContent,
        cate_id: categoryId,
        type: "Subjective",
        questionAnswer: questionAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    // console.log("Subjective Question Saved:", result);
    alert("Question saved successfully!");
    CloseQueModal();
    window.location.reload();
  } catch (error) {
    // console.error("Error saving question:", error);
    alert("There was an error saving your question. Please try again.");
  }
}
function CloseQueModal() {
  document.getElementById("subjective-question-modal").style.display = "none";
  tinymce.get("subjective-question-input").remove(); // Optionally remove TinyMCE instance
}

// MCQ Ques
function openMCQQuestionForm() {
  tinymce.init({
    selector: "#mcq-question-input",
    width: "100%",
    height: "180px",
    menubar: false,
    toolbar:
      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11y check a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
    plugins: ["help", "wordcount"],
    mergetags_list: [
      { value: "Nishit", title: "Author" },
      { value: "Nishit@esparkbizmail.com", title: "Email" },
    ],
    setup: function (editor) {
      editor.on("change", function () {
        editor.save();
      });
    },
  });

  document.getElementById("mcq-question-modal").style.display = "block";

  const optionContainer = document.getElementById("mcq-option-modal-div");
  optionContainer.innerHTML = "";

  const addOptionButton = document.createElement("button");
  addOptionButton.textContent = "Add Option";
  addOptionButton.classList.add("add-option-button");
  addOptionButton.onclick = function () {
    const optionSection = document.createElement("div");
    optionSection.className = "option-section";

    const optionRadio = document.createElement("input");
    optionRadio.type = "radio";
    optionRadio.name = "correctOption";
    optionRadio.className = "mcq-option-radio";

    const optionInput = document.createElement("textarea");
    optionInput.placeholder = "Option";
    optionInput.className = "mcq-option-input";

    tinymce.init({
      target: optionInput,
      width: "100%",
      height: "150px",
      menubar: false,
      toolbar:
        "undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
      setup: function (editor) {
        editor.on("change", function () {
          editor.save();
        });
      },
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-option-button");
    removeButton.onclick = function () {
      optionContainer.removeChild(optionSection);
      tinymce.get(optionInput.id).remove();
      validateOptions();
    };
    optionSection.appendChild(optionRadio);
    optionSection.appendChild(optionInput);
    optionSection.appendChild(removeButton);
    optionContainer.appendChild(optionSection);
  };
  optionContainer.appendChild(addOptionButton);
}
function validateOptions() {
  const optionInputs = document.querySelectorAll(".mcq-option-input");
  const correctOptions = document.querySelectorAll(
    'input[name="correctOption"]:checked'
  );

  if (optionInputs.length < 2) {
    alert("Please add at least two options.");
    return false;
  }
  if (correctOptions.length === 0) {
    alert("Please select one correct option.");
    return false;
  }
  return true;
}
function CloseMcqModal() {
  document.getElementById("mcq-question-modal").style.display = "none";
  tinymce.get("mcq-question-input").remove();
}
async function addMcqQueModal() {
  if (!validateOptions()) {
    return;
  }

  const questionContent = tinymce.get("mcq-question-input").getContent();

  if (!questionContent) {
    alert("Please enter a question.");
    return;
  }
  const cleanQuestion = stripHtmlTags(questionContent);
  const options = [];
  const correctOption = document.querySelector(
    'input[name="correctOption"]:checked'
  );

  const optionInputs = document.querySelectorAll(".mcq-option-input");
  optionInputs.forEach((input) => {
    const isCorrect = correctOption && correctOption.nextSibling === input;
    options.push({
      text: stripHtmlTags(input.value),
      value: isCorrect ? 1 : 0,
    });
  });

  if (options.length < 2) {
    alert("Please add at least two options. With Correct Answer");
    return;
  }

  const data = {
    type: "MCQ",
    categoryId: categoryId,
    question: cleanQuestion,
    options: options,
  };

  // console.log("Data to send:", data);

  fetch("/que-bank/api/mcq-answers/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      alert("Question saved successfully!");
      CloseMcqModal();
      fetchAllQues(categoryId);
    })
    .catch((error) => {
      alert("There was an error saving your question. Please try again.");
    });
}
function stripHtmlTags(text) {
  // Remove HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  // Remove HTML entities (like &nbsp;)
  text = text.replace(/&[a-zA-Z0-9#]+;/g, "");
  // Remove unwanted characters but keep words, periods, and question marks
  text = text.replace(/[^\w\s.?]/g, ""); // allows words, periods, and question marks
  // Replace multiple spaces with a single space
  text = text.replace(/\s+/g, " ");
  // Trim leading and trailing spaces
  return text.trim();
}
