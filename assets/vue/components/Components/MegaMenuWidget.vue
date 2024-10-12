<script setup>
  import Defaults from "../../constraints/Defaults";

  const properties = defineProps({
    header: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: false,
      default: ()=>''
    },
    image: {
      type: String,
      required: false,
      default: ()=>'#'
    },
    type: {
      type: Number,
      required: false,
      default: ()=>Defaults.MegaMenu.type.Card
    },
    strategy: {
      type: Number,
      default: ()=>3
    }
  });
</script>

<template>
  <div v-if="type === Defaults.MegaMenu.type.Card" class="col">
    <div class="card rounded-4 shadow-none border mb-0">
      <div class="card-body">
        <div class="d-flex align-items-start gap-3">
          <img :src="image" width="40" :alt="header">
          <div class="mega-menu-content">
            <h5>{{ header }}</h5>
            <p class="mb-0 f-14">
              {{ content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="type === Defaults.MegaMenu.type.App" class="col border-end">
    <div class="app-wrapper d-flex flex-column gap-2 text-center">
      <div class="app-icon">
        <img :src="image" width="36" :alt="header">
      </div>
      <div class="app-name">
        <p class="mb-0">{{ header }}</p>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>