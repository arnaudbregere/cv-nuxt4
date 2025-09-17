<template>
  <div>
    <Cv />
  </div>
</template>


<style scoped>
.terminal-container {
  background: var(--bg-darker);
  padding: 2rem;
}

.terminal-window {
  background: var(--bg-darker);
  color: var(--electric-cyan);
  font-family: "Courier New", monospace;
  font-size: 1rem;
  line-height: 1.5;
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid var(--border-glow);
  box-shadow: 0 0 20px var(--neon-blue);
  text-align: left;
}

.cursor {
  display: inline-block;
  width: 10px;
  background: var(--neon-blue);
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
  border: 1px solid var(--neon-blue);
  height: 20px;
  margin-top: 0.5rem;
  position: relative;
  background: var(--bg-darker);
}

.progress {
  height: 100%;
  background: var(--neon-blue);
  box-shadow: 0 0 10px var(--electric-cyan);
  transition: width 0.15s linear;
}

/* Couleurs rétro-modernes en bleu */
.title {
  color: var(--accent-purple);
  font-weight: bold;
}
.subtitle {
  color: var(--neon-blue);
  font-weight: bold;
}
.date {
  color: var(--electric-cyan);
  font-style: italic;
}
.text {
  color: var(--text-light);
}
</style>