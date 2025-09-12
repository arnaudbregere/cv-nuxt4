<template>
  <div>
    <Cv />
  </div>
</template>


<style scoped>
.terminal-container {
  background: #000;
  padding: 2rem;
}

.terminal-window {
  background: #000;
  color: #00ff00;
  font-family: "Courier New", monospace;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid #333;
  box-shadow: 0 0 20px #00ff00;
  text-align: left;
}

.cursor {
  display: inline-block;
  width: 10px;
  background: #00ff00;
  margin-left: 2px;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.progress-bar {
  width: 100%;
  border: 1px solid #00ff00;
  height: 20px;
  margin-top: 0.5rem;
  position: relative;
  background: #000;
}

.progress {
  height: 100%;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
  transition: width 0.15s linear;
}

/* Couleurs rétro */
.title {
  color: #ffa500;
  font-weight: bold;
}
.subtitle {
  color: #00ff00;
  font-weight: bold;
}
.date {
  color: #00ffff;
  font-style: italic;
}
.text {
  color: #a9b7c0;
}
</style>