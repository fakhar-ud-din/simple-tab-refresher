const secondsInput = document.getElementById('seconds');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const statusLabel = document.getElementById('status');
const countdownCard = document.getElementById('countdown');
const remainingLabel = document.getElementById('remaining');
const progressBar = document.getElementById('progress');

let tabId;
let countdownTimer;

function renderCountdown({ seconds, startedAt }) {
  const elapsed = (Date.now() - startedAt) / 1000;
  const remaining = seconds - (elapsed % seconds);

  remainingLabel.textContent = `${Math.ceil(remaining)}s`;
  progressBar.style.width = `${(1 - remaining / seconds) * 100}%`;
}

function render(state) {
  const isRunning = Boolean(state);

  statusLabel.textContent = isRunning ? `Every ${state.seconds}s` : 'Stopped';
  statusLabel.classList.toggle('running', isRunning);
  startButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
  secondsInput.disabled = isRunning;
  countdownCard.hidden = !isRunning;
  clearInterval(countdownTimer);

  if (isRunning) {
    secondsInput.value = state.seconds;
    renderCountdown(state);
    countdownTimer = setInterval(() => renderCountdown(state), 200);
  }
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;

  const state = await chrome.runtime.sendMessage({ action: 'status', tabId });
  render(state);
}

startButton.addEventListener('click', async () => {
  const seconds = Math.round(Number(secondsInput.value));

  if (seconds < 1) {
    secondsInput.focus();
    return;
  }

  const state = await chrome.runtime.sendMessage({ action: 'start', tabId, seconds });
  render(state);
});

stopButton.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ action: 'stop', tabId });
  render();
});

init();
