// 1. EMAILJS & CONFIGURATION
(function () {
  // Replace "PUBLIC_KEY" with your actual EmailJS Public Key
  if (typeof emailjs !== "undefined") emailjs.init("PUBLIC_KEY");
})();

const WHATSAPP_NUMBER = "+2349165444494";

// 2. WHATSAPP & MODAL LOGIC
function showServiceModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById("serviceModal");
    if (!modal) return resolve(null);

    const select = modal.querySelector("#serviceSelect");
    const other = modal.querySelector("#serviceOther");
    const confirm = modal.querySelector("#serviceConfirm");
    const cancel = modal.querySelector("#serviceCancel");

    function updateOther() {
      if (select.value === "Other") other.classList.remove("hidden");
      else other.classList.add("hidden");
    }

    function cleanup() {
      select.removeEventListener("change", updateOther);
      confirm.removeEventListener("click", onConfirm);
      cancel.removeEventListener("click", onCancel);
      modal.removeEventListener("click", onOverlayClick);
      modal.classList.add("hidden");
    }

    function onConfirm() {
      const val = select.value === "Other" ? other.value.trim() : select.value;
      cleanup();
      resolve(val || null);
    }

    function onCancel() {
      cleanup();
      resolve(null);
    }

    function onOverlayClick(e) {
      if (e.target === modal) onCancel();
    }

    select.addEventListener("change", updateOther);
    confirm.addEventListener("click", onConfirm);
    cancel.addEventListener("click", onCancel);
    modal.addEventListener("click", onOverlayClick);

    updateOther();
    modal.classList.remove("hidden");
    select.focus();
  });
}

async function openWhatsApp(service = "") {
  if (!service) {
    const chosen = await showServiceModal();
    if (!chosen) return;
    service = chosen;
  }

  const normalized = String(WHATSAPP_NUMBER).replace(/\D/g, "");
  const msg = `Hello Ask For More P & Co, i am interested in ordering: *${service}* Please send availability and pricing.`;
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");

  // Send Email Notification via EmailJS
  if (typeof emailjs !== "undefined") {
    const emailParams = {
      to_name: "BeautyTouch Admin",
      message: `New booking attempt for: ${service}`,
      timestamp: new Date().toLocaleString(),
    };
    emailjs
      .send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailParams)
      .then(() => console.log("Notification Email Sent"))
      .catch((err) => console.error("Email Failed:", err));
  }
}

if (typeof window !== "undefined") window.openWhatsApp = openWhatsApp;

// 3. PRELOADER
window.addEventListener("load", () => {
  const loader = document.getElementById("preloader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }
});

// 4. MOBILE MENU TOGGLE
const menu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");
const menuBtn = document.getElementById("menuBtn");

function closeMenu() {
  if (!menu || !menuIcon) return;
  menu.classList.add("opacity-0", "-translate-y-96");
  menu.classList.remove("translate-y-0", "opacity-100");
  menuIcon.classList.replace("fa-xmark", "fa-bars");
}

function openMenu() {
  if (!menu || !menuIcon) return;
  menu.classList.remove("opacity-0", "-translate-y-96");
  menu.classList.add("translate-y-0", "opacity-100");
  menuIcon.classList.replace("fa-bars", "fa-xmark");
}

if (menuBtn) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains("translate-y-0");
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      menu &&
      menu.classList.contains("translate-y-0") &&
      !menu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

// 5. SMOOTH SCROLL & BACK TO TOP
// const btt = document.getElementById("backToTop");
// window.addEventListener("scroll", () => {
//   if (btt) {
//     if (window.pageYOffset > 300) btt.classList.add("show");
//     else btt.classList.remove("show");
//   }
// });

// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     e.preventDefault();
//     const target = document.querySelector(this.getAttribute("href"));
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth" });
//       closeMenu();
//     }
//   });
// });

const btt = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    btt.classList.add("show");
  } else {
    btt.classList.remove("show");
  }
});

btt.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// 6. TESTIMONIAL CAROUSEL
(function initTestimonialCarousel() {
  const carousel = document.getElementById("testimonialCarousel");
  if (!carousel) return;

  const slides = Array.from(carousel.children);
  let index = 0;
  let intervalId = null;

  function update() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  function next() {
    index = (index + 1) % slides.length;
    update();
  }

  function start() {
    stop();
    intervalId = setInterval(next, 4000);
  }

  function stop() {
    clearInterval(intervalId);
  }

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  carousel.style.display = "flex";
  carousel.style.transition = "transform 0.7s ease-in-out";
  slides.forEach((s) => (s.style.flex = "0 0 100%"));

  start();
})();

// 7. CERTIFICATE CAROUSEL
document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("certTrack");
  if (!track) return;

  const slides = Array.from(track.children);
  const prev = document.getElementById("certPrev");
  const next = document.getElementById("certNext");
  const dotsWrap = document.getElementById("certDots");
  let idx = 0;
  let id = null;

  function go(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = `w-3 h-3 rounded-full transition-colors ${
        i === idx ? "bg-pink-600" : "bg-gray-300"
      }`;
      b.addEventListener("click", () => {
        go(i);
        start();
      });
      dotsWrap.appendChild(b);
    });
  }

  function start() {
    stop();
    id = setInterval(() => go(idx + 1), 4000);
  }

  function stop() {
    clearInterval(id);
  }

  if (next)
    next.addEventListener("click", () => {
      go(idx + 1);
      start();
    });
  if (prev)
    prev.addEventListener("click", () => {
      go(idx - 1);
      start();
    });

  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);

  slides.forEach((s) => (s.style.flex = "0 0 100%"));
  go(0);
  start();
});

// BOOKING

// const SHEET_CSV_URL =
//   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3o6Ng5wfG0dXR9QFLXfmtIR1ADvAtxuOBdhSd3aQ-xKe5UkmIomSUeAfPzgFdSv3kNR2VCNbLPqGY/pub?output=csv";
// const CONTACT_NUMBER = "2349165444494";

// // Variables to remember user choices
// window.selectedService = "";
// window.finalSelectedDate = "";

// // 1. Function called when a service card button is clicked
// function setService(serviceName) {
//   window.selectedService = serviceName;

//   // Smooth scroll to the booking section
//   const bookingSection = document.getElementById("booking");
//   bookingSection.scrollIntoView({ behavior: "smooth" });

//   // Update the text to let the user know what they are booking for
//   const status = document.getElementById("availabilityStatus");
//   status.innerText = `Selected: ${serviceName}. Now click the box below to pick a date.`;
// }

// // 2. Fetch live dates from Google Sheets
// async function getLiveBookedDates() {
//   try {
//     const response = await fetch(`${SHEET_CSV_URL}&t=${new Date().getTime()}`);
//     const data = await response.text();
//     return data
//       .split(/\r?\n/)
//       .map((row) => row.replace(/"/g, "").trim())
//       .filter((d) => d.match(/^\d{4}-\d{2}-\d{2}$/));
//   } catch (err) {
//     console.error("Sheet Load Error:", err);
//     return [];
//   }
// }

// // 3. Initialize the Calendar Popup
// document.addEventListener("DOMContentLoaded", async function () {
//   const bookedDates = await getLiveBookedDates();
//   const btn = document.getElementById("confirmBookingBtn");
//   const status = document.getElementById("availabilityStatus");

//   flatpickr("#bookingCalendar", {
//     minDate: new Date().fp_incr(14), // 2 weeks notice
//     disable: bookedDates,
//     dateFormat: "Y-m-d",
//     inline: false, // POPUP MODE
//     static: true,
//     onChange: function (selectedDates, dateStr) {
//       window.finalSelectedDate = dateStr;

//       if (!window.selectedService) {
//         status.innerText = "Please scroll up and select a service first!";
//         status.style.color = "red";
//         return;
//       }

//       status.innerText = `✅ Date available for ${window.selectedService}!`;
//       status.style.color = "green";

//       // Unlock WhatsApp Button
//       btn.disabled = false;
//       btn.classList.remove("opacity-50", "cursor-not-allowed");
//     },
//   });
// });
// ==============================
// Ask For More P & Co – Order Logic
// ==============================

const CONTACT_NUMBER = "2349165444494";

// Store user selections
window.selectedService = "";
window.finalSelectedDate = "";

// ==============================
// 1. Set selected food item
// ==============================
function setService(serviceName) {
  window.selectedService = serviceName;

  // Scroll to date section
  const bookingSection = document.getElementById("booking");
  bookingSection.scrollIntoView({ behavior: "smooth" });

  // Update status text
  const status = document.getElementById("availabilityStatus");
  status.innerText = `Selected: Please pick a preferred date below.`;
  status.style.color = "#31245B";
}

// ==============================
// 2. Same-day order cutoff (optional)
// ==============================
function isSameDayAllowed() {
  const now = new Date();
  return now.getHours() < 18; // Orders allowed until 6pm
}

// ==============================
// 3. Initialize calendar
// ==============================
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("confirmBookingBtn");
  const status = document.getElementById("availabilityStatus");

  // Disable WhatsApp button initially
  btn.disabled = true;
  btn.classList.add("opacity-50", "cursor-not-allowed");

  flatpickr("#bookingCalendar", {
    minDate: "today",
    dateFormat: "Y-m-d",
    inline: false,
    static: true,

    onChange: function (selectedDates, dateStr) {
      if (!window.selectedService) {
        status.innerText = "Please select an item first!";
        status.style.color = "red";
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Optional same-day rule
      if (dateStr === today && !isSameDayAllowed()) {
        status.innerText =
          "Same-day orders are closed. Please select a future date.";
        status.style.color = "red";
        return;
      }

      window.finalSelectedDate = dateStr;

      status.innerText = `✅ ${window.selectedService} available on ${dateStr}`;
      status.style.color = "green";

      // Enable WhatsApp button
      btn.disabled = false;
      btn.classList.remove("opacity-50", "cursor-not-allowed");
    },
  });
});

// 4. Final WhatsApp Booking Function
function openWhatsAppWithDate() {
  if (!window.finalSelectedDate || !window.selectedService) return;

  const message = `Hello Ask For More P & Co, i am interested in ordering: *${window.selectedService}* scheduled for *${window.finalSelectedDate}*. Please confirm availability and ordering details.!`;

  const waUrl = `https://wa.me/${CONTACT_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
  window.open(waUrl, "_blank");
}
