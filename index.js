const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

window.addEventListener("DOMContentLoaded", () => {
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);
  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

setAlarmButton.addEventListener("click", getInput);

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    const paddedValue = i < 10 ? "0" + i : i;
    option.value = paddedValue;
    option.innerHTML = paddedValue;
    element.appendChild(option);
  }
}

function getCurrentTime() {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;
  return time;
}

function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
  setAlarm(alarmTime);
}

function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addAlarmToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

function addAlarmToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>`;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
  alarmContainer.prepend(alarm);
}

function checkAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);
  return alarms;
}

function saveAlarm(time) {
  const alarms = checkAlarms();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function fetchAlarm() {
  const alarms = checkAlarms();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function deleteAlarm(event, time, intervalId) {
  const self = event.target;
  clearInterval(intervalId);
  const alarm = self.parentElement;
  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarms();
  const index = alarms.indexOf(time);
  if (index !== -1) {
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
}
