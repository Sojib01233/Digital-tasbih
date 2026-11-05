const STORAGE_KEY = "digitalTasbihData";

const totalEl = document.getElementById("totalCount");
const sessionEl = document.getElementById("sessionCount");

const countButton = document.getElementById("countButton");
const resetButton = document.getElementById("resetButton");

const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");

const noteEl = document.getElementById("counterNote");
const toastEl = document.getElementById("toast");

let data = loadData();
let toastTimer;


// LOAD SAVED DATA

function loadData() {

    try {

        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (
            saved &&
            Number.isFinite(saved.total) &&
            Number.isFinite(saved.session)
        ) {

            return {
                total: Math.max(0, Math.floor(saved.total)),
                session: Math.max(0, Math.floor(saved.session))
            };

        }

    } catch (error) {

        console.error(error);

    }

    return {
        total: 0,
        session: 0
    };

}


// SAVE DATA

function saveData() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {

        showToast("ডেটা সংরক্ষণ করা যায়নি");

    }

}


// UPDATE DISPLAY

function render() {

    totalEl.textContent =
        data.total.toLocaleString("en-US");

    sessionEl.textContent =
        data.session.toLocaleString("en-US");

}


// INCREASE COUNTER

function incrementCount() {

    data.total++;
    data.session++;

    saveData();
    render();

    countButton.classList.add("pressed");

    setTimeout(() => {

        countButton.classList.remove("pressed");

    }, 120);

    noteEl.textContent =
        "মাশাআল্লাহ! চালিয়ে যান।";

}


// RESET SESSION

function resetSession() {

    if (data.session === 0) {

        showToast("বর্তমান সেশনে কোনো কাউন্ট নেই");

        return;

    }

    const confirmed = confirm(
        `বর্তমান সেশনের ${data.session} বার কাউন্ট রিসেট করবেন?
        সর্বমোট কাউন্ট অপরিবর্তিত থাকবে।`
    );

    if (!confirmed) return;

    data.session = 0;

    saveData();
    render();

    noteEl.textContent =
        "নতুন সেশন শুরু করুন।";

    showToast("বর্তমান সেশন রিসেট হয়েছে");

}


// SHOW MESSAGE

function showToast(message) {

    toastEl.textContent = message;

    toastEl.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toastEl.classList.remove("show");

    }, 2300);

}


// LIVE CLOCK

function updateClock() {

    const now = new Date();

    clockEl.textContent =
        now.toLocaleTimeString("en-GB");

    dateEl.textContent =
        now.toLocaleDateString("bn-BD", {

            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"

        });

}


// BUTTON EVENTS

countButton.addEventListener(
    "click",
    incrementCount
);

resetButton.addEventListener(
    "click",
    resetSession
);


// INITIALIZE APP

render();

updateClock();

setInterval(updateClock, 1000);
