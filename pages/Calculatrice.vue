<template>
  <div class="calculator">
    <h1 class="title">Calculatrice</h1>

    <input
    id="calc-display"
    name="calc-display"
    v-model="display"
    class="display"
    @keyup.enter="handleEnter"
    />


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
const previous = ref("") 
const operator = ref(null)

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
  "C"
]


function calculate() {
  const prev = parseFloat(previous.value)
  const curr = parseFloat(current.value)

  if (isNaN(prev) || isNaN(curr)) {
    console.error("Erreur: un des opérandes n’est pas un nombre valide.", { prev, curr })
    return
  }

  if (operator.value === "+") {
    current.value = (prev + curr).toString()
  } else if (operator.value === "-") {
    current.value = (prev - curr).toString()
  } else if (operator.value === "*") {
    current.value = (prev * curr).toString()
  } else if (operator.value === "/") {
    if (curr === 0) {
      console.error("Erreur: division par zéro.")
      current.value = "Erreur"
    } else {
      current.value = (prev / curr).toString()
    }
  } else {
    console.warn("Aucun opérateur défini au moment du calcul.")
  }

  display.value = current.value
  operator.value = null
  previous.value = ""
}

function press(btn) {
  if (!isNaN(btn) || btn === ".") {
    current.value += btn
    display.value = current.value
  } 
  else if (["+", "-", "*", "/"].includes(btn)) {
    if (current.value === "") {
      console.warn("Tentative de poser un opérateur sans nombre courant.")
      return
    }
    if (previous.value !== "" && operator.value) {
      calculate()
    }
    operator.value = btn
    previous.value = current.value
    current.value = ""
  } 
  else if (btn === "=") {
    if (previous.value !== "" && operator.value && current.value !== "") {
      calculate()
    } else {
      console.warn("Impossible de calculer: expression incomplète.", {
        previous: previous.value,
        operator: operator.value,
        current: current.value
      })
    }
  } 
  else if (btn === "C") {
    console.info("Réinitialisation de la calculatrice.")
    current.value = ""
    previous.value = ""
    operator.value = null
    display.value = ""
  }
}


function handleEnter() {
  const match = display.value.match(/(-?\d+(\.\d+)?)([+\-*/])(-?\d+(\.\d+)?)/)
  if (match) {
    previous.value = match[1]
    operator.value = match[3]
    current.value = match[4]
    calculate()
  } else {
    console.error("Expression invalide saisie dans l’input :", display.value)
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
  text-shadow: 0 0 1rem #00ff66, 0 0 2rem #00ff66;
}

.display {
  padding: 1rem;
  margin-bottom: 1rem;
  border: .2rem solid #00ff66;
  text-align: right;
  font-size: 1.5rem;
  background: black;
  color: #00ff66;
  text-shadow: 0 0 .8rem #00ff66;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 7.8rem);
  gap: 0.8rem;
}

button {
  background: black;
  border: .2rem solid #00ff66;
  color: #00ff66;
  font-size: 1.2rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

button:hover {
  background: #00ff66;
  color: black;
  text-shadow: none;
}
</style>
