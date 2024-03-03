window.bcrypt = dcodeIO.bcrypt;

// Selecting elements
const form = document.getElementById("form"); // Select the form element
const usernameElement = document.querySelector("#username");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("pwd");
const warningElement = document.getElementById("warning");

// Regular expressions
const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}$");

form.addEventListener("submit", function validate(event) {
  // Prevent form submission
  event.preventDefault();
  //variables
  const email = emailElement.value.trim();
  const password = passwordElement.value.trim();
  const username = usernameElement.value.trim();
  // Validation
  if (!username) {
    warningElement.innerText = "Username can't be empty";
  } else if (!emailRegex.test(email)) {
    warningElement.innerText = "Please enter a valid email id.";
  } else if (!passwordRegex.test(password)) {
    warningElement.innerText =
      "Password should be at least 6 characters with at least one lowercase, one uppercase letter, and numbers.";
  } else {
    warningElement.innerText = "";
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt.toString());
    let user = {
      username: username,
      email: email,
      password: hashPassword,
    };
    const keys = Object.keys(localStorage);
    let isUserExists = false;
    for (let i in keys) {
      let storedItem = localStorage.getItem(keys[i]);
      if (storedItem) {
        let items = JSON.parse(storedItem);
        if (items.username === username) {
          isUserExists = true;
          warningElement.innerText = "User already exists";
          warningElement.style.color = "red"; // Set style using style property
          break;
        }
      }
    }
    if (!isUserExists) {
      localStorage.setItem(`user-${user.username}`, JSON.stringify(user));
      const $success = document.getElementById("successful");
      $success.style.display = "block";
      const registrationSuccess = document.getElementById("registrationsuccess");
      registrationSuccess.addEventListener("click", () => {
        $success.style.display = "none"; // Set style to none
        console.log(user);
      });
      // Clear input fields
      document.getElementById("form").reset();
    }
  }
});
