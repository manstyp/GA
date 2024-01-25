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
