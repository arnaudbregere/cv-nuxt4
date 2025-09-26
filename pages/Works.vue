<template>
    <h2>WORKS</h2>
    <section class="works-container">

        <article class="works" 
            v-for="(item, index) in workItems" 
            :key="item.title + index"
        >
            <NuxtLink :to="item.link" class="work-link">
                <Icon :name="item.icon" :width="48" :height="48" />
                <h3>{{ item.title }}</h3>
                <Tooltip :text="item.text">
                    <Icon name="info" :width="24" :height="24" />
                </Tooltip>
            </NuxtLink>
        </article>
    </section>
</template>
<script setup lang="ts">

const workItems = [
  {
    title: 'Calculatrice',
    link: '/calculatrice',
    icon: 'calculator',
    info: 'info',
    text: 'Une calculatrice simple avec les opérations de base (addition, soustraction, multiplication, division).'
  },
  {
    title: 'Todo List',
    link: '/todolist',
    icon: 'todolist',
    info: 'info',
    text: 'Une application de gestion de tâches permettant d\'ajouter, de supprimer et de marquer des tâches comme terminées.'
  } 
]
</script>
<style scoped lang="scss">

h2 {
    color: var(--bright-white);
    text-align: center;
    font-size: 24px;
}
.works-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;

    @include respond-to(desktop) {
        flex-direction: row;
    }
}
.works {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 12rem;
    height: 12rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: var(--glass-bg);
    backdrop-filter: blur(1rem);
    border: .2rem solid var(--border-glow);
    border-radius: 1rem;
    padding: 1.2rem;
    margin : 2rem auto;
        &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 2rem var(--neon-blue);
        h2{
            color: var(--neon-blue);
            text-shadow: 0 0 1rem var(--neon-blue);
        } 
    }
}

.work-link {
    display: flex; 
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--bright-white);
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
}
</style>