<script setup>
  const properties = defineProps({
    leftAddon: {
      type: Object,
      default: () => ({ id: 'basic-addon-left', text: '', background: ''})
    },
    rightAddon: {
      type: Object,
      default: () => ({ id: 'basic-addon-right', text: '', background: '' })
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'basic-input'
    },
    wrapping: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    }
  });
</script>

<template>
  <label class="form-label" :for="id">{{ label }}</label>
  <div :class="`input-group ${properties.size} mb-3 ${wrapping ? 'flex-nowrap' : ''}`">
    <span v-if="leftAddon" :class="`input-group-text ${leftAddon.background}`" :id="leftAddon.id">
      {{ leftAddon.text }}
    </span>
    <input type="text" class="form-control" :placeholder="placeholder" :id="id">
    <span v-if="rightAddon" :class="`input-group-text ${rightAddon.background}`">
      {{ rightAddon.text }}
    </span>
  </div>
</template>

<style scoped>

</style>