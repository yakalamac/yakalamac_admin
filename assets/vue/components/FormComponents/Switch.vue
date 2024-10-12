<script setup>
import {ref} from "vue";

const checked = ref(false);

const properties = defineProps({
  switchType: {
    type: String,
    required: false,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: false,
    default: 'switch'
  }
});
</script>

<template>
        <div :class="`form-check form-switch ${properties.switchType}`">
          <input class="form-check-input" type="checkbox" role="switch" :id="properties.id">
          <label class="form-check-label" for="flexSwitchCheckDefault1">{{ properties.text }}</label>
        </div>
</template>

<style scoped>

</style>