<script setup>
import {ref} from "vue";

const properties = defineProps(
    {
      languages: {
        type: Array,
        default: ()=>[
            {
              icon: require('../../../../assets/bootstrap/assets/images/country/turkiye.png'),
              name: 'Türkçe',
              active: true
            },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/canada.png'),
            name: 'English',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/catalan.png'),
            name: 'Catalan',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/french.png'),
            name: 'French',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/belize.png'),
            name: 'Belize',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/colombia.png'),
            name: 'Colombia',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/spanish.png'),
            name: 'Spanish',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/georgian.png'),
            name: 'Georgian',
            active: false
          },
          {
            icon: require('../../../../assets/bootstrap/assets/images/country/hindi.png'),
            name: 'Hindi',
            active: false
          }
        ]
      }
    }
);

const activeLanguage = ref(properties.languages.find(language=> language.active) ?? properties.languages[0]);

const setActiveLanguage = function (language){
  activeLanguage.value = language;
};

</script>

<template>
  <!-- Active Language -->
  <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" href="javascript:" data-bs-toggle="dropdown">
    <img :src="activeLanguage.icon" width="22" alt="" />
  </a>
  <!-- Active Language/ -->
  <!-- Language Dropdown List/ -->
  <ul v-if="languages.length" class="dropdown-menu dropdown-menu-end">
    <!-- Language Dropdown List Element -->
    <li v-for="language in languages" @click="setActiveLanguage(language)">
      <!-- Element Container -->
      <a class="dropdown-item d-flex align-items-center py-2" href="javascript:">
        <img :src="language.icon" width="20" :alt="language.alt ?? ''" />
        <span class="ms-2">
          {{ language.name }}
        </span>
      </a>
      <!-- Element Container/ -->
    </li>
    <!-- Language Dropdown List Element/ -->
  </ul>
  <!-- Language Dropdown List/ -->
</template>

<style scoped>
/** Silence is golden -**/
</style>