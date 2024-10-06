<script setup>

</script>

<template>
  <div class="flex flex-col items-center content-center justify-center justify-self-center origin-center w-full pt-10"> <!-- Tam genişlik ve üstten boşluk -->
    <h1 class="text-4xl text-orange-600 font-bold text-center">404 - Sayfa Bulunamadı</h1>
    <p class="text-2xl mb-4 text-center">Aradığınız sayfa mevcut değil.</p>
    <router-link to="/">
      <a class="text-black hover:underline">Anasayfaya Dön</a>
    </router-link>
  </div>
  <img src="https://cdn.yaka.la/assets/SearchAssets/uzgunkiz2.png" alt="not-found" class="mt-4 max-w-3xl max-h-96 object-cover mx-auto">
</template>

<style scoped>

</style>