<template>
  <div class="calculator">
    <h1 class="title">Calculator</h1>

    <!-- Affichage -->
    <div class="display">{{ display || "0" }}</div>

    <!-- Boutons -->
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
const operator = ref(null)
const previous = ref(null)

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
  "C"
]

// Fonction de calcul
function calculate() {
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)

  if (isNaN(prev) || isNaN(curr)) return

  if (operator.value === "+") {
    current.value = (prev + curr).toString()
  } else if (operator.value === "-") {
    current.value = (prev - curr).toString()
  } else if (operator.value === "*") {
    current.value = (prev * curr).toString()
  } else if (operator.value === "/") {
    current.value = curr === 0 ? "Erreur" : (prev / curr).toString()
  }

  operator.value = null
  previous.value = null
}

function press(btn) {
  if (!isNaN(btn) || btn === ".") {
    current.value += btn
    display.value = current.value
  } 
  else if (["+", "-", "*", "/"].includes(btn)) {
    if (current.value === "") return
    if (previous.value !== null && operator.value) {
      calculate()
    }
    operator.value = btn
    previous.value = current.value
    current.value = ""
  } 
  else if (btn === "=") {
    if (previous.value !== null && operator.value && current.value !== "") {
      calculate()
      display.value = current.value
    }
  } 
  else if (btn === "C") {
    current.value = ""
    previous.value = null
    operator.value = null
    display.value = ""
  }
}
</script>

<style scoped>
/* Style rétro terminal */
.calculator {
  font-family: monospace;
  background-color: black;
  color: #00ff66;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #00ff66, 0 0 20px #00ff66;
}

.display {
  width: 240px;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #00ff66;
  text-align: right;
  font-size: 1.5rem;
  background: black;
  color: #00ff66;
  text-shadow: 0 0 8px #00ff66;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  gap: 8px;
}

button {
  background: black;
  border: 2px solid #00ff66;
  color: #00ff66;
  font-size: 1.2rem;
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

button:hover {
  background: #00ff66;
  color: black;
  text-shadow: none;
}
</style>
