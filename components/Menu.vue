<template>
  <ul>
    <li><a href="#" @click.prevent="$emit('navigate', 'experience')"><i class="fas fa-briefcase"></i> EXPERIENCES PROFESSIONNELLES</a></li>
    <li><a href="#" @click.prevent="$emit('navigate', 'formation')"><i class="fas fa-graduation-cap"></i> FORMATION</a></li>
    <li><a href="#" @click.prevent="$emit('navigate', 'competences')"><i class="fas fa-tools"></i> COMPETENCES</a></li>
    <li><a href="#" @click.prevent="$emit('navigate', 'projets')"><i class="fas fa-project-diagram"></i> PROJETS</a></li>
    <li><a href="#" @click.prevent="$emit('navigate', 'contact')"><i class="fas fa-envelope"></i> CONTACT</a></li>
    <li><NuxtLink to="/calculatrice"><i class="fas fa-calculator"></i> calculatrice</NuxtLink></li>
    <li><NuxtLink to="/todolist"><i class="fas fa-list"></i> TodoList</NuxtLink></li>
    <li><a href="/pdf/arnaud_bregere.pdf" download="Arnaud-Bregere-CV.pdf" class="download-btn"><i class="fas fa-download"></i> Télécharger le CV</a></li>

  </ul>
</template>

<script setup lang="ts">
const emit = defineEmits(['navigate']);
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 0 auto;
  text-align: center;
  align-items: center;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.8rem;
  }

  li {
    display: flex;
    align-items: center;
    gap: 5px;
    @media (max-width: 768px) {
      width: 100%;
    }

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--neon-blue);
      border-radius: 4px;
      transition: all 0.3s ease;
      background: rgba(0, 153, 255, 0.05);
      color: var(--neon-blue);
      text-decoration: none;
      font-size: 14px;

      &:hover {
        background: rgba(0, 153, 255, 0.2);
        box-shadow: 0 0 10px var(--electric-cyan);
        transform: scale(1.05);
      }

      &.download-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: var(--neon-blue);
        color: var(--bg-deepest);
        border-radius: 4px;
        text-decoration: none;
        transition: 0.2s;
        font-weight: bold;

        &:hover {
          background-color: var(--bg-deepest);
          color: var(--neon-blue);
          border: 1px solid var(--electric-cyan);
          text-shadow: 0 0 5px var(--neon-blue);
        }
      }

      i {
        color: var(--neon-blue);
        font-size: 1.2rem;
      }
    }
  }
}
</style>