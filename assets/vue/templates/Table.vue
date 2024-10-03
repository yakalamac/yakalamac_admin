<script setup>
import {defineProps} from 'vue';
//import { ref, computed } from 'vue';
import UtilConstraints from "../constraints/UtilConstraints";

// Dışarıdan gelecek veriler ve sayfalama ayarları için props tanımı
const props = defineProps(
    {
      tableData: Array,
      pagination: {
        type: Object,
        default:
            ()=>({
              perPage: UtilConstraints.TABLE_PAGINATION_LENGTH,
              paginationType: UtilConstraints.PaginationTypes.Page
            })
      },
      headers : Array,
      editable : {
        active : Boolean,
        targetRoute : String,
        actionName: String,
        actionHeader: String
      },
      identifierKey: String,
      deletable: {
        active : Boolean,
        targetRoute : String,
        actionName: String,
        actionHeader: String
      },
      customization : {
        row : [
          {
            bgColor: 'bg-white',
            textColor: 'text-gray-900',
            hoverBgColor: 'hover:bg-gray-200',
          },
        ],
        header: {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          uppercase: true,
        },
        ceil : {
          headerName:String,
          script: Function,
        }
      }
    }
    );
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th v-for="header in props.headers" scope="col" class="px-6 py-3">
          {{ header }}
        </th>
        <th v-if="props.editable.active" class="px-6 py-3">
          {{ props.editable.actionHeader ? props.editable.actionHeader.toUpperCase() : 'ACTION' }}
        </th>
        <th v-if="props.deletable.active" class="px-6 py-3">
          {{ props.deletable.actionHeader ? props.deletable.actionHeader.toUpperCase() : 'ACTION' }}
        </th>
      </tr>
      </thead>
      <tbody>
          <tr v-for="d in props.tableData" :id="d[props.identifierKey]" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td v-for="key in Object.keys(d)" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ d[key] }}
            </td>
            <td v-if="props.editable.active && props.editable.targetRoute" class="px-6 py-4">
              <RouterLink :to="{
                name: props.editable.targetRoute,
                params: { id: d[props.identifierKey] }
              }" class="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium rounded-md px-2 py-1 transition duration-200 ease-in-out">
                {{ props.editable.actionName ?? 'Edit' }}
              </RouterLink>
            </td>

            <td v-if="props.deletable.active && props.deletable.targetRoute" class="px-6 py-4">
              <RouterLink
                  :to="{
                name: props.deletable.targetRoute,
                params: { id: d[props.identifierKey] }
              }"
                  class="bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium rounded-md px-2 py-1 transition duration-200 ease-in-out">
                {{ props.deletable.actionName ?? 'Delete' }}
              </RouterLink>
            </td>
          </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/*
bg-red-600: Kırmızı bir arka plan rengi sağlar.
text-white: Yazının beyaz olmasını sağlar.
hover:bg-red-700: Üzerine gelindiğinde arka plan renginin koyulaşmasını sağlar.
focus:outline-none: Buton seçildiğinde dış kenar çizgisinin olmamasını sağlar.
focus:ring-2: Buton odaklandığında bir kenar çerçevesi ekler.
focus:ring-red-500: Kenar çerçevesinin rengini kırmızı yapar.
focus:ring-opacity-50: Kenar çerçevesinin opaklığını ayarlar.
font-medium: Yazı kalınlığını ayarlar.
rounded-md: Buton köşelerini yuvarlar.
px-2 py-1: Yatay ve dikey iç boşluk verir.
transition duration-200 ease-in-out: Geçiş animasyonu ekler.
 */
</style>