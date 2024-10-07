<script setup>
  const props = defineProps({
    cards: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <div class="content-wrapper p-4">
    <div class="content-body space-y-4">
      <!-- Card header ve icon kısmı -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="card in props.cards" :key="card.pageName" class="flex items-center bg-gray-100 w-full border p-4 rounded-lg shadow-md">

          <a v-if="card.iconType === 'path'" :href="card.icon" class="text-2xl mr-4 text-blue-500 hover:text-blue-700" target="_blank">
          </a>
          <i v-else :class="card.icon"></i> <!-- Iconu buraya ekledik -->
          <span class="text-lg font-semibold">{{ card.pageName ?? 'Default Page Name' }}</span>
        </div>
      </section>

      <!-- Card content kısmı -->
      <section class="card-content">
        <div v-for="card in props.cards" :key="card.pageName" class="flex h-full p-4 bg-white border rounded-lg shadow-sm">
          <!-- Card'a ait component'leri yükle -->
          <component :is="card.component" v-bind="card" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>

</style>