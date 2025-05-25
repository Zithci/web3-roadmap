// Style
document.body.style.fontFamily = "sans-serif";
document.body.style.padding = "20px";
document.body.style.transition = "background 0.3s, color 0.3s";

// Title
const title = document.createElement("h1");
title.textContent = "Web3 Roadmap";
document.body.appendChild(title);

// Progress Bar
const progressContainer = document.createElement("div");
progressContainer.style.width = "100%";
progressContainer.style.height = "8px";
progressContainer.style.background = "#ddd";
progressContainer.style.borderRadius = "5px";
progressContainer.style.margin = "10px 0 30px";

const progressBar = document.createElement("div");
progressBar.style.height = "100%";
progressBar.style.width = "0%";
progressBar.style.background = "limegreen";
progressBar.style.borderRadius = "5px";
progressBar.style.transition = "width 0.3s";

progressContainer.appendChild(progressBar);
document.body.appendChild(progressContainer);

// Button Panel
const btnPanel = document.createElement("div");
btnPanel.style.position = "absolute";
btnPanel.style.top = "20px";
btnPanel.style.right = "20px";

function createButton(label, emoji, onclick) {
  const btn = document.createElement("button");
  btn.textContent = `${emoji} ${label}`;
  btn.style.margin = "0 3px";
  btn.onclick = onclick;
  return btn;
}

document.body.appendChild(btnPanel);

// Data
const roadmapData = {
  "JavaScript Fundamentals": [
    "Variables: let, const, var",
    "Data Types: string, number, boolean, null, undefined, object, array",
    "Functions: declaration, expression, arrow function",
    "Loops: for, while, do-while",
    "Conditionals: if, else, switch",
    "Operators: arithmetic, comparison, logical",
    "Arrays & Methods: push, pop, shift, unshift, map, filter, reduce",
    "Objects: create, access, modify, loop"
  ],
  "Async/Await + API Calls": [
    "Understanding callbacks & promises",
    "fetch and using .then()",
    "Refactor to async/await",
    "Handle API error with try-catch",
    "Use public API & render data to DOM"
  ],
  "Solidity Basics": [
    "Understand what is EVM",
    "Smart contract structure: pragma, contract, functions",
    "Data types: uint, string, bool, address",
    "Storage vs Memory",
    "Visibility: public, private, internal, external",
    "Deploy simple contract in Remix"
  ],
  "Smart Contract Deployment": [
    "Install & init Hardhat project",
    "Create & compile contract",
    "Write deployment script",
    "Test deploy on local Hardhat network",
    "Deploy to testnet (e.g., Sepolia)"
  ]
};

// Load saved state
const savedState = JSON.parse(localStorage.getItem("roadmapProgress") || "{}");

let totalCheckbox = 0;
let allCheckboxes = [];

function renderSection(titleText, items) {
  const sectionTitle = document.createElement("h2");
  sectionTitle.textContent = titleText;
  sectionTitle.style.marginTop = "30px";
  document.body.appendChild(sectionTitle);

  items.forEach(item => {
    const label = document.createElement("label");
    label.style.display = "block";
    label.style.margin = "5px 0";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = savedState[item] || false;
    checkbox.onchange = updateProgress;

    allCheckboxes.push({ checkbox, label: item });

    const span = document.createElement("span");
    span.textContent = " " + item;

    label.appendChild(checkbox);
    label.appendChild(span);
    document.body.appendChild(label);

    totalCheckbox++;
  });
}

function updateProgress() {
  const checkedCount = allCheckboxes.filter(c => c.checkbox.checked).length;
  const percent = (checkedCount / totalCheckbox) * 100;
  progressBar.style.width = percent + "%";
}

function saveProgress() {
  const state = {};
  allCheckboxes.forEach(c => {
    state[c.label] = c.checkbox.checked;
  });
  localStorage.setItem("roadmapProgress", JSON.stringify(state));
  alert("Progress saved!");
}

function resetProgress() {
  allCheckboxes.forEach(c => c.checkbox.checked = false);
  updateProgress();
  saveProgress();
}

function toggleDarkMode() {
  const isDark = document.body.style.background === "black";
  if (isDark) {
    document.body.style.background = "white";
    document.body.style.color = "black";
  } else {
    document.body.style.background = "black";
    document.body.style.color = "white";
  }
}

// Render
Object.entries(roadmapData).forEach(([section, items]) => {
  renderSection(section, items);
});

updateProgress();

btnPanel.appendChild(createButton("Save", "💾", saveProgress));
btnPanel.appendChild(createButton("Reset", "🧼", resetProgress));
btnPanel.appendChild(createButton("Dark", "🌙", toggleDarkMode));
