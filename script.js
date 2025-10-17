// Game state
let heavyIndex = Math.floor(Math.random() * 10); // Random heavy balloon
let leftSelection = [];
let rightSelection = [];
let weighings = []; // Array to store each weighing

// Background color changing effect
function getRandomColor() {
    let colors = ['#ffebee', '#e8f5e8', '#e3f2fd', '#fff3e0', '#fce4ec', '#f3e5f5', '#e0f2f1'];
    let randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Change background every 4 seconds with smooth transition
setInterval(function() {
    document.body.style.backgroundColor = getRandomColor();
    document.body.style.transition = 'background-color 1s ease';
}, 4000);

// Get elements
const ballsContainer = document.getElementById("balls-container");
const leftDrop = document.getElementById("left-drop");
const rightDrop = document.getElementById("right-drop");
const weighBtn = document.getElementById("weighBtn");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const scale = document.getElementById("scale");
const logList = document.getElementById("log-list");

// Create balloons
for (let i = 0; i < 10; i++) {
  const ball = document.createElement("div");
  ball.className = "ball";
  ball.dataset.id = i;
  ball.textContent = i + 1;
  ball.setAttribute("draggable", "true");

  // Drag events
  ball.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", ball.dataset.id);
  });

  ballsContainer.appendChild(ball);
}

// Drop zone logic
[leftDrop, rightDrop].forEach((zone, idx) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const ball = document.querySelector(`.ball[data-id='${id}']`);
        zone.appendChild(ball);

        // Update selection arrays and classes
        if (idx === 0) { // Left
            ball.classList.add("selected-left");
            ball.classList.remove("selected-right");
            if (!leftSelection.includes(Number(id))) leftSelection.push(Number(id));
            rightSelection = rightSelection.filter(num => num !== Number(id));
        } else { // Right
            ball.classList.add("selected-right");
            ball.classList.remove("selected-left");
            if (!rightSelection.includes(Number(id))) rightSelection.push(Number(id));
            leftSelection = leftSelection.filter(num => num !== Number(id));
        }
    });
});

// Weigh button logic with history log
weighBtn.addEventListener("click", () => {
  // Restrict weighing to exactly 5 balls on each side
  if (leftSelection.length !== 5 || rightSelection.length !== 5) {
    message.textContent = "Place exactly 5 balloons on each side to weigh!";
    return;
  }

  let leftWeight = leftSelection.includes(heavyIndex) ? 1.1 : 1;
  let rightWeight = rightSelection.includes(heavyIndex) ? 1.1 : 1;

  let result, tilt;
  if (leftWeight > rightWeight) {
    tilt = -10;
    result = "Left side is heavier!";
  } else if (rightWeight > leftWeight) {
    tilt = 10;
    result = "Right side is heavier!";
  } else {
    tilt = 0;
    result = "Both sides are equal!";
  }
  scale.style.transform = `rotate(${tilt}deg)`;
  document.getElementById("scale-container").style.transform = `rotate(${tilt}deg)`;
  message.textContent = result;

  // Save this weighing to the log
  weighings.push({
    left: [...leftSelection],
    right: [...rightSelection],
    result: result
  });

  // Update the log display
  logList.innerHTML = "";
  weighings.forEach((w, i) => {
    // Create a container for the mini scale
    const miniScaleContainer = document.createElement("div");
    miniScaleContainer.style.display = "flex";
    miniScaleContainer.style.flexDirection = "column";
    miniScaleContainer.style.alignItems = "center";
    miniScaleContainer.style.justifyContent = "center";
    miniScaleContainer.style.marginBottom = "24px";
    miniScaleContainer.style.width = "340px";

    // Balls row (above the scale bar)
    const miniBallsRow = document.createElement("div");
    miniBallsRow.style.display = "flex";
    miniBallsRow.style.alignItems = "center";
    miniBallsRow.style.justifyContent = "center";
    miniBallsRow.style.gap = "12px";
    miniBallsRow.style.width = "320px";
    miniBallsRow.style.height = "48px";
    miniBallsRow.style.transition = "transform 0.6s ease";

    // Tilt the row of balls and scale bar
    let miniTilt = 0;
    if (w.result.includes("Left")) {
      miniTilt = -10;
    } else if (w.result.includes("Right")) {
      miniTilt = 10;
    }
    miniBallsRow.style.transform = `rotate(${miniTilt}deg)`;

    // Add left balls
    w.left.forEach(n => {
      const b = document.createElement("div");
      b.textContent = n + 1;
      b.style.width = "32px";
      b.style.height = "32px";
      b.style.background = "#4CAF50";
      b.style.borderRadius = "50%";
      b.style.border = "2px solid #4CAF50";
      b.style.fontSize = "14px";
      b.style.display = "flex";
      b.style.alignItems = "center";
      b.style.justifyContent = "center";
      b.style.marginRight = "4px";
      b.style.color = "#fff";
      miniBallsRow.appendChild(b);
    });

    // Add solid divider between left and right balls
    const divider = document.createElement("div");
    divider.style.width = "8px";
    divider.style.height = "40px";
    divider.style.background = "#222";
    divider.style.borderRadius = "4px";
    divider.style.margin = "0 8px";
    miniBallsRow.appendChild(divider);

    // Add right balls
    w.right.forEach(n => {
      const b = document.createElement("div");
      b.textContent = n + 1;
      b.style.width = "32px";
      b.style.height = "32px";
      b.style.background = "#2196F3";
      b.style.borderRadius = "50%";
      b.style.border = "2px solid #2196F3";
      b.style.fontSize = "14px";
      b.style.display = "flex";
      b.style.alignItems = "center";
      b.style.justifyContent = "center";
      b.style.marginLeft = "4px";
      b.style.color = "#fff";
      miniBallsRow.appendChild(b);
    });

  // Mini scale bar (visually pleasing)
  const miniBar = document.createElement("div");
  miniBar.style.width = "320px";
  miniBar.style.height = "14px";
  miniBar.style.background = "linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)";
  miniBar.style.borderRadius = "7px";
  miniBar.style.margin = "0 auto";
  miniBar.style.boxShadow = "0 2px 8px #90caf9, 0 1px 0 #fff";
  miniBar.style.transition = "transform 0.6s cubic-bezier(.68,-0.55,.27,1.55)";
  miniBar.style.transform = `rotate(${miniTilt}deg)`;

    // Add balls row and scale bar to container
    miniScaleContainer.appendChild(miniBallsRow);
    miniScaleContainer.appendChild(miniBar);

    // Add a label
    const label = document.createElement("span");
  label.textContent = `Weighing ${i + 1}`;
  label.style.marginLeft = "18px";
  label.style.fontSize = "18px";

    // Add to log
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.appendChild(miniScaleContainer);
    li.appendChild(label);
    logList.appendChild(li);
  });
});

// Guess button logic
guessBtn.addEventListener("click", () => {
  let guess = prompt("Which balloon is heavy? Enter a number 1-10:");
  if (parseInt(guess) - 1 === heavyIndex) {
    message.textContent = `🎉 Correct! The heavy balloon is number ${heavyIndex + 1}!`;
  } else {
    message.textContent = `❌ Wrong! Try again.`;
  }
});

// Reset button logic
resetBtn.addEventListener("click", () => {
  // Move all balls back to ballsContainer
  for (let i = 0; i < 10; i++) {
    const ball = document.querySelector(`.ball[data-id='${i}']`);
    ballsContainer.appendChild(ball);
    ball.classList.remove("selected-left", "selected-right");
  }
  leftSelection = [];
  rightSelection = [];
  scale.style.transform = "rotate(0deg)";
  message.textContent = "";
  heavyIndex = Math.floor(Math.random() * 10);
  weighings = [];
  logList.innerHTML = "";
});