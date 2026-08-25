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
  const allIcons = document.querySelectorAll(".app-icon");
  if (icon.classList.contains("selected")) {
    deselectIcon(icon);
    openWindow(appWindow);
    return;
  }
  allIcons.forEach((otherIcon) => {
    if (otherIcon !== icon) {
      deselectIcon(otherIcon);
    }
  });
  selectIcon(icon);
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
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
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

const socialsWindow = createAppWindow(
  "socialsWindow",
  "Socials",
  `
    <div class="socials">
        <div class="social-profile">
            <img src="./Images/pfp.jpg" alt="phantom-ascii">
            <div>
                <h1>phantom-ascii</h1>
                <p>developer • maker • creator</p>
            </div>
        </div>

        <div class="social-links">
            <a href="https://github.com/phantom-ascii" target="_blank">
                <span>GitHub</span>
                <small>@phantom-ascii</small>
            </a>

            <a href="https://hackclub.enterprise.slack.com/team/U0BPT0J9XNC" target="_blank">
                <span>Slack</span>
                <small>Hack Club</small>
            </a>

            <a href="https://tiktok.com/phantom.ascii" target="_blank">
                <span>TikTok</span>
                <small>@phantom.ascii</small>
            </a>
        </div>
    </div>
`,
);

const socialsIcon = document.querySelector("#socials");

socialsIcon.addEventListener("click", () => {
  handleIconTap(socialsIcon, socialsWindow);
});

const welcomeApp = document.querySelector("#welcomeApp");

welcomeApp.addEventListener("click", () => {
  handleIconTap(welcomeApp, welcomeWindow);
});

const cookieClickerWindow = createAppWindow(
  "cookieClickerWindow",
  "Cookie Clicker",
  `
    <div class="cookie-game">
        <div id="cookieCount">0 cookies</div>
        <div id="cookieMultiplier">1x multiplier</div>

        <img id="cookie" src="./Images/pfp.jpg" alt="Cookie">

        <p>click the cookie</p>
    </div>
`,
);

const cookieClickerIcon = document.querySelector("#cookieClicker");

cookieClickerIcon.addEventListener("click", () => {
  handleIconTap(cookieClickerIcon, cookieClickerWindow);
});

let cookies = Number(localStorage.getItem("phanCookies")) || 0;

const cookie = cookieClickerWindow.querySelector("#cookie");
const cookieCount = cookieClickerWindow.querySelector("#cookieCount");
const cookieMultiplier = cookieClickerWindow.querySelector("#cookieMultiplier");

function getMultiplier() {
  if (cookies >= 10000) return 10;
  if (cookies >= 5000) return 8;
  if (cookies >= 2500) return 6;
  if (cookies >= 1000) return 5;
  if (cookies >= 500) return 3;
  if (cookies >= 100) return 2;

  return 1;
}

function updateCookieGame() {
  const multiplier = getMultiplier();

  cookieCount.textContent = `${cookies} cookies`;
  cookieMultiplier.textContent = `${multiplier}x multiplier`;

  localStorage.setItem("phanCookies", cookies);
}

cookie.addEventListener("click", () => {
  cookies += getMultiplier();

  updateCookieGame();

  cookie.classList.add("cookie-click");

  setTimeout(() => {
    cookie.classList.remove("cookie-click");
  }, 100);
});

updateCookieGame();

const aboutMeWindow = createAppWindow(
  "aboutMeWindow",
  "About Me",
  `
    <div class="about-me">
        <img src="./Images/pfp.jpg" alt="phantom-ascii">

        <h1>phantom-ascii</h1>
        <p>developer • maker • creator</p>

        <div class="about-section">
            <h2>About me</h2>
            <p>
                Hey, I'm phantom-ascii. I like building websites,
                experimenting with hardware and making random projects
                that probably didn't need to exist.
            </p>
        </div>

        <div class="about-section">
            <h2>What I make</h2>
            <p>
                Websites, games, hardware projects, keyboards,
                hackpads and whatever else I feel like building.
            </p>
        </div>

        <div class="about-section">
            <h2>Currently building</h2>
            <p>
                phanOS and a custom mechanical keyboard.
            </p>
        </div>
    </div>
`,
);

const aboutMeIcon = document.querySelector("#aboutMe");

aboutMeIcon.addEventListener("click", () => {
  handleIconTap(aboutMeIcon, aboutMeWindow);
});

const terminalWindow = createAppWindow("terminalWindow", "Terminal", `
    <div class="terminal">
        <div id="terminalOutput">Welcome to phanOS Terminal. Type "help" to see available commands.</div>

        <div class="terminal-input">
            <span>&gt;</span>
            <input id="terminalInput" type="text" autocomplete="off" spellcheck="false">
        </div>
    </div>
`);

const terminalIcon = document.querySelector("#terminal");

terminalIcon.addEventListener("click", () => {
    handleIconTap(terminalIcon, terminalWindow);
});


const terminalOutput = terminalWindow.querySelector("#terminalOutput");
const terminalInput = terminalWindow.querySelector("#terminalInput");


function terminalPrint(text) {
    terminalOutput.innerHTML += `<div>${text}</div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}


function runCommand(command) {
    const args = command.trim().toLowerCase();

    terminalPrint(`<span class="terminal-command">&gt; ${command}</span>`);

    if (args === "help") {
        terminalPrint(`
            <div>available commands:</div>
            <div>help</div>
            <div>about</div>
            <div>projects</div>
            <div>socials</div>
            <div>neofetch</div>
            <div>clear</div>
        `);
    }

    else if (args === "about") {
        terminalPrint("phanOS - a personal web OS made by phantom-ascii.");
    }

    else if (args === "projects") {
        terminalPrint("projects: phanOS, PhantomVault, cosmic-key");
    }

    else if (args === "socials") {
        terminalPrint("github.com/phantom-ascii");
        terminalPrint("tiktok.com/phantom.ascii");
        terminalPrint("Hack Club Slack");
    }

    else if (args === "neofetch") {
        terminalPrint(`
            <pre>
       .--.
      |o_o |     phantom-ascii
      |:_/ |     phanOS
     //   \\ \\    javascript
    (|     | )   web OS
   /'\\_   _/\\
   \\___)=(___/
            </pre>
        `);
    }

    else if (args === "clear") {
        terminalOutput.innerHTML = "";
    }

    else if (args === "") {
        return;
    }

    else {
        terminalPrint(`command not found: ${command}`);
    }
}


terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        runCommand(terminalInput.value);
        terminalInput.value = "";
    }
});

const scubaIcon = document.querySelector("#scuba");

scubaIcon.addEventListener("click", () => {
    if (scubaIcon.classList.contains("selected")) {
        scubaIcon.classList.remove("selected");
        window.location.href = "scuba.html";
    } else {
        scubaIcon.classList.add("selected");
    }
});

const calculatorWindow = createAppWindow(
    "calculatorWindow",
    "Calculator",
    `
        <div class="calculator">
            <div id="calculatorDisplay" class="calculator-display">
                0
            </div>
            <div class="calculator-buttons">
                <button class="clear" data-action="clear">AC</button>
                <button data-action="delete">⌫</button>
                <button data-action="percent">%</button>
                <button class="operator" data-value="/">÷</button>
                <button data-value="7">7</button>
                <button data-value="8">8</button>
                <button data-value="9">9</button>
                <button class="operator" data-value="*">x</button>
                <button data-value="4">4</button>
                <button data-value="5">5</button>
                <button data-value="6">6</button>
                <button class="operator" data-value="-">-</button>
                <button data-value="1">1</button>
                <button data-value="2">2</button>
                <button data-value="3">3</button>
                <button class="operator" data-value="+">+</button>
                <button class="zero" data-value="0">0</button>
                <button data-value=".">.</button>
                <button class="equals" data-action="equals">=</button>
            </div>
        </div>
    `
);

const calculatorIcon = document.querySelector("#calculator");

calculatorIcon.addEventListener("click", () => {
    handleIconTap(calculatorIcon, calculatorWindow);
});

let calculatorExpression = "";

const calculatorDisplay =
    calculatorWindow.querySelector("#calculatorDisplay");

const calculatorButtons =
    calculatorWindow.querySelectorAll("button");

function updateCalculatorDisplay() {
    if (calculatorExpression === "") {
        calculatorDisplay.textContent = "0";
    } else {
        calculatorDisplay.textContent = calculatorExpression;
    }
}


function addToCalculator(value) {
    calculatorExpression += value;
    updateCalculatorDisplay();
}


function clearCalculator() {
    calculatorExpression = "";
    updateCalculatorDisplay();
}


function deleteCalculator() {
    calculatorExpression = calculatorExpression.slice(0, -1);
    updateCalculatorDisplay();
}


function calculateResult() {
    if (calculatorExpression === "") {
        return;
    }

    try {
        const result = Function(
            `"use strict"; return (${calculatorExpression})`
        )();
        calculatorExpression = String(result);
        updateCalculatorDisplay();
    } catch {
        calculatorDisplay.textContent = "Error";
        calculatorExpression = "";
    }
}


function calculatePercent() {
    if (calculatorExpression === "") {
        return;
    }

    try {
        const result = Function(
            `"use strict"; return (${calculatorExpression})`
        )();
        calculatorExpression = String(result / 100);
        updateCalculatorDisplay();
    } catch {
        calculatorDisplay.textContent = "Error";
        calculatorExpression = "";
    }
}

calculatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;
        if (action === "clear") {
            clearCalculator();
            return;
        }

        if (action === "delete") {
            deleteCalculator();
            return;
        }

        if (action === "percent") {
            calculatePercent();
            return;
        }

        if (action === "equals") {
            calculateResult();
            return;
        }

        if (value) {
            addToCalculator(value);
        }
    });
});

const clockWindow = createAppWindow(
  "clockWindow",
  "Clock",
  `
    <div class="clock-app">
      <div class="analog-clock">
        <div class="clock-hand clock-hour" id="clockHour"></div>
        <div class="clock-hand clock-minute" id="clockMinute"></div>
        <div class="clock-hand clock-second" id="clockSecond"></div>
        <div class="clock-center"></div>
      </div>
      <div class="clock-time" id="clockTime">
        00:00:00
      </div>
      <div class="clock-date" id="clockDate">
        Tuesday, 25 August 2026
      </div>
    </div>
    `
);

const clockIcon = document.querySelector("#clock");
clockIcon.addEventListener("click", () => {
  handleIconTap(clockIcon, clockWindow);
});

const clockHour = clockWindow.querySelector("#clockHour");
const clockMinute = clockWindow.querySelector("#clockMinute");
const clockSecond = clockWindow.querySelector("#clockSecond");
const clockTime = clockWindow.querySelector("#clockTime");
const clockDate = clockWindow.querySelector("#clockDate");

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondDegrees = seconds * 6;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;

  clockSecond.style.transform = `rotate(${secondDegrees}deg)`;
  clockMinute.style.transform = `rotate(${minuteDegrees}deg)`;
  clockHour.style.transform = `rotate(${hourDegrees}deg)`;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  clockTime.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  clockDate.textContent = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

updateClock();
setInterval(updateClock, 1000);

const notesWindow = createAppWindow(
  "notesWindow",
  "Notes",
  `
    <div class="notes-app">
      <textarea id="notesText" placeholder="Start writing..." spellcheck="true"></textarea>
      <div class="notes-footer">
        <span id="notesStatus">Saved</span>
        <span id="notesCount">0 characters</span>
      </div>
      <button id="clearNotes">Clear</button>
    </div>
  `
);

const notesIcon = document.querySelector("#notes");
notesIcon.addEventListener("click", () => {
  handleIconTap(notesIcon, notesWindow);
});

const notesText = notesWindow.querySelector("#notesText");
const notesStatus = notesWindow.querySelector("#notesStatus");
const notesCount = notesWindow.querySelector("#notesCount");
const clearNotes = notesWindow.querySelector("#clearNotes");

notesText.value = localStorage.getItem("phanNotes") || "";

function updateNotesCount() {
  const count = notesText.value.length;
  notesCount.textContent =
    `${count} characters`;
}

function saveNotes() {
  localStorage.setItem("phanNotes", notesText.value);
  notesStatus.textContent = "Saved";
  updateNotesCount();
}

notesText.addEventListener("input", () => {
  notesStatus.textContent = "Saving...";
  saveNotes();
});

clearNotes.addEventListener("click", () => {
  notesText.value = "";
  saveNotes();
});

updateNotesCount();