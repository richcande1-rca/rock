const world = document.querySelector("#world");
const form = document.querySelector("#question-form");
const input = document.querySelector("#question-input");
const rainLayer = document.querySelector(".rain-layer");
const leafLayer = document.querySelector(".leaf-layer");
const bugLayer = document.querySelector(".bug-layer");

const state = {
  rainy: false,
  night: false,
  wrapper: false,
  cigarette: false,
  dogdoo: false
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  input.value = "";
  input.blur();
});

function chance(percent) {
  return Math.random() * 100 < percent;
}

function setTimeOfDay() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const t = (hour + minute / 60) / 24;

  const sunX = 8 + Math.sin(t * Math.PI) * 84;
  const sunY = 12 + Math.abs(t - 0.5) * 40;

  document.documentElement.style.setProperty("--sun-x", `${sunX}%`);
  document.documentElement.style.setProperty("--sun-y", `${sunY}%`);

  state.night = hour < 6 || hour >= 20;
  world.classList.toggle("night", state.night);
}

function maybeWeather() {
  state.rainy = chance(18);
  world.classList.toggle("rainy", state.rainy);
}

function updateDebris() {
  if (!state.wrapper && chance(18)) {
    state.wrapper = true;
    world.classList.add("show-wrapper");
  }

  if (!state.cigarette && chance(14)) {
    state.cigarette = true;
    world.classList.add("show-cigarette");
  }

  if (!state.dogdoo && chance(5)) {
    state.dogdoo = true;
    world.classList.add("show-dogdoo");
  }
}

function spawnRain() {
  if (!state.rainy || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const drop = document.createElement("div");
  drop.className = "raindrop";
  drop.style.left = `${Math.random() * 100}vw`;
  drop.style.animationDuration = `${0.7 + Math.random() * 0.7}s`;
  drop.style.opacity = `${0.25 + Math.random() * 0.55}`;

  rainLayer.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove());
}

function spawnLeaf() {
  if (!chance(28) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.style.left = `${Math.random() * 100}vw`;
  leaf.style.setProperty("--drift", `${-20 + Math.random() * 40}vw`);
  leaf.style.animationDuration = `${9 + Math.random() * 12}s`;

  leafLayer.appendChild(leaf);
  leaf.addEventListener("animationend", () => leaf.remove());
}

function spawnAnt() {
  if (!chance(35) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ant = document.createElement("div");
  ant.className = "ant";
  ant.style.left = `${20 + Math.random() * 60}vw`;
  ant.style.top = `${60 + Math.random() * 22}vh`;
  ant.style.setProperty("--walk-x", `${-60 + Math.random() * 120}px`);
  ant.style.setProperty("--walk-y", `${-12 + Math.random() * 24}px`);
  ant.style.animationDuration = `${8 + Math.random() * 14}s`;

  bugLayer.appendChild(ant);
  ant.addEventListener("animationend", () => ant.remove());
}

function tickSlowWorld() {
  setTimeOfDay();
  maybeWeather();
  updateDebris();
}

setTimeOfDay();
maybeWeather();

setInterval(spawnRain, 95);
setInterval(spawnLeaf, 12000);
setInterval(spawnAnt, 18000);
setInterval(tickSlowWorld, 60000);
