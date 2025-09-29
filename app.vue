<template>
  <div id="app">
    <LayoutAppBackground />
    <LayoutAppHeader/>
    <main class="modern-main">
      <div class="content-wrapper">
        <NuxtPage />
      </div>
    </main>
    <LayoutAppFooter/>
  </div>
</template>

<script setup lang="ts">
import { seoConfig } from '~/utils/seoConfig';
import { useScrollEffects } from '~/composables/useAnimations';

const { initScrollEffects, destroyScrollEffects } = useScrollEffects();

useHead({
  title: seoConfig.title,
  meta: seoConfig.meta,
  link: seoConfig.link,
  script: seoConfig.script,
})
onMounted(() => {
  initScrollEffects();
});

onBeforeUnmount(() => {
  destroyScrollEffects();
});
</script>

<style lang="scss">
@use "/assets/scss/base.scss";
@use "/assets/scss/animations.scss";

.modern-main {
  flex: 1;
  position: relative;
  margin-top: 10rem;
  padding: 2rem 0;
  z-index: 1;
}
.content-wrapper {
  max-width: 180rem;
  margin: 0 auto;
  padding: 0 1rem;
}

::-webkit-scrollbar {
  width: 1.2rem;
}
::-webkit-scrollbar-track {
  background: var(--bg-darker);
  border-radius: .8rem;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, var(--neon-blue), var(--electric-cyan));
  border-radius: .8rem;
  border: .2rem solid var(--bg-darker);
  box-shadow: inset 0 0 .8rem rgba(0, 153, 255, 0.5);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, var(--electric-cyan), var(--accent-purple));
  box-shadow: inset 0 0 1.2rem rgba(0, 212, 255, 0.7);
}

::selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}
::-moz-selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}

@include respond-to(desktop) {
  .content-wrapper {
    padding: 0 1rem;
  }
}

@include respond-to(tablet) {
  .modern-main {
    margin-top: 11rem;
    padding: 1.5rem 0;
  }
  .content-wrapper {
    padding: 0 0.8rem;
  }
}

@include respond-to(mobile) {
  .content-wrapper {
    padding: 0 0.5rem;
  }
}
</style>

