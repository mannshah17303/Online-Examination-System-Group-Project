document.getElementById("frm_batchId").readOnly = true;
async function getBatches() {
  try {
    let result = await fetch("/api/batch/batch-list", {
      method: "get",
    });

    let response = await result.json();

    if (response.success) {
      document.getElementById("mainDiv").innerHTML = response.data;
      await editSymbol();
    } else if (response.status == 400) {
      alert("Authentication failed");
      location.href = "/admin/login";
    } else {
      alert(response.message);
    }
  } catch (err) {
    // console.log("error in getBatches");
    // console.log(err);
  }
}

async function addBatch() {
  try {
    let batchName = document.getElementById("batchName").value.trim();
    // if (batchName == "") {
    //   alert("Enter name of batch first");
    // } else {
      let result = await fetch("/api/batch/add-batch", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchName: batchName
        })
      });

      let response = await result.json();

      // console.log(response)

      alert(response.message);

      document.getElementById("batchName").value = "";

      document.getElementById("closeBtnAddBatch").click();

      await getBatches();
    // }
  } catch (err) {
    // console.log("error in addBatch");
    // console.log(err);
  }
}

async function editBatch(id, changedName) {
  try {
    let result = await fetch("/api/batch/edit-batch", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        batchId: id,
        batchName: changedName,
      }),
    });

    let response = await result.json();
    alert(response.message);
  } catch (err) {
    // console.log("error in editBatch");
    // console.log(err);
  }
}

async function editBatchOnFocusChange() {
  try {
    document.querySelectorAll("[id^='editNameInp_']").forEach((inp) => {
      inp.addEventListener("blur", async () => {
        let changedName = inp.value.trim();
        await editBatch(inp.id.substring(12), changedName);
        await getBatches();
        await editSymbol();
      });
    });
  } catch (err) {
    // console.log("error in editBatchOnFocusChange");
    // console.log(err);
  }
}

async function editSymbol() {
  try {
    document.querySelectorAll("[id^='edit_']").forEach((btn) => {
      btn.addEventListener("click", async () => {
        let content = document
          .getElementById(`span_${btn.id.substring(5)}`)
          .innerHTML.trim();

        document.getElementById(
          `spanInpDiv_${btn.id.substring(5)}`
        ).innerHTML = `<input type="text" name="editNameInp" id="editNameInp_${btn.id.substring(
          5
        )}" value="${content}" />`;

        document.getElementById(`editNameInp_${btn.id.substring(5)}`).focus();

        await editBatchOnFocusChange();
      });
    });
  } catch (err) {
    // console.log("error in editSymbol");
    // console.log(err);
  }
}

async function getAllCheckedBoxes() {
  try {
    let arr = [];
    document.querySelectorAll('[type="checkbox"]').forEach((checkbox) => {
      if (checkbox.checked) {
        arr.push(checkbox.id.substring(6));
      }
    });
    return arr;
  } catch (err) {
    // console.log("error in getAllCheckedBoxes");
    // console.log(err);
  }
}

async function deleteBatches() {
  try {
    if (confirm("Are you sure?")) {
      let batchIds = await getAllCheckedBoxes();

      if (batchIds.length > 0) {
        let result = await fetch("/api/batch/delete-batch", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batchIds: batchIds,
          }),
        });

        let response = await result.json();

        alert(response.message);

        if (response.success) {
          await getBatches();
          await editSymbol();
        }
      } else {
        alert("select checkboxes to delete those batches");
      }
    }
  } catch (err) {
    // console.log("error in deleteBatches");
    // console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);

  try {
    await getBatches();

    document.getElementById("addBtn").addEventListener("click", addBatch);

    document.getElementById("addBatchBtn").addEventListener("click", () => {
      document
        .getElementsByClassName("sidebarDiv")[0]
        .classList.toggle("blurMainDiv");
      document
        .getElementsByClassName("mainDiv")[0]
        .classList.toggle("blurMainDiv");

      let ele = document.getElementById("addBatchDivId");
      ele.style.display = "flex";
    });
    document
      .getElementById("closeBtnAddBatch")
      .addEventListener("click", () => {
        document.getElementById("addBatchDivId").style.display = "none";
        document
          .getElementsByClassName("sidebarDiv")[0]
          .classList.toggle("blurMainDiv");
        document
          .getElementsByClassName("mainDiv")[0]
          .classList.toggle("blurMainDiv");
      });

    document
      .getElementById("deleteBtn")
      .addEventListener("click", deleteBatches);
  } catch (err) {
    // console.log(err);
  }
});

function redirectToBatchWiseStudents(id) {
  document.getElementById("frm_batchId").value = id;
  document.getElementById("go_to_BatchWiseStudents").submit();
}
