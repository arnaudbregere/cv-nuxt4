<template>
  <div class="calculator">
    <NuxtLink to="/works" class="back-button">
      <span class="back-arrow">←</span>
      <span>Retour à Works</span>
    </NuxtLink>

    <h1 class="title">Calculatrice</h1>

    <input
      id="calc-display"
      name="calc-display"
      v-model="display"
      class="display"
      @keyup.enter="handleEnter"
      @keyup.backspace="handleBackspace"
      @input="handleInput"
      placeholder="0"
    />

    <div class="buttons">
      <button v-for="btn in buttons" :key="btn" @click="press(btn)">
        {{ btn }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const display = ref("")
const current = ref("")
const previous = ref("")
const operator = ref(null)

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
  "C"
]

const calculate = () => {
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)

  if (isNaN(prev) || isNaN(curr)) {
    display.value = "Erreur"
    return
  }

  let result
  switch (operator.value) {
    case "+": result = prev + curr; break
    case "-": result = prev - curr; break
    case "*": result = prev * curr; break
    case "/":
      if (curr === 0) {
        display.value = "Erreur"
        reset()
        return
      }
      result = prev / curr
      break
    default:
      return
  }

  current.value = result.toString()
  display.value = current.value
  operator.value = null
  previous.value = ""
}

const reset = () => {
  current.value = ""
  previous.value = ""
  operator.value = null
  display.value = ""
}

const press = (btn) => {
  if (display.value === "Erreur") reset()

  if (!isNaN(btn) || btn === ".") {
    if (btn === "." && current.value.includes(".")) return
    current.value += btn
    display.value = current.value
  } 
  else if (["+", "-", "*", "/"].includes(btn)) {
    if (current.value === "") return
    if (previous.value !== "" && operator.value) calculate()
    operator.value = btn
    previous.value = current.value
    current.value = ""
  } 
  else if (btn === "=") {
    if (previous.value && operator.value && current.value) calculate()
  } 
  else if (btn === "C") {
    reset()
  }
}

const handleInput = () => {
  display.value = display.value.replace(/[^0-9+\-*/.]/g, '')

  const parts = display.value.split(/([+\-*/])/)
  if (parts.length === 1) {
    current.value = parts[0]
    operator.value = null
    previous.value = ""
  } else if (parts.length >= 3) {
    previous.value = parts[0]
    operator.value = parts[1]
    current.value = parts.slice(2).join("")
  }
}

const handleEnter = () => {
  const input = display.value.trim()
  if (!input) return
  if (display.value === "Erreur") return reset()

  const match = input.match(/^(-?\d+\.?\d*)([+\-*/])(-?\d+\.?\d*)$/)
  if (match) {
    previous.value = match[1]
    operator.value = match[2]
    current.value = match[3]
    calculate()
  } else {
    const num = parseFloat(input)
    if (!isNaN(num)) {
      current.value = num.toString()
      display.value = current.value
    } else {
      display.value = "Erreur"
      setTimeout(() => { if (display.value === "Erreur") reset() }, 1500)
    }
  }
}

const handleBackspace = () => {
  if (!display.value || display.value === "Erreur") {
    reset()
  } else {
    display.value = display.value.slice(0, -1)
    current.value = display.value
  }
}
</script>

<style scoped lang="scss">
/* --- Animations --- */
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes glow-pulse {
  0%, 100% { 
    box-shadow: 
      0 0 0.3125rem var(--neon-blue),
      0 0 0.625rem var(--neon-blue),
      0 0 1.25rem var(--neon-blue),
      inset 0 0 0.625rem rgba(0, 153, 255, 0.2);
  }
  50% { 
    box-shadow: 
      0 0 0.625rem var(--electric-cyan),
      0 0 1.25rem var(--electric-cyan),
      0 0 1.875rem var(--neon-blue),
      inset 0 0 0.9375rem rgba(0, 212, 255, 0.3);
  }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(145deg, rgba(0, 102, 204, 0.3), rgba(8, 8, 26, 0.8));
  border: 0.125rem solid var(--glass-border);
  color: var(--electric-cyan);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.1), 0 0.125rem 0.625rem rgba(0, 153, 255, 0.2);
  z-index: 100;
  text-shadow: 0 0 0.3125rem var(--electric-cyan);
  overflow: hidden;

  @include respond-to(tablet) {
    top: 2rem;
    left: 2rem;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  &::before, &::after {
    content: '';
    position: absolute;
    width: 0.625rem;
    height: 0.625rem;
    transition: all 0.3s ease;
  }

  &::before {
    top: -0.125rem; left: -0.125rem;
    background: var(--electric-cyan);
    clip-path: polygon(0 0, 100% 0, 100% 30%, 30% 30%, 30% 100%, 0 100%);
    box-shadow: 0 0 0.5rem var(--electric-cyan);
  }

  &::after {
    bottom: -0.125rem; right: -0.125rem;
    background: var(--accent-purple);
    clip-path: polygon(70% 0, 100% 0, 100% 100%, 0 100%, 0 70%, 70% 70%);
    box-shadow: 0 0 0.5rem var(--accent-purple);
  }

  .back-arrow {
    font-size: 1rem;
    transition: transform 0.3s ease;
    @include respond-to(tablet) {
      font-size: 1.3rem;
    }
  }

  &:hover {
    background: linear-gradient(145deg, rgba(0, 153, 255, 0.5), rgba(0, 102, 204, 0.7));
    border-color: var(--electric-cyan);
    color: var(--bright-white);
    transform: translateX(-0.5rem);
    box-shadow: inset 0 0.0625rem 0 rgba(255, 255, 255, 0.2),
                0 0 1.5625rem rgba(0, 212, 255, 0.7),
                0 0 2.1875rem rgba(0, 153, 255, 0.5),
                0 0.25rem 0.9375rem rgba(0, 153, 255, 0.3);
    .back-arrow { transform: translateX(-0.3125rem) scale(1.1); }
    &::before, &::after { width: 0.875rem; height: 0.875rem; }
  }

  &:active {
    transform: translateX(-0.1875rem) scale(0.97);
    box-shadow: inset 0 0.1875rem 0.75rem rgba(0, 153, 255, 0.6),
                0 0 0.9375rem rgba(0, 212, 255, 0.5);
  }
}

/* --- Layout principal --- */
.calculator {
  font-family: 'Courier New', monospace;
  background: linear-gradient(to bottom, var(--bg-deepest) 0%, var(--bg-darker) 50%, var(--bg-dark) 100%);
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-height: 100vh;
  position: relative;

  @include respond-to(tablet) {
    padding: 2rem;
  }

  &::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 0.125rem;
    background: linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.3), transparent);
    animation: scanline 8s linear infinite;
    z-index: 10;
  }

  &::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg, rgba(0, 153, 255, 0.03) 0px, transparent 3px),
      repeating-linear-gradient(90deg, rgba(0, 153, 255, 0.03) 0px, transparent 3px);
    pointer-events: none;
    z-index: 1;
  }
}

.title {
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  background: linear-gradient(135deg, var(--electric-cyan), var(--neon-blue), var(--accent-purple), var(--accent-pink));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 0.625rem rgba(0, 153, 255, 0.8)) drop-shadow(0 0 1.25rem rgba(0, 212, 255, 0.5));
  animation: flicker 3s infinite;
  z-index: 2;

  @include respond-to(tablet) {
    margin-bottom: 2rem;
    font-size: 2.5rem;
    letter-spacing: 0.3rem;
  }
}

.display {
  width: 100%;
  max-width: 31.2rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 0.1875rem solid transparent;
  background: linear-gradient(var(--bg-darker), var(--bg-darker)) padding-box,
              linear-gradient(135deg, var(--electric-cyan), var(--neon-blue)) border-box;
  text-align: right;
  font-size: 1.5rem;
  color: var(--bright-white);
  animation: glow-pulse 3s ease-in-out infinite;
  z-index: 2;
  font-weight: bold;

  @include respond-to(tablet) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  &::placeholder { color: rgba(148, 163, 184, 0.5); }
  &:focus { outline: none; animation: glow-pulse 1.5s ease-in-out infinite; }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, minmax(3rem, 1fr));
  gap: 0.5rem;
  z-index: 2;
  width: 100%;
  max-width: 31.2rem;
  padding: 0 0.5rem;

  @include respond-to(tablet) {
    grid-template-columns: repeat(4, 7.8rem);
    gap: 0.8rem;
    padding: 0;
  }
}

button {
  background: linear-gradient(145deg, rgba(0, 102, 204, 0.3), rgba(8, 8, 26, 0.8));
  border: 0.125rem solid var(--glass-border);
  color: var(--electric-cyan);
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.8rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 0 0.3125rem var(--electric-cyan);
  overflow: hidden;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @include respond-to(tablet) {
    font-size: 1.5rem;
    padding: 1.2rem;
    aspect-ratio: auto;
  }

  &:hover {
    background: linear-gradient(145deg, rgba(0, 153, 255, 0.4), rgba(0, 102, 204, 0.6));
    border-color: var(--electric-cyan);
    color: var(--bright-white);
    transform: translateY(-0.125rem);
  }

  &:active { transform: translateY(0) scale(0.98); }

  &:last-child {
    background: linear-gradient(145deg, rgba(236, 72, 153, 0.3), rgba(8, 8, 26, 0.8));
    border-color: rgba(236, 72, 153, 0.5);
    color: var(--accent-pink);
    &:hover {
      background: linear-gradient(145deg, rgba(236, 72, 153, 0.5), rgba(99, 102, 241, 0.4));
      border-color: var(--accent-pink);
    }
  }
}
</style>