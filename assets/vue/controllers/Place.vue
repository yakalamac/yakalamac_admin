  <script setup>
  import Table from "../templates/Table.vue";

  // Örnek veri
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
    { id: 3, name: 'Michael Johnson', email: 'michael@example.com', status: 'Inactive' },
    { id: 4, name: 'Chris Evans', email: 'chris@example.com', status: 'Active' },
    // Daha fazla veri ekleyebilirsiniz...
  ];

  </script>

  <template>
    <Table
        :tableData="tableData"
        :headers="['ID', 'Name', 'Email', 'Status']"
        :identifierKey="`id`"
        :editable="{
          active: true,
          targetRoute: 'PlaceDetail',
          actionName: 'Sil',
          actionHeader: 'düzenle'
        }"
        :deletable="{
          active: true,
          targetRoute: 'PlaceDetail'
        }"
    />
  </template>

  <style scoped>
  /* İsteğe bağlı stil ekleyebilirsiniz */
  </style>
