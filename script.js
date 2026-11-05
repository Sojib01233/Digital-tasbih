const STORAGE_KEY = "digitalTasbihData";

const totalEl = document.getElementById("totalCount");
const sessionEl = document.getElementById("sessionCount");
const countButton = document.getElementById("countButton");
const resetButton = document.getElementById("resetButton");
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");
const noteEl = document.getElementById("counterNote");
const toastEl = document.getElementById("toast");
const celebrationModal = document.getElementById("celebrationModal");
const continueButton = document.getElementById("continueButton");
const milestoneCountEl = document.getElementById("milestoneCount");

let data = loadData();
let toastTimer;

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Number.isFinite(saved.total) && Number.isFinite(saved.session)) {
      return {
        total: Math.max(0, Math.floor(saved.total)),
        session: Math.max(0, Math.floor(saved.session))
      };
    }
  } catch (error) {
    console.warn("Could not read saved tasbih data:", error);
  }
  return { total: 0, session: 0 };
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    showToast("ডেটা সংরক্ষণ করা যায়নি");
  }
}

function render() {
  totalEl.textContent = data.total.toLocaleString("en-US");
  sessionEl.textContent = data.session.toLocaleString("en-US");
}

function incrementCount() {
  data.total += 1;
  data.session += 1;
  saveData();
  render();

  countButton.classList.add("pressed");
  window.setTimeout(() => countButton.classList.remove("pressed"), 120);

  noteEl.textContent = "মাশাআল্লাহ! চালিয়ে যান।";

  // Celebrate at every 100-count milestone in the current session.
  if (data.session > 0 && data.session % 100 === 0) {
    milestoneCountEl.textContent = data.session.toLocaleString("en-US");
    celebrationModal.classList.add("show");
    continueButton.focus();
  }
}

function resetSession() {
  if (data.session === 0) {
    showToast("বর্তমান সেশনে কোনো কাউন্ট নেই");
    return;
  }

  const confirmed = window.confirm(
    `বর্তমান সেশনের ${data.session.toLocaleString("en-US")} বার কাউন্ট রিসেট করবেন?\nসর্বমোট কাউন্ট অপরিবর্তিত থাকবে।`
  );

  if (!confirmed) return;

  data.session = 0;
  saveData();
  render();
  noteEl.textContent = "নতুন সেশন শুরু করুন।";
  showToast("বর্তমান সেশন রিসেট হয়েছে");
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2300);
}

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  dateEl.textContent = now.toLocaleDateString("bn-BD", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  });
}

function closeCelebration() {
  celebrationModal.classList.remove("show");
}

countButton.addEventListener("click", incrementCount);
resetButton.addEventListener("click", resetSession);
continueButton.addEventListener("click", closeCelebration);

celebrationModal.addEventListener("click", (event) => {
  if (event.target === celebrationModal) closeCelebration();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && celebrationModal.classList.contains("show")) {
    closeCelebration();
  }
});

render();
updateClock();
setInterval(updateClock, 1000);
