<template>
  <div>
    <Cv />
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/variables.scss" as *;

.terminal-container {
  background: var(--bg-darker);
  padding: 0.5rem; 

  @include respond-to(tablet) {
    padding: 0.8rem;
  }

  @include respond-to(desktop) {
    padding: 1.5rem;
  }
}

.terminal-window {
  background: var(--bg-darker);
  color: var(--electric-cyan);
  font-family: "Courier New", monospace;
  font-size: 0.85rem; 
  line-height: 1.5;
  width: 100%;
  padding: 0.5rem; 
  border: 2px solid var(--border-glow);
  box-shadow: 0 0 15px var(--neon-blue);
  text-align: left;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 50vh; 
  white-space: pre-wrap;
  word-wrap: break-word;

  @include respond-to(tablet) {
    padding: 0.8rem;
    font-size: 0.9rem;
    max-height: 60vh;
  }

  @include respond-to(desktop) {
    padding: 1rem;
    font-size: 1rem;
    max-height: 70vh;
  }
}

.cursor {
  display: inline-block;
  width: 8px;
  background: var(--neon-blue);
  margin-left: 2px;
  animation: blink 1s step-start infinite;

  @include respond-to(tablet) {
    width: 10px;
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.progress-bar {
  width: 100%;
  border: 1px solid var(--neon-blue);
  height: 14px; 
  margin-top: 0.5rem;
  position: relative;
  background: var(--bg-darker);

  @include respond-to(tablet) {
    height: 16px;
  }

  @include respond-to(desktop) {
    height: 18px;
  }
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
