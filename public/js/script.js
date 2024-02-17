document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.querySelector("#password");
  const eye = document.querySelector("#eye");

  eye.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eye.classList.remove("fa-eye");
      eye.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      eye.classList.remove("fa-eye-slash");
      eye.classList.add("fa-eye");
    }
  });
});

window.onload = function () {
  const usernameElement = document.querySelector("#username");
  const username = usernameElement.getAttribute("href").split("/").pop();

  if (username.length <= 6) {
    usernameElement.classList.remove("w-32");
    usernameElement.classList.add("w-24");
  } else if (username.length > 6 && username.length <= 12) {
    usernameElement.classList.remove("w-32");
    usernameElement.classList.add("w-36");
  } else if (username.length > 12) {
    usernameElement.classList.remove("w-32");
    usernameElement.classList.add("w-48");
  }
};
