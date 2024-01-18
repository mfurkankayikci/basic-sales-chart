<script setup lang="ts">
import { defineProps } from "vue";

defineProps(["columns", "data"]);
</script>

<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            v-html="column.label"
            :key="column.key"
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

<style lang="scss" scoped>
@import "../styles/table.scss";
</style>
