import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/dark.css');

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const selectors = {
  btnStart: document.querySelector('[data-start]'),
  dateTimePicker: document.querySelector('#datetime-picker'),
  timerFrame: document.querySelector('.timer'),
  timerFields: document.querySelectorAll('.field'),
  timerValues: document.querySelectorAll('.value'),
  timerLabels: document.querySelectorAll('.label'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
let timeStamp = 0;
let timerId = null;

let selectedDatesPicker = 0;

selectors.timerFrame.style.display = 'block';
selectors.timerFrame.style.fontWeight = '100';
selectors.timerFrame.style.fontFamily = 'sans-serif';
selectors.timerFrame.style.marginTop = '50px';
selectors.timerFrame.style.color = '#fff';
selectors.timerFrame.style.textAlign = 'center';
selectors.timerFrame.style.fontSize = '100px';

selectors.timerFields.forEach(timerField => {
  timerField.style.display = 'inline-block';
  timerField.style.padding = '10px';
  timerField.style.borderRadius = '5px';
  timerField.style.background = '#5a032f';
});

selectors.timerValues.forEach(timerValue => {
  timerValue.style.display = 'inline-block';
  timerValue.style.padding = '15px';
  timerValue.style.borderRadius = '5px';
  timerValue.style.background = '#98034d';
});

selectors.timerLabels.forEach(timerLabel => {
  timerLabel.style.display = 'block';
  timerLabel.style.paddingTop = '5px';
  timerLabel.style.fontSize = '16px';
});

selectors.btnStart.disabled = true;

selectors.btnStart.addEventListener('click', () => {
  selectors.btnStart.disabled = true;

  selectors.dateTimePicker.disabled = true;
  timeStamp = selectedDatesPicker - new Date().getTime();

  timerId = setInterval(() => {
    if (timeStamp > 1000) {
      timeStamp -= 1000;
      outputTimerDOM(convertMs(timeStamp));
    } else {
      stopTimer();
    }
  }, 1000);
});

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    selectedDatesPicker = selectedDates[0].getTime();
    timeStamp = selectedDatesPicker - new Date().getTime();
    if (timeStamp <= 0) {
      Notify.warning('Please choose a date in the future', {
        width: '500px',
        fontSize: '25px',
        position: 'center-top',
        opacity: 0.7,
      });
      return selectedDates[0];
    }

    selectors.btnStart.disabled = false;
  },
});

function stopTimer() {
  selectors.dateTimePicker.disabled = false;

  clearInterval(timerId);
  Notify.success('The set timer has finished its work ', {
    width: '500px',
    timeout: '5000',
    fontSize: '25px',
    position: 'center-top',
    opacity: 0.7,
  });
}

function outputTimerDOM({ days, hours, minutes, seconds }) {
  selectors.days.textContent = addLeadingZero(days);
  selectors.hours.textContent = addLeadingZero(hours);
  selectors.minutes.textContent = addLeadingZero(minutes);
  selectors.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
