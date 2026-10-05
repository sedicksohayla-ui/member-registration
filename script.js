// ---------- 1. Get the elements we need ----------
const form = document.getElementById("form");
const formArea = document.getElementById("formArea");
const successBox = document.getElementById("successBox");
const successEmail = document.getElementById("successEmail");

const ssnInput = document.getElementById("ssn");
const uidInput = document.getElementById("uid");
const ruleItems = document.querySelectorAll("#rules li");

const locationRadios = document.querySelectorAll("input[name='location']");
const cityBox = document.getElementById("cityBox");
const provinceBox = document.getElementById("provinceBox");


// ---------- 2. Validation rules ----------
// Each rule returns an error message, or "" if the value is OK.
const rules = {
  ssn(value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 10 && digits.length !== 12) {
      return "Enter a 10-digit SS number or 12-digit CRN.";
    }
    return "";
  },

  email(value) {
    const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    return looksValid ? "" : "Enter a valid email, like name@example.com.";
  },

  email2(value) {
    const email = document.getElementById("email").value.trim();
    return value !== "" && value === email ? "" : "Email addresses do not match.";
  },

  uid(value) {
    const looksValid = /^[A-Za-z][A-Za-z0-9_]{7,19}$/.test(value);
    return looksValid ? "" : "User ID does not meet all the rules below.";
  },

  uid2(value) {
    const uid = document.getElementById("uid").value.trim();
    return value !== "" && value === uid ? "" : "User IDs do not match.";
  },

  last(value) {
    return value ? "" : "Enter your surname.";
  },

  first(value) {
    return value ? "" : "Enter your given name.";
  },

  dob(value) {
    if (!value) return "Select your date of birth.";
    const date = new Date(value);
    if (date > new Date() || date.getFullYear() < 1900) {
      return "Enter a valid date of birth.";
    }
    return "";
  }
};


// ---------- 3. Check one field and show the result ----------
function validateField(id) {
  const input = document.getElementById(id);
  const field = input.parentElement;
  const error = rules[id](input.value.trim());

  field.classList.toggle("invalid", error !== "");
  field.classList.toggle("valid", error === "");
  field.querySelector(".message").textContent = error;

  return error === "";
}


// ---------- 4. Validate when leaving a field, and fix while typing ----------
Object.keys(rules).forEach(function (id) {
  const input = document.getElementById(id);

  input.addEventListener("blur", function () {
    validateField(id);
  });

  input.addEventListener("input", function () {
    if (input.parentElement.classList.contains("invalid")) {
      validateField(id);
    }
  });
});


// ---------- 5. SS / CRN number: digits only, add dashes ----------
ssnInput.addEventListener("input", function () {
  const d = ssnInput.value.replace(/\D/g, "").slice(0, 12);
  let parts;

  if (d.length <= 10) {
    parts = [d.slice(0, 2), d.slice(2, 9), d.slice(9)];   // 34-1234567-8
  } else {
    parts = [d.slice(0, 4), d.slice(4, 11), d.slice(11)]; // 1234-1234567-8
  }

  ssnInput.value = parts.filter(Boolean).join("-");
});


// ---------- 6. User ID checklist (ticks as you type) ----------
uidInput.addEventListener("input", function () {
  const value = uidInput.value;

  const results = {
    length: value.length >= 8 && value.length <= 20,
    letter: /^[A-Za-z]/.test(value),
    chars: value.length > 0 && /^[A-Za-z0-9_]+$/.test(value)
  };

  ruleItems.forEach(function (item) {
    item.classList.toggle("done", results[item.dataset.rule]);
  });
});


// ---------- 7. Metro Manila / Province switch ----------
function updateAddressType() {
  const isProvince = document.querySelector("input[name='location']:checked").value === "province";
  cityBox.hidden = isProvince;
  provinceBox.hidden = !isProvince;
}

locationRadios.forEach(function (radio) {
  radio.addEventListener("change", updateAddressType);
});


// ---------- 8. Submit the form ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Check every field and collect the ones with errors
  const invalidIds = Object.keys(rules).filter(function (id) {
    return !validateField(id);
  });

  // If something is wrong, stop and jump to the first problem
  if (invalidIds.length > 0) {
    document.getElementById(invalidIds[0]).focus();
    return;
  }

  // Everything is OK: show the success message
  successEmail.textContent = document.getElementById("email").value.trim();
  formArea.hidden = true;
  successBox.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ---------- 9. Clear form button ----------
form.addEventListener("reset", function () {
  setTimeout(function () {
    document.querySelectorAll(".field").forEach(function (field) {
      field.classList.remove("invalid", "valid");
      const message = field.querySelector(".message");
      if (message) message.textContent = "";
    });

    ruleItems.forEach(function (item) {
      item.classList.remove("done");
    });

    updateAddressType();
  }, 0);
});