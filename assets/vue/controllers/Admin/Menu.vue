<script setup>
/**
 * @author Onur Kudret
 * @version 1.0.0
 */

import Table from "../../templates/Table.vue";
import {onMounted, ref} from "vue";

const data = ref([]);

onMounted(async () => {
  try {
    data.value = [];//extract(await menu.collection()); // Doğru atama
  } catch (error) {
    console.error('Veri yüklenirken hata:', error);
  } finally {
   // loading.value = false; // Yükleme durumu güncelleme
  }
});

</script>

<template>
  <Table
         :table-data="data"
         :identifier-key="`id`"
         :headers="['ID', 'Urunler', 'Adı', 'Sahipli mi', 'Değerlendirme']"
         :editable="{
        active: true,
        targetRoute: 'PlaceDetail',
        actionHeader: 'menüyü düzenle'
      }"
         :deletable="{
        active: true,
        targetRoute: 'PlaceDetail'
      }"
  />

</template>

<style scoped>

</style>