<script setup>
  const props = defineProps({
    sectionName: {
      type: String,
      required: true
    }
  });
</script>

<template>
  <div class="content-wrapper">
    <section :id="sectionName">

    </section>
    <section class="card">

    </section>
  </div>
</template>

<style scoped>

</style>