/* ================================================================
 Ms. Sujatha William — English Teacher Website
 script.js — All Interactive Behaviour
 ================================================================ */

/* ----------------------------------------------------------------
 🔧 CONTACT CONFIGURATION
 ↓↓ EDIT THESE TWO LINES WITH REAL DETAILS ↓↓
 ---------------------------------------------------------------- */
const CONFIG = {
  whatsapp : "94771234567",              // Number with country code, no + or spaces
  email    : "sujathawilliam@gmail.com", // Teacher's actual email
  name     : "Ms. Sujatha William"
};

/* ================================================================
 SECTION 1 — NAVBAR BEHAVIOUR
 ================================================================ */

const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu   = document.getElementById("navMenu");

/* Add 'scrolled' class when user scrolls past 60px */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  toggleScrollTopBtn();
  highlightActiveNavLink();
});

/* ── Hamburger toggle ── */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
});

/* Close menu when any nav link is clicked */
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

/* Close menu when clicking outside it */
document.addEventListener("click", e => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
  }
});

function closeMobileMenu() {
  hamburger.classList.remove("open");
  navMenu.classList.remove("open");
  document.body.style.overflow = "";
}

/* ── Highlight active nav link based on scroll position ── */
function highlightActiveNavLink() {
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-link");
  let currentId = "";

  sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
          currentId = sec.getAttribute("id");
      }
  });

  navLinks.forEach(link => {
      link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${currentId}`
      );
  });
}

/* ================================================================
 SECTION 2 — SCROLL TO TOP BUTTON
 ================================================================ */

const scrollTopBtn = document.getElementById("scrollTopBtn");

function toggleScrollTopBtn() {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
}

/* Called by onclick in HTML */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ================================================================
 SECTION 3 — CARD ENTRANCE ANIMATIONS
 Uses IntersectionObserver for scroll-reveal effect
 ================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const cards = document.querySelectorAll(".animate-card");

  const revealObserver = new IntersectionObserver(
      (entries) => {
          entries.forEach((entry, i) => {
              if (entry.isIntersecting) {
                  /* Staggered delay based on sibling index */
                  const delay = (entry.target.dataset.delay || 0);
                  setTimeout(() => {
                      entry.target.classList.add("visible");
                  }, delay);
                  revealObserver.unobserve(entry.target); // only animate once
              }
          });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  /* Assign staggered delays to sibling groups */
  const parents = new Map();
  cards.forEach(card => {
      const parent = card.parentElement;
      if (!parents.has(parent)) parents.set(parent, 0);
      const idx = parents.get(parent);
      card.dataset.delay = idx * 110; // 110ms between each card in a group
      parents.set(parent, idx + 1);
      revealObserver.observe(card);
  });

  console.log("✅ Website loaded — Ms. Sujatha William");
  console.log("🔧 Edit CONFIG object in script.js to update contact details.");
});

/* ================================================================
 SECTION 4 — FORM VALIDATION
 Returns true if all required fields are filled
 ================================================================ */

function validateForm() {
  const fields = [
      { id: "studentName", label: "Student Name"               },
      { id: "phone",       label: "Phone Number"               },
      { id: "grade",       label: "Grade / Level"              },
      { id: "location",    label: "Preferred Class Location"   }
  ];

  for (const field of fields) {
      const el = document.getElementById(field.id);
      if (!el.value.trim()) {
          showToast(`⚠️ Please fill in: ${field.label}`, "warning");
          el.focus();
          /* Highlight the empty field */
          el.style.borderColor = "#e53e3e";
          el.addEventListener("input", () => {
              el.style.borderColor = "";
          }, { once: true });
          return false;
      }
  }
  return true;
}

/* ================================================================
 SECTION 5 — READ FORM DATA
 ================================================================ */

function getFormData() {
  return {
      name     : document.getElementById("studentName").value.trim(),
      phone    : document.getElementById("phone").value.trim(),
      grade    : document.getElementById("grade").value,
      location : document.getElementById("location").value,
      message  : document.getElementById("message").value.trim()
  };
}

/* ================================================================
 SECTION 6 — SEND VIA WHATSAPP
 Builds a pre-filled WhatsApp message and opens wa.me link
 ================================================================ */

function sendViaWhatsApp() {
  if (!validateForm()) return;

  const d = getFormData();

  /* Build the message text */
  let msg  = `Hello ${CONFIG.name}! 👋\n\n`;
  msg     += `I would like to register for English classes.\n\n`;
  msg     += `📋 *Registration Details*\n`;
  msg     += `━━━━━━━━━━━━━━━━━━\n`;
  msg     += `👤 *Student Name :* ${d.name}\n`;
  msg     += `📞 *Phone Number :* ${d.phone}\n`;
  msg     += `🎓 *Grade / Level:* ${d.grade}\n`;
  msg     += `📍 *Preferred Class:* ${d.location}\n`;

  if (d.message) {
      msg += `\n💬 *Message:*\n${d.message}\n`;
  }

  msg += `\nThank you! 🙏`;

  /* Open WhatsApp */
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");

  showToast("✅ Opening WhatsApp with your registration details!", "success");
}

/* ================================================================
 SECTION 7 — SEND VIA EMAIL
 Opens the default email app with subject + body pre-filled
 ================================================================ */

function sendViaEmail() {
  if (!validateForm()) return;

  const d = getFormData();

  const subject = `English Class Registration — ${d.name} (${d.grade})`;

  let body  = `Hello ${CONFIG.name},\n\n`;
  body     += `I would like to register for English classes. My details are below:\n\n`;
  body     += `Registration Details\n`;
  body     += `----------------------------\n`;
  body     += `Student Name      : ${d.name}\n`;
  body     += `Phone Number      : ${d.phone}\n`;
  body     += `Grade / Level     : ${d.grade}\n`;
  body     += `Preferred Class   : ${d.location}\n`;

  if (d.message) {
      body += `\nAdditional Message:\n${d.message}\n`;
  }

  body += `\nThank you,\n${d.name}`;

  const mailtoLink =
      `mailto:${CONFIG.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;

  showToast("✅ Opening your email app with registration details!", "success");
}

/* ================================================================
 SECTION 8 — TOAST NOTIFICATION
 Displays a temporary popup message at the top of the page
 ================================================================ */

function showToast(message, type = "info") {

  /* Remove any existing toast first */
  document.querySelector(".sw-toast")?.remove();

  /* Color themes */
  const themes = {
      success : { bg: "#d4edda", color: "#155724", border: "#c3e6cb" },
      warning : { bg: "#fff3cd", color: "#856404", border: "#ffc107" },
      error   : { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
      info    : { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" }
  };
  const t = themes[type] || themes.info;

  /* Create toast element */
  const toast = document.createElement("div");
  toast.className = "sw-toast";
  toast.innerHTML = `<span>${message}</span>
                     <button aria-label="Close">✕</button>`;

  /* Apply styles inline (no extra CSS class needed) */
  Object.assign(toast.style, {
      position   : "fixed",
      top        : "20px",
      left       : "50%",
      transform  : "translateX(-50%)",
      zIndex     : "9999",
      display    : "flex",
      alignItems : "center",
      gap        : "14px",
      padding    : "14px 22px",
      borderRadius: "10px",
      fontFamily : "'Poppins', sans-serif",
      fontSize   : "0.88rem",
      fontWeight : "500",
      minWidth   : "300px",
      maxWidth   : "92vw",
      background : t.bg,
      color      : t.color,
      border     : `1px solid ${t.border}`,
      boxShadow  : "0 8px 30px rgba(0,0,0,0.18)",
      animation  : "toastIn 0.3s ease both"
  });

  /* Style close button */
  const closeBtn = toast.querySelector("button");
  Object.assign(closeBtn.style, {
      background   : "none",
      border       : "none",
      cursor       : "pointer",
      fontSize     : "0.78rem",
      color        : "inherit",
      opacity      : "0.65",
      padding      : "2px 5px",
      marginLeft   : "auto",
      flexShrink   : "0"
  });
  closeBtn.addEventListener("click", () => toast.remove());

  document.body.appendChild(toast);

  /* Auto-dismiss after 4.5 seconds */
  setTimeout(() => toast?.remove(), 4500);
}