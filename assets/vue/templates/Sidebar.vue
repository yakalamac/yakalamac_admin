<script setup>
import {useRoute} from 'vue-router';
const route = useRoute();
</script>

<template>
  <!-- Sidebar -->
  <div class="w-64 bg-indigo-700 text-white flex flex-col h-screen">
    <!-- h-screen tüm ekranı kaplattı  w-64 genislik verdi-->
    <div class="flex items-center justify-center h-16 bg-indigo-800">
      <span class="text-xl font-bold">Yakalamaç</span>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-2">
      <RouterLink
          :to="{name: 'Home'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
          :class="{ 'bg-indigo-600': route.name === 'Home' }">
        Genel Görünüm
      </RouterLink>
      <RouterLink :to="{name: 'Place'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'Place' }" >
        İşletmeler
      </RouterLink>
      <RouterLink :to="{name: 'Product'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'Product' }">
        Ürünler
      </RouterLink>
      <RouterLink :to="{name: 'Menu'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'Menu' }">
        Menüler
      </RouterLink>
      <RouterLink :to="{name: 'Bulk'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'Bulk' }">
        Toplu İşlemler
      </RouterLink>
      <RouterLink :to="{name: 'OrderHistory'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'OrderHistory' }">
        Sipariş Geçmişi
      </RouterLink>
      <RouterLink :to="{name: 'Report'}" class="block py-2 px-4 rounded-lg hover:bg-indigo-600"
                  :class="{ 'bg-indigo-600': route.name === 'Report' }">
        Raporlar
      </RouterLink>
    </nav>
    <div class="px-4 py-4 border-t border-indigo-600">
      <h3 class="text-xs font-bold uppercase">Your Teams</h3>
      <a href="#" class="block py-2 px-4 rounded-lg hover:bg-indigo-600 mt-2">Heroicons</a>
      <a href="#" class="block py-2 px-4 rounded-lg hover:bg-indigo-600">Tailwind Labs</a>
      <a href="#" class="block py-2 px-4 rounded-lg hover:bg-indigo-600">Workcation</a>
    </div>
  </div>
</template>

<style scoped>

</style>