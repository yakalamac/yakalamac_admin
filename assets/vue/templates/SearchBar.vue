<script setup>
import {ref, onMounted} from "vue";
const properties = defineProps({
  user: {
    type: Object,
    required: true
  }
});
import PerfectScrollbar from '../../bootstrap/assets/plugins/perfect-scrollbar/js/perfect-scrollbar';
const searchPopup = ref(null);
const searchClose = ref(null);
const searchControlClick=function (){
  searchPopup.value.classList.add('d-block');
  searchClose.value.classList.add('d-block');
};

const searchCloseClick=function (){
  searchPopup.value.classList.remove('d-block');
  searchClose.value.classList.remove('d-block');
};

onMounted(()=>{
  searchPopup.value = document.querySelector('.search-popup');
  searchClose.value = document.querySelector('.search-close');
  new PerfectScrollbar('.search-content', {

  });
});
</script>

<template>
  <div class="search-bar flex-grow-1">
    <div class="position-relative">
      <input class="form-control rounded-5 px-5 search-control d-lg-block d-none"
             @click="searchControlClick" type="text" placeholder="Search">
      <span
          class="material-icons-outlined position-absolute d-lg-block d-none ms-3 translate-middle-y start-0 top-50">
        search
      </span>
      <span @click="searchCloseClick"
          class="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50 search-close">
        close
      </span>
      <div class="search-popup p-3">
        <div class="card rounded-4 overflow-hidden">
          <div class="card-header d-lg-none">
            <div class="position-relative">
              <input class="form-control rounded-5 px-5 mobile-search-control" type="text" placeholder="Search">
              <span
                  class="material-icons-outlined position-absolute ms-3 translate-middle-y start-0 top-50">
                search
              </span>
              <span
                  class="material-icons-outlined position-absolute me-3 translate-middle-y end-0 top-50 mobile-search-close">
                close
              </span>
            </div>
          </div>
          <div class="card-body search-content">
            <div v-if="user.recentSearches">
              <p class="search-title">Son Aramalar</p>
              <div class="d-flex align-items-start flex-wrap gap-2 kewords-wrapper">
                <a v-for="recentSearch in user.recentSearches" href="javascript:;" class="kewords">
                  <span>{{ recentSearch }}</span>
                  <i class="material-icons-outlined fs-6">search</i>
                </a>
              </div>
            </div>
            <hr>
            <p class="search-title d-flex">
              <i class="material-icons-outlined fs-5">play_circle</i>
              &nbsp;
              Eğitimler
            </p>

            <div class="search-list d-flex flex-column gap-2">

              <div class="search-list-item d-flex align-items-center gap-3">
                <div class="list-icon">
                  <!-- @see https://fonts.google.com/icons?selected=Material+Icons:paid:&icon.size=24&icon.color=%235f6368 -->
                  <i class="material-icons-outlined fs-5">trending_up</i>
                </div>
                <div class="">
                  <h5 class="mb-0 search-list-title ">Ürün Satışları</h5>
                </div>
              </div>

              <div class="search-list-item d-flex align-items-center gap-3">
                <div class="list-icon">
                  <i class="material-icons-outlined fs-5">store</i>
                </div>
                <div class="">
                  <h5 class="mb-0 search-list-title">Kampanya Yönetimi</h5>
                </div>
              </div>

              <div class="search-list-item d-flex align-items-center gap-3">
                <div class="list-icon">
                  <i class="material-icons-outlined fs-5">campaign</i>
                </div>
                <div class="">
                  <h5 class="mb-0 search-list-title">Müşteri Duyuruları</h5>
                </div>
              </div>

            </div>

            <hr>
            <p v-if="user.subusers" class="search-title d-flex">
              <i class="material-icons-outlined fs-5">group</i>
              &nbsp;
              Kullanıcılar
            </p>

            <div v-for="subuser in user.subusers" class="search-list d-flex flex-column gap-2">
              <div class="search-list-item d-flex align-items-center gap-3">
                <div class="memmber-img">
                  <img :src="subuser.photo?.path ?? '#'" width="32" height="32" class="rounded-circle" :alt="subuser.photo?.alt ?? ''">
                </div>
                <div class="">
                  <h5 class="mb-0 search-list-title ">{{ subuser.name }}</h5>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer text-center bg-transparent">
            <a href="javascript:;" class="btn w-100">Tüm Sonuçları Listele</a>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>