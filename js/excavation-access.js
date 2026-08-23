(function () {
  "use strict";

  var loginForm = document.querySelector("[data-excavation-login]");
  var accessCard = document.querySelector("[data-excavation-access]");
  var requestForm = document.querySelector("[data-excavation-request]");
  var error = document.querySelector("[data-access-error]");

  if (!loginForm || !accessCard || !requestForm) return;

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var username = loginForm.querySelector("[name='government_username']");
    var password = loginForm.querySelector("[name='government_password']");
    var allowed = username && password && username.value.trim() && password.value.trim();

    if (!allowed) {
      if (error) error.hidden = false;
      if (username && !username.value.trim()) username.focus();
      else if (password) password.focus();
      return;
    }

    if (error) error.hidden = true;
    accessCard.hidden = true;
    requestForm.hidden = false;
    requestForm.scrollIntoView({ behavior: "smooth", block: "start" });
    var firstField = requestForm.querySelector("select, input, textarea");
    if (firstField) window.setTimeout(function () { firstField.focus(); }, 260);
  });
})();
