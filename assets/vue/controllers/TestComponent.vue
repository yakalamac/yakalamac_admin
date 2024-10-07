<script setup>

import DividedPage from "../templates/DividedPage.vue";
import PlaceCard from '../templates/card-pages/Place.vue';

</script>

<template>
  <DividedPage
    :cards="[
      {
        component: PlaceCard,
        pageName: 'İşletme Bilgileri',
        icon: 'store.ico',
        iconType: 'path'
      }
    ]"
  />
</template>

<style scoped>

</style>