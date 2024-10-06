const app = {
  init: function () {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      document.getElementById("nav-login").style.display = "none";
      document.getElementById("nav-logout").style.display = "block";

      if (role === "LIBRARIAN") {
        librarian.showDashboard();
      } else if (role === "MEMBER") {
        member.showDashboard();
      }
    } else {
      auth.showLoginForm();
      document.getElementById("nav-login").style.display = "block";
      document.getElementById("nav-logout").style.display = "none";
    }

    document
      .getElementById("nav-login-btn")
      .addEventListener("click", auth.showLoginForm);
    document
      .getElementById("nav-logout-btn")
      .addEventListener("click", auth.logout);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  app.init();
});
