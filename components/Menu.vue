<template>
  <ul>
    <li>█ <a href="#" @click.prevent="$emit('navigate', 'experience')">EXPERIENCES PROFESSIONNELLES</a></li>
    <li>█ <a href="#" @click.prevent="$emit('navigate', 'formation')">FORMATION</a></li>
    <li>█ <a href="#" @click.prevent="$emit('navigate', 'competences')">COMPETENCES</a></li>
    <li>█ <a href="#" @click.prevent="$emit('navigate', 'projets')">PROJETS</a></li>
    <li>█ <a href="#" @click.prevent="$emit('navigate', 'contact')">CONTACT</a></li>
    <li>█ <a 
      href="/pdf/arnaud_bregere.pdf" 
      download="Arnaud-Bregere-CV.pdf"
      class="download-btn"
    >
      Télécharger le CV en PDF
    </a></li>
  </ul>
</template>

<script setup lang="ts">
// Définir l'émission d'événements
const emit = defineEmits(['navigate']);
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap; // Amélioration responsive
  gap: 1.5rem; // Réduit pour mobile
  margin: 0 auto;
  text-align: center;
  align-items: center;
  padding: 0;
  
  // Responsive pour mobile
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
  
  li {
    // Responsive pour les éléments
    @media (max-width: 768px) {
      width: 100%;
    }
    
    a {
      color: #00ff00;
      text-decoration: none;
      padding: 0.25rem 0.5rem;
      border-radius: 2px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba(0, 255, 0, 0.1);
        text-shadow: 0 0 5px #00ff00;
      }
      
      &.download-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #00ff00;
        color: #000;
        border-radius: 4px;
        text-decoration: none;
        transition: 0.2s;
        font-weight: bold;
        
        &:hover {
          background-color: #000;
          color: #00ff00;
          border: 1px solid #00ff00;
          text-shadow: 0 0 5px #00ff00;
        }
      }
    }
  }
}
</style>