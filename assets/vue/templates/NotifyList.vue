<script setup>
import {ref} from "vue";
import Notification from "../components/Notification.vue";
import PerfectScrollbar from '../../bootstrap/assets/plugins/perfect-scrollbar/js/perfect-scrollbar';

const properties = defineProps({
  notificationService:{
    type: Function,
    required: true
  }
});

const notifications = ref([]);

window.onload=()=>new PerfectScrollbar('.notify-list');

</script>

<template>
  <a class="nav-link dropdown-toggle dropdown-toggle-nocaret position-relative" data-bs-auto-close="outside"
     data-bs-toggle="dropdown" href="javascript:;">
    <i class="material-icons-outlined">
      notifications
    </i>
    <span class="badge-notify">
      {{ notifications.length }}
    </span>
  </a>
  <div class="dropdown-menu dropdown-notify dropdown-menu-end shadow">
    <div class="px-3 py-1 d-flex align-items-center justify-content-between border-bottom">
      <h5 class="notiy-title mb-0">
        Bildirimler
      </h5>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle dropdown-toggle-nocaret option" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <span class="material-icons-outlined">
                  more_vert
                </span>
        </button>
        <div class="dropdown-menu dropdown-option dropdown-menu-end shadow">
          <div>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:;">
              <i class="material-icons-outlined fs-6">
                inventory_2
              </i>
              Arşivle
            </a>
          </div>
          <div>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:;">
              <i class="material-icons-outlined fs-6">
                done_all
              </i>
              Tümünü okundu olarak işaretle
            </a>
          </div>
          <div>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:;">
              <i class="material-icons-outlined fs-6">
                mic_off
              </i>
              Sessize Al
            </a>
          </div>
          <div>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:;">
              <i class="material-icons-outlined fs-6">
                grade
              </i>
              Yenilikler
            </a>
          </div>
          <div>
            <hr class="dropdown-divider">
          </div>
          <div>
            <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="javascript:;">
              <i class="material-icons-outlined fs-6">
                leaderboard
              </i>
              Raporlar
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="notify-list">
      <div v-for="notification in notifications">
        <Notification
          :image="notification.image"
          :content="notification.content"
          :date="notification.date"
          :header="notification.header"
        />
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>