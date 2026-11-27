const screens = document.querySelectorAll(".screen");
const toasts = document.getElementById("toast");

function showScreen(id) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
  closeModal(document.getElementById("payment-modal"));
  closeModal(document.getElementById("success-modal"));
}

function showToast(message) {
  toasts.textContent = message;
  toasts.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toasts.classList.remove("show"), 2600);
}

function openModal(modal) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.screen));
});

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const isPid = button.dataset.lookup === "pid";
    document.getElementById("lookup-label").textContent = isPid ? "Property ID" : "Registered Mobile Number";
    document.getElementById("lookup-input").placeholder = isPid ? "e.g., PID-2026-8841" : "e.g., 98765 43210";
  });
});

document.querySelectorAll(".language-toggle button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".language-toggle button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showToast(button.dataset.lang === "kn" ? "ಕನ್ನಡ interface selected" : "English interface selected");
  });
});

document.getElementById("lookup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = document.getElementById("lookup-input").value.trim();
  if (!value) {
    showToast("Enter a Property ID or mobile number");
    return;
  }
  showScreen("summary");
});

document.getElementById("open-payment").addEventListener("click", () => {
  openModal(document.getElementById("payment-modal"));
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop")));
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closeModal(backdrop);
  });
});

document.querySelectorAll(".payment-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".payment-tabs button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-payment-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.paymentPanel !== button.dataset.paymentTab;
    });
  });
});

document.getElementById("simulate-payment").addEventListener("click", () => {
  closeModal(document.getElementById("payment-modal"));
  openModal(document.getElementById("success-modal"));
});

document.getElementById("pay-by-upi").addEventListener("click", () => {
  const upi = document.getElementById("upi-id").value.trim();
  if (!upi.includes("@")) {
    showToast("Enter a valid UPI ID");
    return;
  }
  closeModal(document.getElementById("payment-modal"));
  openModal(document.getElementById("success-modal"));
});

document.querySelectorAll("[data-feedback]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-feedback]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    showToast(`Feedback recorded: ${button.dataset.feedback}`);
  });
});

document.getElementById("download-pdf").addEventListener("click", () => window.print());
document.getElementById("whatsapp-receipt").addEventListener("click", () => {
  window.open("https://wa.me/?text=House%20tax%20receipt%20RCT-992041%20for%20PID-2026-8841", "_blank");
});

document.getElementById("tracker-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = document.getElementById("receipt-input").value.trim();
  const result = document.getElementById("tracker-result");
  if (!value) {
    result.className = "tracker-result show";
    result.textContent = "Enter a Receipt No. or Property ID.";
    return;
  }
  result.className = "tracker-result show";
  result.textContent = "✓ Receipt Verified — Genuine | ₹ 2,580 paid via UPI";
});

document.querySelectorAll("[data-download]").forEach((button) => {
  button.addEventListener("click", () => showToast("Receipt download prepared"));
});

const areaInput = document.getElementById("area");
const ageInput = document.getElementById("age");
function updateEstimate() {
  const area = Math.max(Number(areaInput.value) || 0, 0);
  const commercial = document.querySelector('input[name="usage"]:checked').value === "commercial";
  const age = Number(ageInput.value);
  const base = Math.round(area * (commercial ? 3 : 2));
  const cess = Math.round(base * 0.125);
  document.getElementById("base-estimate").textContent = `₹ ${base.toLocaleString("en-IN")}`;
  document.getElementById("cess-estimate").textContent = `₹ ${cess.toLocaleString("en-IN")}`;
  document.getElementById("estimate-total").textContent = `₹ ${(base + cess).toLocaleString("en-IN")}`;
  document.getElementById("age-label").textContent = `${age} years`;
}
areaInput.addEventListener("input", updateEstimate);
ageInput.addEventListener("input", updateEstimate);
document.querySelectorAll('input[name="usage"]').forEach((radio) => radio.addEventListener("change", updateEstimate));

document.getElementById("grievance-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Request submitted — Ticket GRV-2026-0042");
  event.target.reset();
});

document.getElementById("reminder-link").addEventListener("click", () => showToast("Due-date reminders enabled for this mobile number"));
document.getElementById("link-property").addEventListener("click", () => showToast("Property linking request opened"));
