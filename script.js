function updateTime() {
  document.querySelector("#timeElement").textContent =
    new Date().toLocaleTimeString();
}

updateTime();
setInterval(updateTime, 1000);

function openWindow(element) {
  element.style.display = "block";
  bringToFront(element);
}

function closeWindow(element) {
  element.style.display = "none";
}

function bringToFront(element) {
  let highest = 10;

  document.querySelectorAll(".window").forEach((window) => {
    highest = Math.max(highest, parseInt(window.style.zIndex) || 10);
  });

  element.style.zIndex = highest + 1;
}

function selectIcon(element) {
  element.classList.add("selected");
}

function deselectIcon(element) {
  element.classList.remove("selected");
}

function handleIconTap(icon, appWindow) {
  if (icon.classList.contains("selected")) {
    deselectIcon(icon);
    openWindow(appWindow);
  } else {
    selectIcon(icon);
  }
}

function dragElement(element) {
  const header = element.querySelector(".window-header");

  if (!header) return;

  let startX;
  let startY;
  let startLeft;
  let startTop;

  header.addEventListener("mousedown", startDrag);

  function startDrag(event) {
    startX = event.clientX;
    startY = event.clientY;

    const rect = element.getBoundingClientRect();

    startLeft = rect.left;
    startTop = rect.top;

    element.style.transform = "none";

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);

    bringToFront(element);
  }

  function drag(event) {
    element.style.left = startLeft + event.clientX - startX + "px";
    element.style.top = startTop + event.clientY - startY + "px";
  }

  function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }
}

function createAppWindow(id, title, content) {
  const windowElement = document.createElement("div");

  windowElement.id = id;
  windowElement.classList.add("window");

  windowElement.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-button">×</button>
        </div>
        <div class="window-content">${content}</div>
    `;

  document.body.appendChild(windowElement);

  windowElement.querySelector(".close-button").addEventListener("click", () => {
    closeWindow(windowElement);
  });

  dragElement(windowElement);

  return windowElement;
}

const welcomeWindow = document.querySelector("#welcome");

dragElement(welcomeWindow);
openWindow(welcomeWindow);

welcomeWindow.querySelector(".close-button").addEventListener("click", () => {
  closeWindow(welcomeWindow);
});

const stopwatchWindow = createAppWindow(
  "stopwatchWindow",
  "Stopwatch",
  `
    <div class="stopwatch">
        <div id="stopwatchTime">00:00:00</div>

        <div class="stopwatch-buttons">
            <button id="startStopwatch">Start</button>
            <button id="resetStopwatch">Reset</button>
        </div>
    </div>
`,
);

const stopwatchIcon = document.querySelector("#stopwatch");

stopwatchIcon.addEventListener("click", () => {
  handleIconTap(stopwatchIcon, stopwatchWindow);
});

let stopwatchStart = 0;
let stopwatchElapsed = 0;
let stopwatchRunning = false;
let stopwatchFrame;

const stopwatchTime = stopwatchWindow.querySelector("#stopwatchTime");
const startStopwatch = stopwatchWindow.querySelector("#startStopwatch");
const resetStopwatch = stopwatchWindow.querySelector("#resetStopwatch");

function updateStopwatch() {
    let elapsed = stopwatchElapsed;

    if (stopwatchRunning) {
        elapsed += performance.now() - stopwatchStart;
    }

    const milliseconds = Math.floor(elapsed % 1000);
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000) % 60;
    const hours = Math.floor(elapsed / 3600000);

    stopwatchTime.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0") + "." +
        String(milliseconds).padStart(3, "0");

    if (stopwatchRunning) {
        stopwatchFrame = requestAnimationFrame(updateStopwatch);
    }
}

startStopwatch.addEventListener("click", () => {
    if (stopwatchRunning) {
        stopwatchElapsed += performance.now() - stopwatchStart;
        stopwatchRunning = false;
        cancelAnimationFrame(stopwatchFrame);
        startStopwatch.textContent = "Start";
        updateStopwatch();
    } else {
        stopwatchStart = performance.now();
        stopwatchRunning = true;
        startStopwatch.textContent = "Stop";
        updateStopwatch();
    }
});

resetStopwatch.addEventListener("click", () => {
    stopwatchRunning = false;
    cancelAnimationFrame(stopwatchFrame);

    stopwatchStart = 0;
    stopwatchElapsed = 0;

    startStopwatch.textContent = "Start";

    updateStopwatch();
});

updateStopwatch();
