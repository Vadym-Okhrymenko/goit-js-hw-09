import { Notify } from 'notiflix/build/notiflix-notify-aio';
const notifyWarning = {
  width: '500px',
  fontSize: '25px',
  position: 'center-top',
  opacity: 0.7,
  timeout: 1500,
};

const selectors = {
  form: document.querySelector('.form'),
  btnSubmit: document.querySelector('[type="submit"]'),
};

let numberPromisePending = 0;

selectors.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const delayValue = +selectors.form.elements.delay.value;
  const stepValue = +selectors.form.elements.step.value;
  const amountValue = +selectors.form.elements.amount.value;

  if (checkCorrectValue({ delayValue, stepValue, amountValue })) {
    return;
  }

  selectors.btnSubmit.disabled = true;
  let position = 1;
  let delay = delayValue;

  for (let i = 0; i < amountValue; i += 1) {
    position = i + 1;
    delay = delayValue + stepValue * i;

    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      })
      .finally(() => {
        numberPromisePending -= 1;
        selectors.btnSubmit.disabled =
          numberPromisePending === 0 ? false : true;
      });
  }
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, rejection) => {
    numberPromisePending += 1;

    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        rejection({ position, delay });
      }
    }, delay);
  });
}

function checkCorrectValue({ delayValue, stepValue, amountValue }) {
  let errorAnyValue = false;

  if (delayValue < 0) {
    Notify.warning('Delay cannot be less than 0', notifyWarning);
    errorAnyValue = true;
  }

  if (stepValue < 0) {
    Notify.warning('Step cannot be less than 0', notifyWarning);

    errorAnyValue = true;
  }

  if (amountValue < 1) {
    Notify.warning('Amount must be more than 0', notifyWarning);
    errorAnyValue = true;
  }

  return errorAnyValue;
}
