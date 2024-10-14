<script setup>
import DataTable2 from 'datatables.net-vue3';
import DataTable from "../../templates/DataTable.vue";
import DataTablesCore from 'datatables.net-dt';
import Elasticsearch from "../../../http/elasticsearch/elasticsearch";
DataTable2.use(DataTablesCore);

</script>

<template>
  <DataTable
      :data="(page, perPage)=> Elasticsearch.places(page, perPage).then(response=>{
          return response.ok ? response.result.hits().hitsAsData() : [];
      })"
      header="Ürünler"
      :deletable="{
        active: false
      }"
      :editable="{
        active: false
      }"
      :identifierKey="`id`"
      :definitions="[
          {
            header: 'ID',
            field: 'id'
          },
          {
            header: 'Ad',
            field: 'name'
          },
            {
            header: 'ADRES',
            field: 'address.longAddress'
          }
      ]"
  />

</template>

<style scoped>

</style>