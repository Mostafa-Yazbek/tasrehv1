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

/* Enhancements: machinery repeater, rubble type, centered permit success card and home confirmation. */
(function () {
  "use strict";
  var MAX_ROWS = 20;
  var pagePrefix = window.location.pathname.indexOf("/pages/") !== -1 ? "../" : "";
  if (!document.querySelector('link[data-permit-enhancements]')) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = pagePrefix + "css/permit-enhancements.css";
    css.setAttribute("data-permit-enhancements", "");
    document.head.appendChild(css);
  }

function machineryRow(index) {
  return '<tr data-machinery-row>' +

    '<td data-label="نوع الآلية">' +
      '<select class="field-input" name="machinery[' + index + '][type]">' +
        '<option value="" selected disabled>اختر نوع الآلية</option>' +
        '<option value="mixer">جبالة</option>' +
        '<option value="buger">باغير</option>' +
      '</select>' +
    '</td>' +

    '<td data-label="العدد">' +
      '<input class="field-input mono" type="number" min="1" step="1" name="machinery[' + index + '][count]">' +
    '</td>' +

    '<td data-label="ارتفاع الآلية">' +
      '<input class="field-input mono" type="number" min="0" step="0.01" name="machinery[' + index + '][height]" placeholder="متر">' +
    '</td>' +

    '<td data-label="وزن الآلية">' +
      '<input class="field-input mono" type="number" min="0" step="0.01" name="machinery[' + index + '][weight]" placeholder="كغ">' +
    '</td>' +

    '<td data-label="ملاحظات">' +
      '<input class="field-input" type="text" name="machinery[' + index + '][notes]">' +
    '</td>' +

    '<td data-label="حذف">' +
      '<button class="repeater-remove" type="button" data-remove-machinery aria-label="حذف صف الآلية">×</button>' +
    '</td>' +

  '</tr>';
}

  function updateMachineryRows() {
    var rows = document.querySelectorAll("[data-machinery-rows] [data-machinery-row]");
    var addButton = document.querySelector("[data-add-machinery]");
    var empty = document.querySelector("[data-machinery-empty]");
    rows.forEach(function (row, index) {
      row.querySelectorAll("input").forEach(function (field) {
        var key = field.name.match(/\]\[(type|count|height|weight|notes)\]$/);
        if (key) field.name = "machinery[" + index + "][" + key[1] + "]";
      });
    });
    if (addButton) addButton.disabled = rows.length >= MAX_ROWS;
    if (empty) empty.hidden = rows.length > 0;
  }

  function addMachinerySection() {
    var materialsRows = document.querySelector("[data-materials-rows]");
    if (!materialsRows || document.querySelector("[data-machinery-rows]")) return;
    var card = materialsRows.closest(".wizard-card");
    var actions = card && card.querySelector(".wizard-actions");
    if (!card || !actions) return;
    var section = document.createElement("section");
    section.className = "machinery-subsection";
    section.innerHTML = '<div class="transport-table-wrap"><table class="transport-material-table machinery-table"><thead><tr><th>نوع الآلية</th><th>العدد</th><th>ارتفاع الآلية</th><th>وزن الآلية</th><th>ملاحظات</th><th aria-label="حذف"></th></tr></thead><tbody data-machinery-rows><tr data-machinery-row><td data-label="نوع الآلية"><select class="field-input" name="machinery[0][type]"><option value="" selected disabled>اختر نوع الآلية</option><option value="mixer">جبالة</option><option value="buger">باغير</option></select></td><td data-label="العدد"><input class="field-input mono" type="number" min="1" step="1" name="machinery[0][count]"></td><td data-label="ارتفاع الآلية"><input class="field-input mono" type="number" min="0" step="0.01" name="machinery[0][height]" placeholder="متر"></td><td data-label="وزن الآلية"><input class="field-input mono" type="number" min="0" step="0.01" name="machinery[0][weight]" placeholder="كغ"></td><td data-label="ملاحظات"><input class="field-input" type="text" name="machinery[0][notes]"></td><td data-label="حذف"><button class="repeater-remove" type="button" data-remove-machinery aria-label="حذف صف الآلية">×</button></td></tr></tbody></table></div><button type="button" class="btn btn-soft btn-sm transport-add-row" data-add-machinery><span aria-hidden="true">+</span> إضافة آلية</button>';
    actions.insertAdjacentElement("beforebegin", section);
  }

  function addRubbleTypeField() {
    var grid = document.querySelector(".rubble-estimate-grid");
    if (!grid || document.getElementById("rubble_type")) return;
    var field = document.createElement("div");
    field.className = "field";
    field.innerHTML = '<label class="field-label" for="rubble_type">نوع الأنقاض</label><input id="rubble_type" name="rubble_type" class="field-input" type="text" placeholder="مثال: حجارة، إسمنت، أخشاب" />';
    grid.insertAdjacentElement("afterbegin", field);
  }

  addMachinerySection();
  addRubbleTypeField();
  updateMachineryRows();

  var addMachinery = document.querySelector("[data-add-machinery]");
  var machineryRows = document.querySelector("[data-machinery-rows]");
  if (addMachinery && machineryRows) addMachinery.addEventListener("click", function () {
    var count = machineryRows.querySelectorAll("[data-machinery-row]").length;
    if (count < MAX_ROWS) {
      machineryRows.insertAdjacentHTML("beforeend", machineryRow(count));
      updateMachineryRows();
    }
  });
  document.addEventListener("click", function (event) {
    var remove = event.target.closest("[data-remove-machinery]");
    if (!remove) return;
    var row = remove.closest("[data-machinery-row]");
    if (row) { row.remove(); updateMachineryRows(); }
  });

  function makePermitNumber() {
    var now = new Date();
    var date = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");
    return "MSR-" + date + "-" + Math.floor(1000 + Math.random() * 9000);
  }

  function permitType(form) {
    if (form.matches("[data-excavation-request]")) return "تصريح الحفر";
    return document.title.indexOf("الأنقاض") !== -1 ? "تصريح نقل الأنقاض" : "طلب تصريح نقل مواد ومعدات بناء";
  }

  function queueHomeSuccess(type) {
    var number = makePermitNumber();
    try { sessionStorage.setItem("musarrah-last-permit", JSON.stringify({ type: type, number: number })); } catch (error) {}
    window.location.assign(pagePrefix + "index.html");
  }

  document.querySelectorAll("[data-transport-form], [data-static-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var legacyStatus = form.querySelector(".form-status");
      if (legacyStatus) legacyStatus.remove();
      queueHomeSuccess(permitType(form));
    });
  });

  function showHomeSuccess() {
    var host = document.querySelector(".home-card");
    if (!host) return;
    var saved;
    try { saved = JSON.parse(sessionStorage.getItem("musarrah-last-permit") || "null"); } catch (error) { saved = null; }
    if (!saved || document.querySelector("[data-permit-success-modal]")) return;
    var modal = document.createElement("div");
    modal.className = "permit-success-modal";
    modal.setAttribute("data-permit-success-modal", "");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = '<div class="permit-success-card"><div class="permit-success-mark" aria-hidden="true">✓</div><span class="permit-success-eyebrow">تم استلام طلبك</span><h2>تم إرسال التصريح بنجاح</h2><p>سيتم مراجعة <strong>' + saved.type + '</strong> من الجهة المختصة.</p><div class="permit-number"><span>رقم التصريح</span><strong>' + saved.number + '</strong></div><button type="button" class="permit-success-close" data-close-success>إغلاق</button></div>';
    document.body.appendChild(modal);
    document.body.classList.add("permit-success-open");
    modal.querySelector("[data-close-success]").addEventListener("click", function () {
      modal.remove();
      document.body.classList.remove("permit-success-open");
      try { sessionStorage.removeItem("musarrah-last-permit"); } catch (error) {}
    });
  }
  showHomeSuccess();
})();
/* ========================================================
   Rubble Cost Calculation
   1 KG = 70 SYP
   ======================================================== */
(function () {
  "use strict";

  var PRICE_PER_KG = 70;

  function formatCurrency(value) {
    return Number(value).toLocaleString("ar-SY") + " ل.س";
  }

  function calculateRubbleCost() {
    var rows = document.querySelectorAll(
      "[data-rubble-rows] [data-rubble-row]"
    );

    var total = 0;

    rows.forEach(function (row) {
      var quantityInput = row.querySelector(".rubble-quantity");
      var costInput = row.querySelector(".rubble-cost");
      var hiddenCost = row.querySelector(
        'input[type="hidden"][name$="[cost]"]'
      );

      var quantity = parseFloat(quantityInput ? quantityInput.value : 0) || 0;

      var cost = quantity * PRICE_PER_KG;

      total += cost;

      if (costInput) {
        costInput.value = formatCurrency(cost);
      }

      if (hiddenCost) {
        hiddenCost.value = cost;
      }
    });

    var totalElement = document.querySelector("[data-rubble-total-cost]");

    if (totalElement) {
      totalElement.textContent = formatCurrency(total);
    }
  }

  document.addEventListener("input", function (event) {
    if (event.target.matches(".rubble-quantity")) {
      calculateRubbleCost();
    }
  });

  document.addEventListener("click", function (event) {
    if (
      event.target.closest("[data-add-rubble]") ||
      event.target.closest("[data-remove-rubble]")
    ) {
      setTimeout(calculateRubbleCost, 0);
    }
  });

  calculateRubbleCost();

})();