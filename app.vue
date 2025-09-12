<template>
  <div id="app">
    <header>
      <NuxtLink to="/"><img src="/src/images/logo.png" alt="Logo" /></NuxtLink>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer>
      <p>&copy; 2025 Arnaud Brégère</p>
      <p>45, rue Lemercier 75017 Paris</p>
      <p>06.07.98.52.85</p>
      <a href="mailto:arnaud.bregere@gmail.com">arnaud.bregere@gmail.com</a>
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("App montée");
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  background: #000;
  color: #a9b7c0;
  text-align: center;
  overflow-x: hidden; /* Évite le scroll horizontal */
}

#app {
  margin: 0 auto;
  padding: 1rem;
  max-width: 100vw; /* Limite la largeur */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1rem;
  background: #000;
  color: #00ff00;
  border-bottom: 1px solid #ffa500;
  
  /* Responsive pour le header */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  img {
    max-width: 200px;
    height: auto;
    
    @media (max-width: 768px) {
      max-width: 150px;
    }
    
    @media (max-width: 480px) {
      max-width: 120px;
    }
  }
}

main {
  flex: 1;
  padding: 1rem;
  background: #000;
  width: 100%;
  box-sizing: border-box;
  
  /* Responsive pour le main */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem;
  }
}

footer {
  padding: 1rem;
  background: #000;
  color: #a9b7c0;
  border-top: 1px solid #ffa500;
  margin-top: auto;
  
  /* Responsive pour le footer */
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
  
  p, a {
    margin: 0.25rem 0;
    
    @media (max-width: 480px) {
      margin: 0.15rem 0;
    }
  }
  
  a {
    color: #00ff00;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px #00ff00;
    }
  }
}

/* Suppression du text-transform global */
/* Le text-transform: uppercase sera appliqué sélectivement dans les composants */

/* Styles globaux pour améliorer la lisibilité */
* {
  box-sizing: border-box;
}

/* Scroll personnalisé pour le thème */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: #00ff00;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00cc00;
}

/* Amélioration de la sélection de texte */
::selection {
  background: #00ff00;
  color: #000;
}

::-moz-selection {
  background: #00ff00;
  color: #000;
}
</style>