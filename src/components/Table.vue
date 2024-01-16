<script setup lang="ts">
import { ref, defineProps } from "vue";

const props = defineProps(["columns", "data"]);
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            v-html="column.label"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td
            v-for="column in columns"
            :key="column.key"
            v-html="row[column.key]"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: none;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-size: 12px;
}
</style>
