<script setup>

const props = defineProps({
  pageName: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

</script>

<template>
    <a>
      Test Place Something {{data}}
    </a>

</template>

<style scoped>

</style>