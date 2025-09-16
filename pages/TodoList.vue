<template>
  <div>
    <TodoList />
  </div>
</template>

<script setup>
// Métadonnées de la page
useHead({
  title: 'TodoList - Arnaud Brégère',
  meta: [
    { name: 'description', content: 'Application TodoList avec fonctionnalités CRUD complètes' }
  ]
})
</script>

<style scoped>
div {
  background: #000;
  min-height: 100vh;
}
</style>