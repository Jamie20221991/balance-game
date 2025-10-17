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

// Wait for page to load, then start all effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound system
    initializeSounds();
    
    // Start particle effects
    startAmbientParticles();
    
    // Add hover sound effects to balloons
    document.querySelectorAll('.ball').forEach(ball => {
        ball.addEventListener('mouseenter', () => playSound('hover'));
        ball.addEventListener('mousedown', () => playSound('grab'));
    });
});

// Sound System
let sounds = {};

function initializeSounds() {
    // Create audio context for sound effects
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Generate sound effects programmatically
        sounds.hover = createTone(audioContext, 800, 0.1, 0.05);
        sounds.grab = createTone(audioContext, 600, 0.2, 0.1);
        sounds.drop = createTone(audioContext, 400, 0.3, 0.15);
        sounds.victory = createVictorySound(audioContext);
        sounds.weighScale = createTone(audioContext, 200, 0.5, 0.2);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function createTone(audioContext, frequency, duration, volume) {
    return function() {
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Silent fail if audio doesn't work
        }
    };
}

function createVictorySound(audioContext) {
    return function() {
        try {
            [523, 659, 784, 1047].forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.5);
                }, i * 150);
            });
        } catch (e) {
            // Silent fail
        }
    };
}

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName]();
    }
}

// Particle Effects System
function createParticle(x, y, emoji, options = {}) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    if (options.size) particle.style.fontSize = options.size + 'px';
    if (options.color) particle.style.color = options.color;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
}

function createConfetti(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = (x + Math.random() * 100 - 50) + 'px';
            confetti.style.top = (y + Math.random() * 50 - 25) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }, i * 50);
    }
}

function showCelebration(message) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = message;
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.parentNode.removeChild(celebration);
        }
    }, 2000);
}

function startAmbientParticles() {
    setInterval(() => {
        if (Math.random() < 0.3) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.3;
            const particles = ['✨', '⭐', '💫', '🌟'];
            const particle = particles[Math.floor(Math.random() * particles.length)];
            createParticle(x, y, particle, { size: 15 });
        }
    }, 2000);
}

function addScreenShake() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

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

// Create enhanced balloons with variety
const balloonColors = [
  'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ffb3b3 100%)', // Red
  'linear-gradient(135deg, #4ecdc4 0%, #6ee0d6 50%, #8ff0e8 100%)', // Teal
  'linear-gradient(135deg, #45b7d1 0%, #67c4dd 50%, #89d1e9 100%)', // Blue
  'linear-gradient(135deg, #96ceb4 0%, #aad6c4 50%, #bedef4 100%)', // Green
  'linear-gradient(135deg, #feca57 0%, #fed971 50%, #fee78b 100%)', // Yellow
  'linear-gradient(135deg, #ff9ff3 0%, #ffb3f5 50%, #ffc7f7 100%)', // Pink
  'linear-gradient(135deg, #a29bfe 0%, #b5affe 50%, #c8c3fe 100%)', // Purple
  'linear-gradient(135deg, #fd79a8 0%, #fd93ba 50%, #fdadcc 100%)', // Hot Pink
  'linear-gradient(135deg, #fdcb6e 0%, #fdd584 50%, #fede9a 100%)', // Orange
  'linear-gradient(135deg, #6c5ce7 0%, #8b7ced 50%, #aa9df3 100%)'  // Violet
];

for (let i = 0; i < 10; i++) {
  const ball = document.createElement("div");
  ball.className = "ball";
  ball.dataset.id = i;
  ball.textContent = i + 1;
  ball.setAttribute("draggable", "true");
  
  // Set unique color for each balloon
  ball.style.background = balloonColors[i];
  
  // Add sparkle delay for staggered effect
  ball.style.setProperty('--sparkle-delay', (i * 0.3) + 's');

  // Drag events
  ball.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", ball.dataset.id);
  });

  ballsContainer.appendChild(ball);
}

// Enhanced Drop zone logic with effects
[leftDrop, rightDrop].forEach((zone, idx) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.style.transform = 'scale(1.05)';
        zone.style.boxShadow = '0 8px 25px rgba(52,152,219,0.4)';
    });
    
    zone.addEventListener("dragleave", (e) => {
        zone.style.transform = 'scale(1)';
        zone.style.boxShadow = '';
    });
    
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        const ball = document.querySelector(`.ball[data-id='${id}']`);
        
        // Reset zone style
        zone.style.transform = 'scale(1)';
        zone.style.boxShadow = '';
        
        // Add drop effect
        const rect = zone.getBoundingClientRect();
        createParticle(rect.left + rect.width/2, rect.top + rect.height/2, '💨', { size: 25 });
        playSound('drop');
        
        // Animate balloon landing
        ball.style.transform = 'scale(1.2)';
        setTimeout(() => {
            ball.style.transform = '';
        }, 200);
        
        zone.appendChild(ball);

        // Update selection arrays and classes with glow effect
        if (idx === 0) { // Left
            ball.classList.add("selected-left");
            ball.classList.remove("selected-right");
            ball.classList.add("glow-pulse");
            setTimeout(() => ball.classList.remove("glow-pulse"), 1000);
            if (!leftSelection.includes(Number(id))) leftSelection.push(Number(id));
            rightSelection = rightSelection.filter(num => num !== Number(id));
        } else { // Right
            ball.classList.add("selected-right");
            ball.classList.remove("selected-left");
            ball.classList.add("glow-pulse");
            setTimeout(() => ball.classList.remove("glow-pulse"), 1000);
            if (!rightSelection.includes(Number(id))) rightSelection.push(Number(id));
            leftSelection = leftSelection.filter(num => num !== Number(id));
        }
    });
});

// Enhanced Weigh button logic with spectacular effects
weighBtn.addEventListener("click", () => {
  // Restrict weighing to exactly 5 balls on each side
  if (leftSelection.length !== 5 || rightSelection.length !== 5) {
    message.textContent = "Place exactly 5 balloons on each side to weigh!";
    message.style.color = '#e74c3c';
    addScreenShake();
    return;
  }

  // Dramatic weighing sequence
  weighBtn.disabled = true;
  weighBtn.textContent = "⚖️ Weighing...";
  
  // Add suspense delay
  setTimeout(() => {
    let leftWeight = leftSelection.includes(heavyIndex) ? 1.1 : 1;
    let rightWeight = rightSelection.includes(heavyIndex) ? 1.1 : 1;

    let result, tilt;
    if (leftWeight > rightWeight) {
      tilt = -10;
      result = "🎈 Left side is heavier! ⬇️";
      message.style.color = '#3498db';
    } else if (rightWeight > leftWeight) {
      tilt = 10;
      result = "🎈 Right side is heavier! ⬇️";
      message.style.color = '#e74c3c';
    } else {
      tilt = 0;
      result = "⚖️ Both sides are equal! Perfect balance! ⚖️";
      message.style.color = '#27ae60';
    }
    
    // Dramatic scale animation
    scale.classList.add('wobble');
    scale.style.transform = `rotate(${tilt}deg)`;
    document.getElementById("scale-container").style.transform = `rotate(${tilt}deg)`;
    
    // Sound and particle effects
    playSound('weighScale');
    
    // Create particles based on result
    const scaleRect = scale.getBoundingClientRect();
    const centerX = scaleRect.left + scaleRect.width / 2;
    const centerY = scaleRect.top + scaleRect.height / 2;
    
    if (tilt !== 0) {
      // Tipping particles
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          createParticle(centerX + (Math.random() - 0.5) * 100, centerY, '⚖️', { size: 20 });
        }, i * 100);
      }
      addScreenShake();
    } else {
      // Perfect balance particles
      createConfetti(centerX, centerY);
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createParticle(centerX + (Math.random() - 0.5) * 200, centerY - 50, '✨', { size: 30 });
        }, i * 200);
      }
    }
    
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
        b.style.background = balloonColors[n] || "#4CAF50";
        b.style.borderRadius = "50%";
        b.style.border = "2px solid #4CAF50";
        b.style.fontSize = "14px";
        b.style.display = "flex";
        b.style.alignItems = "center";
        b.style.justifyContent = "center";
        b.style.marginRight = "4px";
        b.style.color = "#fff";
        b.style.fontWeight = "bold";
        b.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
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
        b.style.background = balloonColors[n] || "#2196F3";
        b.style.borderRadius = "50%";
        b.style.border = "2px solid #2196F3";
        b.style.fontSize = "14px";
        b.style.display = "flex";
        b.style.alignItems = "center";
        b.style.justifyContent = "center";
        b.style.marginLeft = "4px";
        b.style.color = "#fff";
        b.style.fontWeight = "bold";
        b.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
        miniBallsRow.appendChild(b);
      });

    // Mini scale bar (visually pleasing)
    const miniBar = document.createElement("div");
    miniBar.style.width = "320px";
    miniBar.style.height = "14px";
    miniBar.style.background = "linear-gradient(90deg, #2c3e50 0%, #34495e 100%)";
    miniBar.style.borderRadius = "7px";
    miniBar.style.margin = "0 auto";
    miniBar.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)";
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
    label.style.fontWeight = "bold";
    label.style.color = "#2c3e50";

      // Add to log
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.appendChild(miniScaleContainer);
      li.appendChild(label);
      logList.appendChild(li);
    });
    
    // Reset button
    setTimeout(() => {
      weighBtn.disabled = false;
      weighBtn.textContent = "⚖️ Weigh";
      scale.classList.remove('wobble');
    }, 1000);
    
  }, 800); // Suspense delay

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

// Enhanced Guess button with victory celebration
guessBtn.addEventListener("click", () => {
  let guess = prompt("🎯 Which balloon is heavy? Enter a number 1-10:");
  if (parseInt(guess) - 1 === heavyIndex) {
    // VICTORY CELEBRATION!
    message.textContent = `🎊 AMAZING! The heavy balloon is number ${heavyIndex + 1}! 🎊`;
    message.style.color = '#f39c12';
    message.style.fontSize = '2rem';
    
    // Victory sound
    playSound('victory');
    
    // Massive confetti explosion
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createConfetti(Math.random() * window.innerWidth, Math.random() * 200);
      }, i * 300);
    }
    
    // Victory message
    showCelebration('🏆 VICTORY! 🏆');
    
    // Balloon celebration - make them all glow
    document.querySelectorAll('.ball').forEach((ball, index) => {
      setTimeout(() => {
        ball.classList.add('glow-pulse');
        ball.style.transform = 'scale(1.2) translateY(-20px)';
        
        // Reset after celebration
        setTimeout(() => {
          ball.classList.remove('glow-pulse');
          ball.style.transform = '';
        }, 2000);
      }, index * 100);
    });
    
    // Fireworks particles
    setTimeout(() => {
      const fireworkEmojis = ['🎆', '🎇', '✨', '🌟', '💫'];
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight * 0.6;
          const emoji = fireworkEmojis[Math.floor(Math.random() * fireworkEmojis.length)];
          createParticle(x, y, emoji, { size: 25 });
        }, i * 100);
      }
    }, 1000);
    
    // Reset message after celebration
    setTimeout(() => {
      message.style.fontSize = '1.5rem';
    }, 3000);
    
  } else {
    message.textContent = `💭 Not quite! The heavy balloon isn't number ${guess}. Keep trying! 💪`;
    message.style.color = '#e67e22';
    addScreenShake();
    
    // Encouraging particles
    const messageRect = message.getBoundingClientRect();
    createParticle(messageRect.left + messageRect.width/2, messageRect.top, '💪', { size: 25 });
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
