<script setup>
import {ref} from "vue";

const checked = ref(false);

const properties = defineProps({
  radioType: {
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
    default: 'formRadio'
  }
});
</script>

<template>
  <div :class="`form-check ${properties.radioType}`">
    <input class="form-check-input" type="radio" name="flexRadioDefault" :id="properties.id">
    <label class="form-check-label" :for="properties.id">
      {{ properties.text }}
    </label>
  </div>
</template>