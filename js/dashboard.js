(function () {
  "use strict";

  var user;
  try {
    user = JSON.parse(
      sessionStorage.getItem("musarrah-dashboard-user") || "null"
    );
  } catch (e) {
    user = null;
  }
  if (!user) {
    window.location.replace("login.html");
    return;
  }
  var userEl = document.querySelector("[data-dash-username]");
  if (userEl) userEl.textContent = user.name;
  var logoutBtn = document.querySelector("[data-dash-logout]");
  if (logoutBtn)
    logoutBtn.addEventListener("click", function () {
      try {
        sessionStorage.removeItem("musarrah-dashboard-user");
      } catch (e) {}
      window.location.replace("login.html");
    });

  var damascusCenter = [33.5138, 36.2765];

  var locations = {
    bab_touma: { name: "باب توما", lat: 33.513, lng: 36.312 },
    muhajirin: { name: "المهاجرين", lat: 33.523, lng: 36.283 },
    mazzeh: { name: "المزة", lat: 33.505, lng: 36.24 },
    kafarsouseh: { name: "كفرسوسة", lat: 33.5, lng: 36.265 },
    shaalan: { name: "الشعلان", lat: 33.5175, lng: 36.286 },
    qassaa: { name: "القصاع", lat: 33.518, lng: 36.305 },
    malki: { name: "المالكي", lat: 33.521, lng: 36.278 },
    abu_rumaneh: { name: "أبو رمانة", lat: 33.5185, lng: 36.271 },
    midan: { name: "الميدان", lat: 33.496, lng: 36.3 },
    jobar: { name: "جوبر", lat: 33.524, lng: 36.331 },
    barzeh: { name: "برزة", lat: 33.547, lng: 36.308 },
    dummar: { name: "دمّر", lat: 33.531, lng: 36.23 },
    rukn_deen: { name: "ركن الدين", lat: 33.533, lng: 36.292 },
    sarouja: { name: "الصالحية", lat: 33.52, lng: 36.295 },
    hameh: { name: "الهامة", lat: 33.556, lng: 36.213 },
    qudsaya: { name: "قدسيا", lat: 33.548, lng: 36.198 },
    daraya: { name: "داريا", lat: 33.458, lng: 36.235 },
    jaramana: { name: "جرمانا", lat: 33.483, lng: 36.335 },
  };

  function fetchRoute(originLoc, destLoc, callback) {
    var url =
      "https://router.project-osrm.org/route/v1/driving/" +
      originLoc.lng +
      "," +
      originLoc.lat +
      ";" +
      destLoc.lng +
      "," +
      destLoc.lat +
      "?overview=full&geometries=geojson";

    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          var coords = data.routes[0].geometry.coordinates.map(function (c) {
            return [c[1], c[0]];
          });
          callback(coords, data.routes[0]);
        } else {
          callback(
            [
              [originLoc.lat, originLoc.lng],
              [destLoc.lat, destLoc.lng],
            ],
            null
          );
        }
      })
      .catch(function () {
        callback(
          [
            [originLoc.lat, originLoc.lng],
            [destLoc.lat, destLoc.lng],
          ],
          null
        );
      });
  }

  var now = Date.now();
  var HOUR = 3600000;
  var DAY = 86400000;

  function hoursAgo(h) {
    return new Date(now - h * HOUR);
  }
  function daysAgo(d) {
    return new Date(now - d * DAY);
  }

  function formatDate(date) {
    var d = new Date(date);
    return (
      d.getFullYear() +
      "/" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(d.getDate()).padStart(2, "0") +
      " — " +
      String(d.getHours()).padStart(2, "0") +
      ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  }

  var typeLabels = {
    transport: "نقل مواد ومعدات بناء",
    rubble: "نقل أنقاض",
    excavation: "حفر",
  };

  var stageLabels = {
    review: "مراجعة الطلب",
    technical: "فحص فني",
    approval: "بانتظار الموافقة",
    scheduling: "جدولة الموعد",
    field: "معاينة ميدانية",
  };

  var permits = [
    {
      id: 1,
      number: "MSR-20260824-1001",
      type: "transport",
      status: "granted",
      applicant: "أحمد ناصر الدين",
      phone: "0944123456",
      grantedAt: hoursAgo(2),
      expiresAt: hoursAgo(-22),
      origin: "mazzeh",
      destination: "kafarsouseh",
      currentPos: "kafarsouseh",
      driver: "سامر عبد الرحمن",
      vehicleNumber: "دمشق 456321",
      materials: "حديد تسليح – 12 طن",
      licenseType: "رخصة بناء",
    },
    {
      id: 2,
      number: "MSR-20260824-1002",
      type: "rubble",
      status: "granted",
      applicant: "شركة الإعمار الحديثة",
      phone: "0933987654",
      grantedAt: hoursAgo(5),
      expiresAt: hoursAgo(-19),
      origin: "jobar",
      destination: "daraya",
      currentPos: "midan",
      driver: "خالد محمود",
      vehicleNumber: "دمشق 789012",
      estimatedWeight: "8 طن",
      rubbleType: "إسمنت وحجارة",
    },
    {
      id: 3,
      number: "MSR-20260824-1003",
      type: "transport",
      status: "granted",
      applicant: "محمد عيسى البستاني",
      phone: "0955111222",
      grantedAt: hoursAgo(8),
      expiresAt: hoursAgo(-16),
      origin: "dummar",
      destination: "barzeh",
      currentPos: "rukn_deen",
      driver: "فراس الحلبي",
      vehicleNumber: "ريف دمشق 334455",
      materials: "بلوك إسمنتي – 2000 قطعة",
      licenseType: "رخصة ترميم",
    },
    {
      id: 5,
      number: "MSR-20260822-1005",
      type: "transport",
      status: "granted",
      applicant: "علي حسن سلطان",
      phone: "0944556677",
      grantedAt: daysAgo(2),
      expiresAt: daysAgo(1),
      origin: "shaalan",
      destination: "qassaa",
      currentPos: "qassaa",
      driver: "باسم الخطيب",
      vehicleNumber: "دمشق 112233",
      materials: "رمل ناعم – 6 م³",
      licenseType: "رخصة بناء",
    },
    {
      id: 6,
      number: "MSR-20260821-1006",
      type: "rubble",
      status: "granted",
      applicant: "مكتب الهندسة المعمارية",
      phone: "0933445566",
      grantedAt: daysAgo(3),
      expiresAt: daysAgo(2),
      origin: "bab_touma",
      destination: "daraya",
      currentPos: "daraya",
      driver: "نزار قباني",
      vehicleNumber: "دمشق 667788",
      estimatedWeight: "15 طن",
      rubbleType: "أخشاب وحديد",
    },
    {
      id: 8,
      number: "MSR-20260824-2001",
      type: "transport",
      status: "progress",
      applicant: "كمال الدين الأتاسي",
      phone: "0944332211",
      submittedAt: hoursAgo(3),
      stage: "review",
      origin: "muhajirin",
      destination: "midan",
      materials: "إسمنت بورتلاندي – 20 طن",
      licenseType: "رخصة بناء",
    },
    {
      id: 9,
      number: "MSR-20260824-2002",
      type: "rubble",
      status: "progress",
      applicant: "عمر المختار للمقاولات",
      phone: "0933776655",
      submittedAt: hoursAgo(6),
      stage: "technical",
      origin: "jaramana",
      destination: "daraya",
      estimatedWeight: "22 طن",
      rubbleType: "إسمنت وبلاط",
    },
    {
      id: 10,
      number: "MSR-20260823-2003",
      type: "excavation",
      status: "progress",
      applicant: "شركة المياه",
      phone: "0112345678",
      submittedAt: daysAgo(1),
      stage: "approval",
      origin: "sarouja",
      destination: "sarouja",
      excavationLocation: "الصالحية — شارع الفردوس",
      reason: "تمديد شبكة مياه جديدة",
      dimensions: "الطول: 45م، العرض: 1.5م، العمق: 2م",
    },
    {
      id: 11,
      number: "MSR-20260823-2004",
      type: "excavation",
      status: "progress",
      applicant: "شركة الكهرباء",
      phone: "0118765432",
      submittedAt: daysAgo(1),
      stage: "field",
      origin: "barzeh",
      destination: "barzeh",
      excavationLocation: "برزة — تقاطع الرئيسي",
      reason: "إصلاح كابل كهربائي",
      dimensions: "الطول: 12م، العرض: 1م، العمق: 1.5م",
    },
    {
      id: 12,
      number: "MSR-20260822-2005",
      type: "transport",
      status: "progress",
      applicant: "ياسر عبد القادر",
      phone: "0955667788",
      submittedAt: daysAgo(2),
      stage: "scheduling",
      origin: "qudsaya",
      destination: "dummar",
      materials: "ألواح خشبية – 200 لوح",
      licenseType: "رخصة ترميم",
    },
    {
      id: 14,
      number: "MSR-20260823-3001",
      type: "transport",
      status: "rejected",
      applicant: "فادي الشيخ",
      phone: "0944111222",
      submittedAt: daysAgo(1),
      rejectedAt: hoursAgo(18),
      origin: "hameh",
      destination: "shaalan",
      reason: "الرخصة المرفقة منتهية الصلاحية. يرجى تجديد الرخصة وإعادة تقديم الطلب.",
      materials: "طوب أحمر – 5000 قطعة",
      licenseType: "رخصة بناء",
    },
    {
      id: 15,
      number: "MSR-20260822-3002",
      type: "rubble",
      status: "rejected",
      applicant: "مؤسسة البنيان المتين",
      phone: "0933222333",
      submittedAt: daysAgo(2),
      rejectedAt: daysAgo(1),
      origin: "jobar",
      destination: "daraya",
      reason: "المكب المحدد لا يستقبل هذا النوع من الأنقاض. يرجى اختيار مكب آخر.",
      estimatedWeight: "30 طن",
      rubbleType: "مواد كيميائية وأسبستوس",
    },
    {
      id: 16,
      number: "MSR-20260821-3003",
      type: "excavation",
      status: "rejected",
      applicant: "شركة الهاتف",
      phone: "0112223344",
      submittedAt: daysAgo(3),
      rejectedAt: daysAgo(2),
      origin: "malki",
      destination: "malki",
      reason: "منطقة الحفر المطلوبة تقع ضمن شارع رئيسي ولا يمكن إغلاقه حالياً.",
      excavationLocation: "المالكي — شارع أبو الفداء",
      dimensions: "الطول: 80م، العرض: 2م، العمق: 1.8م",
    },
    {
      id: 17,
      number: "MSR-20260820-3004",
      type: "transport",
      status: "rejected",
      applicant: "رامي سعيد",
      phone: "0955334455",
      submittedAt: daysAgo(4),
      rejectedAt: daysAgo(3),
      origin: "kafarsouseh",
      destination: "bab_touma",
      reason: "بيانات السائق غير مكتملة. يرجى إرفاق صورة الهوية الشخصية.",
      materials: "أنابيب PVC — 500 متر",
      licenseType: "رخصة بناء",
    },
  ];

  permits.forEach(function (p) {
    if (p.status === "granted") {
      p.subStatus =
        p.expiresAt && new Date(p.expiresAt) > new Date(now)
          ? "active"
          : "expired";
    }
  });

  function setStatEl(key, val) {
    var el = document.querySelector('[data-stat="' + key + '"]');
    if (el) el.textContent = String(val);
  }

  function initStatsCounters() {
    var total = permits.length;
    var granted = permits.filter(function (p) {
      return p.status === "granted";
    }).length;
    var active = permits.filter(function (p) {
      return p.subStatus === "active";
    }).length;
    var progress = permits.filter(function (p) {
      return p.status === "progress";
    }).length;
    var rejected = permits.filter(function (p) {
      return p.status === "rejected";
    }).length;

    setStatEl("total", total);
    setStatEl("granted", granted);
    setStatEl("active", active);
    setStatEl("progress", progress);
    setStatEl("rejected", rejected);
  }

  var listEl = document.querySelector("[data-permits-list]");
  var emptyEl = document.querySelector("[data-permits-empty]");
  var countEl = document.querySelector("[data-permits-count]");

  function statusBadge(p) {
    if (p.status === "granted") {
      if (p.subStatus === "active")
        return '<span class="status-badge status-active">فعّال</span>';
      return '<span class="status-badge status-expired">منتهي</span>';
    }
    if (p.status === "progress")
      return '<span class="status-badge status-progress">قيد الإنجاز</span>';
    return '<span class="status-badge status-rejected">مرفوض</span>';
  }

  function renderPermits(list) {
    if (!listEl) return;
    if (list.length === 0) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (countEl) countEl.textContent = "0";
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (countEl) countEl.textContent = String(list.length);

    listEl.innerHTML = list
      .map(function (p) {
        return (
          '<div class="permit-row" data-permit-id="' +
          p.id +
          '">' +
          '<div class="permit-row-body">' +
          '<div class="permit-row-sub">' +
          '<span class="permit-row-number">' +
          p.number +
          "</span>" +
          statusBadge(p) +
          "</div>" +
          '<div class="permit-row-title">' +
          typeLabels[p.type] +
          "</div>" +
          '<div class="permit-row-meta">' +
          "مقدم الطلب: " +
          p.applicant +
          "</div>" +
          "</div>" +
          '<div class="permit-row-actions">' +
          '<button type="button" class="btn-card-action btn-action-primary" data-action="view" data-id="' +
          p.id +
          '">عرض التفاصيل</button>' +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  var filterStatus = document.querySelector('[data-filter="status"]');
  var filterType = document.querySelector('[data-filter="type"]');
  var filterSearch = document.querySelector('[data-filter="search"]');
  var resetBtn = document.querySelector("[data-filters-reset]");

  var activeStatusFilter = "all";

  function updateActiveStatCard(statusValue) {
    document.querySelectorAll(".stat-item").forEach(function (card) {
      var cardTarget = card.getAttribute("data-target-status");
      if (cardTarget === statusValue) {
        card.classList.add("stat-active-selected");
      } else {
        card.classList.remove("stat-active-selected");
      }
    });
  }

  function applyFilters() {
    var type = filterType ? filterType.value : "all";
    var search = filterSearch ? filterSearch.value.trim().toLowerCase() : "";

    updateActiveStatCard(activeStatusFilter);

    if (filterStatus) {
      filterStatus.value = activeStatusFilter;
    }

    var filtered = permits.filter(function (p) {
      // فلترة الحالة
      if (activeStatusFilter !== "all") {
        if (activeStatusFilter === "granted" && p.status !== "granted") return false;
        if (activeStatusFilter === "active" && p.subStatus !== "active") return false;
        if (activeStatusFilter === "expired" && p.subStatus !== "expired") return false;
        if (activeStatusFilter === "progress" && p.status !== "progress") return false;
        if (activeStatusFilter === "rejected" && p.status !== "rejected") return false;
      }

      // فلترة نوع التصريح
      if (type !== "all" && p.type !== type) return false;

      // فلترة البحث
      if (search) {
        var haystack = (
          p.number +
          " " +
          p.applicant +
          " " +
          (p.driver || "") +
          " " +
          (p.vehicleNumber || "")
        ).toLowerCase();
        if (haystack.indexOf(search) === -1) return false;
      }
      return true;
    });

    renderPermits(filtered);
  }

  // ربط بطاقات الإحصائيات بالضغط المباشر
  document.querySelectorAll(".stat-item[data-target-status]").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function () {
      activeStatusFilter = this.getAttribute("data-target-status") || "all";
      applyFilters();
    });
  });

  if (filterStatus) {
    filterStatus.addEventListener("change", function () {
      activeStatusFilter = this.value;
      applyFilters();
    });
  }

  if (filterType) filterType.addEventListener("change", applyFilters);
  if (filterSearch) filterSearch.addEventListener("input", applyFilters);
  
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      activeStatusFilter = "all";
      if (filterType) filterType.value = "all";
      if (filterSearch) filterSearch.value = "";
      applyFilters();
    });
  }

  /* Modal Details & Leaflet */
  var modal = document.querySelector("[data-permit-modal]");
  var modalTitle = document.querySelector("[data-modal-title]");
  var modalDetails = document.querySelector("[data-modal-details]");
  var mapSection = document.querySelector("[data-map-section]");
  var mapContainer = document.getElementById("permit-map");
  var leafletMap = null;

  function detailRow(label, value, wide) {
    if (!value) return "";
    return (
      '<div class="detail-item' +
      (wide ? " detail-wide" : "") +
      '"><span class="detail-label">' +
      label +
      '</span><span class="detail-value">' +
      value +
      "</span></div>"
    );
  }
  function detailRowMono(label, value) {
    if (!value) return "";
    return (
      '<div class="detail-item"><span class="detail-label">' +
      label +
      '</span><span class="detail-value mono">' +
      value +
      "</span></div>"
    );
  }

  function openPermit(id) {
    var p = null;
    for (var i = 0; i < permits.length; i++) {
      if (permits[i].id === id) {
        p = permits[i];
        break;
      }
    }
    if (!p || !modal) return;

    if (modalTitle)
      modalTitle.textContent = typeLabels[p.type] + " — " + p.number;

    var html = "";
    html += detailRow("رقم التصريح", p.number);
    html += detailRow("نوع التصريح", typeLabels[p.type]);
    html += detailRow("مقدم الطلب", p.applicant);
    html += detailRowMono("رقم التواصل", p.phone);

    if (p.status === "granted") {
      html += detailRow(
        "حالة التصريح",
        p.subStatus === "active"
          ? '<span class="status-badge status-active">فعّال</span>'
          : '<span class="status-badge status-expired">منتهي</span>'
      );
      html += detailRow("تاريخ المنح", formatDate(p.grantedAt));
      html += detailRow("تاريخ الانتهاء", formatDate(p.expiresAt));
    } else if (p.status === "progress") {
      html += detailRow(
        "حالة التصريح",
        '<span class="status-badge status-progress">قيد الإنجاز</span>'
      );
      html += detailRow("المرحلة الحالية", stageLabels[p.stage] || p.stage);
      html += detailRow("تاريخ التقديم", formatDate(p.submittedAt));
    } else if (p.status === "rejected") {
      html += detailRow(
        "حالة التصريح",
        '<span class="status-badge status-rejected">مرفوض</span>'
      );
      html += detailRow("تاريخ التقديم", formatDate(p.submittedAt));
      html += detailRow("تاريخ الرفض", formatDate(p.rejectedAt));
      html += detailRow("سبب الرفض", p.reason, true);
    }

    if (p.type === "transport") {
      html += detailRow("نوع الرخصة", p.licenseType);
      html += detailRow("السائق", p.driver);
      html += detailRowMono("رقم المركبة", p.vehicleNumber);
      html += detailRow("المواد", p.materials, true);
      var ol = locations[p.origin];
      var dl = locations[p.destination];
      if (ol) html += detailRow("نقطة الانطلاق", ol.name);
      if (dl) html += detailRow("الوجهة", dl.name);
    } else if (p.type === "rubble") {
      html += detailRow("السائق", p.driver);
      html += detailRowMono("رقم المركبة", p.vehicleNumber);
      html += detailRow("نوع الأنقاض", p.rubbleType);
      html += detailRow("الوزن التقديري", p.estimatedWeight);
      var orl = locations[p.origin];
      var drl = locations[p.destination];
      if (orl) html += detailRow("نقطة الانطلاق", orl.name);
      if (drl) html += detailRow("الوجهة (المكب)", drl.name);
    } else if (p.type === "excavation") {
      html += detailRow("موقع الحفر", p.excavationLocation, true);
      html += detailRow("السبب", p.reason || p.excavationReason, true);
      html += detailRow("الأبعاد", p.dimensions);
    }

    if (modalDetails) modalDetails.innerHTML = html;

    var hasRoute = p.origin && locations[p.origin];
    if (hasRoute && mapSection && mapContainer) {
      mapSection.hidden = false;
      if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
      }

      setTimeout(function () {
        var ol2 = locations[p.origin];
        var dl2 = locations[p.destination] || ol2;
        var cl = locations[p.currentPos] || dl2;

        leafletMap = L.map("permit-map", { scrollWheelZoom: false }).setView(
          damascusCenter,
          13
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap",
        }).addTo(leafletMap);

        var greenIcon = L.divIcon({
          className: "map-marker-origin",
          html: '<div style="width:16px;height:16px;background:#1a7a5a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        var redIcon = L.divIcon({
          className: "map-marker-dest",
          html: '<div style="width:16px;height:16px;background:#c0392b;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        var blueIcon = L.divIcon({
          className: "map-marker-current",
          html: '<div style="width:18px;height:18px;background:#2980b9;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        L.marker([ol2.lat, ol2.lng], { icon: greenIcon })
          .addTo(leafletMap)
          .bindPopup("<b>نقطة الانطلاق</b><br>" + ol2.name);
        if (dl2 !== ol2) {
          L.marker([dl2.lat, dl2.lng], { icon: redIcon })
            .addTo(leafletMap)
            .bindPopup("<b>الوجهة</b><br>" + dl2.name);
        }

        fetchRoute(ol2, dl2, function (routeCoords, routeInfo) {
          if (!leafletMap) return;

          var routeLine = L.polyline(routeCoords, {
            color: "#083c34",
            weight: 4,
            opacity: 0.85,
            lineJoin: "round",
            lineCap: "round",
          }).addTo(leafletMap);

          if (
            p.status === "granted" &&
            p.subStatus === "active" &&
            cl &&
            routeCoords.length > 1
          ) {
            var closestIdx = 0;
            var closestDist = Infinity;
            for (var i = 0; i < routeCoords.length; i++) {
              var dx = routeCoords[i][0] - cl.lat;
              var dy = routeCoords[i][1] - cl.lng;
              var dist = dx * dx + dy * dy;
              if (dist < closestDist) {
                closestDist = dist;
                closestIdx = i;
              }
            }

            if (closestIdx > 0) {
              var traveled = routeCoords.slice(0, closestIdx + 1);
              L.polyline(traveled, {
                color: "#1a7a5a",
                weight: 5,
                opacity: 0.9,
                lineJoin: "round",
                lineCap: "round",
              }).addTo(leafletMap);
            }

            var currentLatLng = routeCoords[closestIdx] || [cl.lat, cl.lng];
            L.marker(currentLatLng, { icon: blueIcon })
              .addTo(leafletMap)
              .bindPopup("<b>الموقع الحالي</b><br>" + cl.name);
          }

          if (routeInfo) {
            var distKm = (routeInfo.distance / 1000).toFixed(1);
            var durMin = Math.round(routeInfo.duration / 60);
            routeLine.bindPopup(
              "<b>المسار</b><br>" +
                distKm +
                " كم — " +
                durMin +
                " دقيقة تقريباً"
            );
          }

          var bounds = routeLine.getBounds();
          if (p.status === "granted" && p.subStatus === "active" && cl) {
            bounds.extend([cl.lat, cl.lng]);
          }
          leafletMap.fitBounds(bounds, { padding: [40, 40] });
        });
      }, 100);
    } else {
      if (mapSection) mapSection.hidden = true;
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
    }
  }

  document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  document.addEventListener("click", function (e) {
    var row = e.target.closest("[data-permit-id]");
    if (row) openPermit(Number(row.getAttribute("data-permit-id")));
  });

  initStatsCounters();
  applyFilters();
})();