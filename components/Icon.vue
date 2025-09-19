<template>
  <img
    :src="`/images/svg/${name}.svg`"
    :alt="name"
    :width="width"
    :height="height"
  />
</template>

<script setup lang="ts">
    defineProps({
    name: {
        type: String,
        required: true
    },
    width: {
        type: [String, Number],
        default: 24
    },
    height: {
        type: [String, Number],
        default: 24
    }
    })
</script>
