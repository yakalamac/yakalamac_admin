<script setup>
import {useRoute} from "vue-router";
const currentRoute = useRoute();
const properties = defineProps(
    {
      groupName: {
        type: String,
        required: true
      },
      routes: {
        type: Array,
        required: false
      }
    }
);
</script>

<template>
  <li class="menu-label">
    {{ groupName }}
  </li>
  <li v-for="route in routes" :class="{'mm-active': currentRoute.name === route.route, 'mm-show': currentRoute.name === route.route}">
    <RouterLink :to="route.route">
      <div class="parent-icon">
        <i class="material-icons-outlined">
          {{ route.icon }}
        </i>
      </div>
      <div class="menu-title">
        {{ route.name }}
      </div>
    </RouterLink>
  </li>
</template>

<style scoped>

</style>