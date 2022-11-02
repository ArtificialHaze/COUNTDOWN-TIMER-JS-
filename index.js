const eventContainer = document.querySelector(".event-container");
const formContainer = document.querySelector(".form-container");
const dayElement = document.getElementById("day");
const minuteElement = document.getElementById("minute");
const hourElement = document.getElementById("hour");
const secondElement = document.getElementById("second");
const secondTitle = document.getElementById("second__title");
const minuteTitle = document.getElementById("minute__title");
const hourTitle = document.getElementById("hour__title");
const dayTitle = document.getElementById("day__title");
const form = document.querySelector("form");

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

let countDown;

function saveToLocalStorage(title, date) {
  const event = {
    title,
    date,
  };
  localStorage.setItem("eventTracker.event", JSON.stringify(event));
}

function deleteFromLocalStorage() {
  localStorage.setItem("eventTracker.event", "[]");
}

function startCountDown(title, date) {
  const eventTitle = document.querySelector(".title");
  eventTitle.textContent = title;
  updateCountDown(date);
  countDown = setInterval(() => {
    updateCountDown(date);
  }, 1000);
}

function updateCountDown(date) {
  const currentTime = new Date().getTime();
  const countDownTime = date - currentTime;

  const newDay = Math.floor(countDownTime / day);
  const newHour = Math.floor((countDownTime % day) / hour);
  const newMinute = Math.floor((countDownTime % hour) / minute);
  const newSecond = Math.floor((countDownTime % minute) / second);

  dayTitle.textContent = newDay;
  hourTitle.textContent = newHour;
  minuteTitle.textContent = newMinute;
  secondTitle.textContent = newSecond;

  dayElement.textContent = `day${newDay === 1 ? "" : "s"}`;
  hourElement.textContent = `hour${newDay === 1 ? "" : "s"}`;
  minuteElement.textContent = `minute${newDay === 1 ? "" : "s"}`;
  secondElement.textContent = `second${newDay === 1 ? "" : "s"}`;

  if (newDay === 0 && newHour === 0 && newMinute === 0 && newSecond === 0) {
    let duration = 3 * 1000;
    let end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
    clearInterval(countDown);
    setTimeout(() => {
      showForm();
    }, 3500);
  }
}

function hideClass(element) {
  element.classList.add("hidden");
}

function removeHidden(element) {
  element.classList.remove("hidden");
}

function getLocalStorage() {
  if (
    localStorage.getItem("eventTracker.event") === "" ||
    localStorage.getItem("eventTracker.event") === "[]"
  ) {
    showForm();
  } else {
    const event = JSON.parse(localStorage.getItem("eventTracker.event"));
    showEvent(event.title, event.date);
  }
}

function showForm() {
  removeHidden(formContainer);
  hideClass(eventContainer);
  deleteFromLocalStorage();
  const title = document.querySelector("#title");
  title.focus();
}

function showEvent(title, event) {
  saveToLocalStorage(title, event);
  startCountDown(title, event);
  removeHidden(eventContainer);
  hideClass(formContainer);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title");
  const event = document.querySelector("#event");

  const eventElement = new Date(event.value).getTime();

  if (title.value === "" || event.value === "") {
    return alert("Please enter a title value and a date");
  }
  showEvent(title.value, eventElement);

  title.value = "";
  event.value = "";
});

const eventBtn = document.querySelector(".event__btn");

eventBtn.addEventListener("click", showForm);

window.addEventListener("DOMContentLoaded", getLocalStorage);
