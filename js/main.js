(function () {
  "use strict";
  var maxMaterialRows = 20;
  var steps = Array.prototype.slice.call(document.querySelectorAll("[data-step]"));
  var stepButtons = Array.prototype.slice.call(document.querySelectorAll("[data-step-target]"));
  var currentStep = document.querySelector("[data-current-step]");
  var progress = document.querySelector("[data-step-progress]");
  function showStep(stepNumber) {
    steps.forEach(function (step) { var active = Number(step.getAttribute("data-step")) === stepNumber; step.hidden = !active; step.classList.toggle("is-visible", active); });
    stepButtons.forEach(function (button) { var active = Number(button.getAttribute("data-step-target")) === stepNumber; button.classList.toggle("is-active", active); if (active) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current"); });
    if (currentStep) currentStep.textContent = String(stepNumber).padStart(2, "0");
    if (progress) progress.style.width = ((stepNumber - 1) / 2 * 100) + "%";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelectorAll("[data-next-step]").forEach(function (button) { button.addEventListener("click", function () { showStep(Number(button.getAttribute("data-next-step"))); }); });
  document.querySelectorAll("[data-prev-step]").forEach(function (button) { button.addEventListener("click", function () { showStep(Number(button.getAttribute("data-prev-step"))); }); });
  stepButtons.forEach(function (button) { button.addEventListener("click", function () { showStep(Number(button.getAttribute("data-step-target"))); }); });
  function materialRow(index) { return '<tr data-material-row><td data-label="المادة"><input class="field-input" type="text" name="materials[' + index + '][material]"></td><td data-label="الكمية (الوحدة)"><select class="field-input" name="materials[' + index + '][unit]"><option value="" selected disabled>اختر الوحدة</option><option value="ton">طن</option><option value="cubic_meter">م³</option><option value="kilogram">كغ</option><option value="board">لوح</option><option value="other">غير ذلك</option></select></td><td data-label="العدد"><input class="field-input mono" type="number" min="0" step="0.01" name="materials[' + index + '][count]"></td><td data-label="ملاحظات"><input class="field-input" type="text" name="materials[' + index + '][notes]"></td><td data-label="حذف"><button class="repeater-remove" type="button" data-remove-material aria-label="حذف صف المادة">×</button></td></tr>'; }
  function updateRows() { var rows = document.querySelectorAll("[data-materials-rows] [data-material-row]"), addButton = document.querySelector("[data-add-material]"), empty = document.querySelector("[data-materials-empty]"); rows.forEach(function (row, index) { row.querySelectorAll("input,select").forEach(function (field) { var key = field.name.match(/\]\[(material|unit|count|notes)\]$/); if (key) field.name = "materials[" + index + "][" + key[1] + "]"; }); }); if (addButton) addButton.disabled = rows.length >= maxMaterialRows; if (empty) empty.hidden = rows.length > 0; }
  var addMaterial = document.querySelector("[data-add-material]"), materialRows = document.querySelector("[data-materials-rows]"); if (addMaterial && materialRows) addMaterial.addEventListener("click", function () { var count = materialRows.querySelectorAll("[data-material-row]").length; if (count < maxMaterialRows) { materialRows.insertAdjacentHTML("beforeend", materialRow(count)); updateRows(); } });
  document.addEventListener("click", function (event) { var remove = event.target.closest("[data-remove-material]"); if (!remove) return; var row = remove.closest("[data-material-row]"); if (row) row.remove(); updateRows(); });
  document.querySelectorAll("[data-file-input]").forEach(function (input) { input.addEventListener("change", function () { var caption = input.parentElement.querySelector("[data-file-caption]"); var files = Array.prototype.slice.call(input.files || []); if (caption) caption.textContent = files.length ? files.map(function (file) { return file.name; }).join("، ") : "لم يتم اختيار ملف."; }); });
  document.querySelectorAll("[data-transport-form]").forEach(function (form) { form.addEventListener("submit", function (event) { event.preventDefault(); var old = form.querySelector(".form-status"); if (old) old.remove(); var status = document.createElement("p"); status.className = "form-status"; status.setAttribute("role", "status"); status.textContent = "تم حفظ البيانات محليًا في هذه الواجهة التجريبية."; form.appendChild(status); }); });
  updateRows();
})();
