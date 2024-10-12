<script setup>
const properties = defineProps({
  header:{
    type: String,
  },
  content: {
    type: String
  },
  image: {
    type: String
  },
  date: {
    type: String
  }
});
</script>

<template>
  <a class="dropdown-item border-bottom py-2" href="javascript:;">
    <div class="d-flex align-items-center gap-3">
      <div class="">
        <img :src="image" class="rounded-circle" width="45" height="45" alt="">
      </div>
      <div class="">
        <h5 class="notify-title">{{header }}</h5>
        <p class="mb-0 notify-desc">{{content }}</p>
        <p class="mb-0 notify-time">{{ date }}</p>
      </div>
      <div class="notify-close position-absolute end-0 me-3">
        <i class="material-icons-outlined fs-6">close</i>
      </div>
    </div>
  </a>
</template>

<style scoped>

</style>