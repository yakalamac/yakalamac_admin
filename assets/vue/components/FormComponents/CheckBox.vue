<script setup>
import {ref} from "vue";

const checked = ref(false);

const properties = defineProps({
  checkboxType: {
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
    default: 'checkbox'
  }
});
</script>

<template>
  <div :class="`form-check ${properties.checkboxType}`">
    <input class="form-check-input" type="checkbox" value="" :id="properties.id">
    <label class="form-check-label" :for="properties.id">
      {{ properties.text }}
    </label>
  </div>
</template>