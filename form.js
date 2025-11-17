// global array to keep track of submit-time errors
const form_errors = [];

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const commentsInput = document.getElementById("comments");
  const errorOut = document.getElementById("form-error");
  const infoOut = document.getElementById("form-info");
  const hiddenErrors = document.getElementById("form-errors");

  // HELPER FUNCTIONS

  function clearMessages() {
    errorOut.textContent = "";
    infoOut.textContent = "";
  }

  function getErrorMessage(field) {
    const v = field.validity;

    if (v.valueMissing) return "This field is required!!";

    if (v.tooShort) return `Please enter at least ${field.minLength} characters!!`;

    if (v.tooLong) return `Please use at most ${field.maxLength} characters!!`;

    if (v.typeMismatch && field.type === "email") return "Please enter a valid email address!!";
    
    if (v.patternMismatch) return "Please use only allowed characters!!";

    return "Invalid value!!";
  }

  // ILLEGAL CHARS IN NAME

  if (nameInput) {
    const allowed = /^[A-Za-zÀ-ÿ'\- ]*$/; // pattern from HTML, but * allows empty
    let lastValid = nameInput.value;
    let tempMsgTimeout = null;

    nameInput.addEventListener("input", function () {
      const value = nameInput.value;

      if (!allowed.test(value)) {
        nameInput.classList.add("field-flash");
        setTimeout(() => nameInput.classList.remove("field-flash"), 300);
        errorOut.textContent =
          "Name: only letters, spaces, hyphens, and apostrophes are allowed.";

        if (tempMsgTimeout) clearTimeout(tempMsgTimeout);
        tempMsgTimeout = setTimeout(function () {
          if (errorOut.textContent.startsWith("Name:")) {
            errorOut.textContent = "";
          }
        }, 1500);

        nameInput.value = lastValid;
      } 
      else {
        lastValid = value;
      }
    });
  }

  // TEXTAREA COUNTER

  if (commentsInput) {
    const max = commentsInput.maxLength > 0 ? commentsInput.maxLength : 500;

    const counter = document.createElement("p");
    counter.className = "char-counter";
    commentsInput.insertAdjacentElement("afterend", counter);

    function updateCounter() {
      const remaining = max - commentsInput.value.length;
      counter.textContent = remaining + " characters remaining";

      // near the limit warnign!
      if (remaining <= 50 && remaining >= 0) {
        counter.classList.add("warning");
      } 
      else {
        counter.classList.remove("warning");
      }

      // over the limit error
      if (remaining < 0) {
        commentsInput.setCustomValidity(
          "Your message is too long. Please shorten it."
        );
        errorOut.textContent = "Comments are too long.";
      } 
      else {
        if (commentsInput.validity.customError) {
          commentsInput.setCustomValidity("");
        }
        if (errorOut.textContent === "Comments are too long.") {
          errorOut.textContent = "";
        }
      }
    }

    commentsInput.addEventListener("input", updateCounter);
    updateCounter();
  }

  // CLEAR MESSAGE WHEN USER TYPES

  [nameInput, emailInput, commentsInput].forEach(function (field) {
    if (!field) return;
    field.addEventListener("input", function () {
      field.setCustomValidity("");
    });
  });

  // SUBMIT HANDLER: use Constraint Validation API + form_errors

  form.addEventListener("submit", function (event) {
    clearMessages();
    let hasErrors = false;

    const fields = [nameInput, emailInput, commentsInput];

    fields.forEach(function (field) {
      if (!field) return;

      field.setCustomValidity("");

      if (!field.checkValidity()) {
        const msg = getErrorMessage(field);
        field.setCustomValidity(msg);

        form_errors.push({
          field: field.name,
          value: field.value,
          message: msg,
          time: new Date().toISOString()
        });

        hasErrors = true;
      }
    });

    if (hasErrors) {
      event.preventDefault();
      errorOut.textContent = "Please fix the highlighted fields before submitting.";

      const firstInvalid = fields.find(function (f) {
        return f && !f.checkValidity();
      });
      if (firstInvalid && firstInvalid.reportValidity) {
        firstInvalid.reportValidity();
      }
      return;
    }

    if (hiddenErrors) {
      hiddenErrors.value = JSON.stringify(form_errors);
    }

    infoOut.textContent = "Form looks good, sending.";
  });
});
