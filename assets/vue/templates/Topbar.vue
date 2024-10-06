<template>
  <div class="bg-indigo-100 h-16 px-2 items-center py-1 flex-nowrap m-4 rounded-lg shadow:xl  text-black">
    <div class="flex items-center p-2 justify-between">
      <div class="text-lg font-bold">{{ selector(routeHeader.name) }}</div>
      <!-- Left Side -->
      <div class="flex items-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="cursor-pointer w-6 h-6" @click="handleIconClick">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="cursor-pointer w-6 h-6" @click="handleIconClick">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="cursor-pointer w-6 h-6" @click="handleIconClick">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="cursor-pointer w-6 h-6" @click="handleIconClick">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
        </svg>
        <!-- Left Side End -->

        <!-- Righ Side -->
        <div class="relative">
          <div class="flex items-center ml-2 cursor-pointer space-x-4" @click="toggleDropdown">
            <div class="font-semibold text-md flex flex-col">
              İsim Soyisim
              <div class="text-gray-600 text-sm overflow-hidden whitespace-nowrap text-ellipsis"
                   style="max-width: 150px;">
                İşletme Adı
              </div>
            </div>
            <div class="mx-2">
              <img src="https://via.placeholder.com/40" alt="Profil Resmi"
                   class="w-10 h-10 rounded-full" />
            </div>
          </div>
          <!-- Right Side End -->

          <!-- Profile Dropdown -->
          <div v-if="dropdownOpen"
               class="text-black absolute right-0 mt-3 w-48 bg-indigo-200 shadow-lg rounded-md z-10" @click.stop>
            <ul class="py-1">
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mağazalar</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">İşletme İsim</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profil</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">İşbirliği Teklifleri</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Erişim İzinleri</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sözleşme</li>
              <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Çıkış</li>
            </ul>
          </div>
        </div>
        <!-- Profile Dropdown End -->
      </div>
    </div>
  </div>
</template>

<script>

import { useRoute } from 'vue-router';

export default {
  data() {
    return {
      dropdownOpen: false,
      routeHeader: useRoute()
    };
  },
  methods: {
    handleIconClick() {
      alert('Icon clicked!');
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
    selector(name) {
      switch (name) {
        case 'Home':
          return "Anasayfa";

        case 'Product':
          return "Ürünler";

        case 'Place':
          return "İşletme";

        case 'Bulk':
          return "Toplu İşlemler";

        case 'Menu':
          return "Menüler";

        case 'OrderHistory':
          return "Sipariş Geçmiş";

        case 'Report':
          return "Raporlar";

        default: return 'Bilinmeyen';
      }
    }
  },
  mounted() {
    window.addEventListener('click', (event) => {
      // Eğer dropdown açık ve tıklama dropdown dışında ise kapat
      if (this.dropdownOpen && !event.target.closest('.relative')) {
        this.closeDropdown();
      }
    });

  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeDropdown);
  }
}
</script>

<style scoped>
/* Tailwind CSS ile ek bir stil eklemene gerek yok */
</style>