<script setup>
import {useRoute} from "vue-router";
const currentRoute = useRoute();

const properties = defineProps(
    {
      name: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: false
      },
      route: {
        type: String,
        required: true
      }
    }
);
</script>

<template>
  <li :class="{'mm-show': currentRoute.name === route, 'mm-active': currentRoute.name === route }">
    <RouterLink :to="{name: route}" class="has-arrow">
      <div class="parent-icon">
        <i class="material-icons-outlined">
          {{ icon }}
        </i>
      </div>
      <div class="menu-title">
        {{ name }}
      </div>
    </RouterLink>
  </li>
</template>

<style scoped>

</style>