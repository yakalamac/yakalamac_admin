<script setup>
  const properties = defineProps({
    user:{
      type: Object,
      required: true,
      properties: {
        firstName: {
          type: String,
          required: false,
          default: ()=> 'İsminizi güncelleyin'
        },
        lastName: {
          type: String,
          required: false
        },
        photo: {
          type: String,
          required: false,
          default: ()=> import('../../image/asset/no-profile-image.jpg')
        }
      }
    }
  });
</script>

<template>
  <a href="javascript:void(0);" class="dropdown-toggle dropdown-toggle-nocaret" data-bs-toggle="dropdown">
    <img :src="user.phot ?? require('../../image/asset/no-profile-image.jpg')"  class="rounded-circle p-1 border" width="45" height="45" alt="">
  </a>
  <div class="dropdown-menu dropdown-user dropdown-menu-end shadow">
    <a class="dropdown-item  gap-2 py-2" href="javascript:void(0);">
      <div class="text-center">
        <img :src="user.photo ?? require('../../image/asset/no-profile-image.jpg')"
             class="rounded-circle p-1 shadow mb-3" width="90" height="90" :alt="user.firstName ?? ''">
        <h5 class="user-name mb-0 fw-bold">
          Merhaba, {{user.firstName}}
        </h5>
      </div>
    </a>
    <hr class="dropdown-divider">
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0);">
      <i class="material-icons-outlined">
        person_outline
      </i>
      Profil
    </a>
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0);">
      <i class="material-icons-outlined">
        local_bar
      </i>
      Ayarlar
    </a>
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0);">
      <i class="material-icons-outlined">
        dashboard
      </i>
      Ana Sayfa
    </a>
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0);">
      <i class="material-icons-outlined">
        account_balance
      </i>
      Kazancım
    </a>
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0);">
      <i class="material-icons-outlined">
        cloud_download
      </i>
     Eğitimlerim
    </a>
    <hr class="dropdown-divider">
    <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:void(0)">
      <i class="material-icons-outlined">
        power_settings_new
      </i>
      Çıkış Yap
    </a>
  </div>
</template>

<style scoped>

</style>