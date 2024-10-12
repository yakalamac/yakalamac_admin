<script setup>
import {ref} from "vue";

const properties = defineProps({
  languages: {
    type: Array,
    default: ()=>[
      {
        icon: '#',
        name: 'Türkçe',
        active: true
      }
    ]
  }
});

const activeLanguage = ref(properties.languages.find(language=> language.active) ?? properties.languages[0]);

const setActiveLanguage = function (language){
  activeLanguage.value = language;
};
</script>

<template>
  <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:;" data-bs-toggle="dropdown">
    <img :src="activeLanguage.icon" width="22" alt="">
  </a>
  <ul v-if="languages.length" class="dropdown-menu dropdown-menu-end">
    <li v-for="language in languages" @click="setActiveLanguage(language)">
      <a class="dropdown-item d-flex align-items-center py-2" href="javascript:;">
        <img :src="language.icon" width="20" :alt="language.alt ?? ''">
        <span class="ms-2">
                {{ language.name }}
              </span>
      </a>
    </li>
  </ul>
</template>

<style scoped>

</style>