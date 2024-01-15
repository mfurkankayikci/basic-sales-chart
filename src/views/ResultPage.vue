<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useResultStore } from "../stores/result";
import { chartOptions } from "../data/chartOptions.ts";

const barChartOptions = ref(chartOptions);

const width = ref(document.querySelector(".vue-apexcharts")?.clientWidth);

const barChartSeries = ref([
  { name: "Profit", data: [] },
  { name: "FBA Sales", data: [] },
  { name: "FBM Sales", data: [] },
]);

onMounted(async () => {
  const userStore = useUserStore();
  const resultStore = useResultStore();

  const userInformation = userStore.getUser;
  const marketplace = userInformation.user.store[0].marketplaceName;
  const sellerId = userInformation.user.store[0].storeId;

  await resultStore.fetchDailySalesOverview({
    marketplace: marketplace,
    sellerId: sellerId,
    requestStatus: 0, // Gerekli parametreleri ekleyin
    day: 14, // Gerekli parametreleri ekleyin
    excludeYoYData: false, // Gerekli parametreleri ekleyin
  });

  console.log(resultStore);

  barChartOptions.value.xaxis.categories = resultStore.item.map(
    (item) => item.date
  );
  barChartSeries.value[0].data = resultStore.item.map((item) => item.profit);
  barChartSeries.value[1].data = resultStore.item.map((item) => item.fbaAmount);
  barChartSeries.value[2].data = resultStore.item.map((item) => item.fbmAmount);
});
</script>

<template>
  <apexchart
    type="bar"
    :options="barChartOptions"
    :series="barChartSeries"
    height="350"
    :width="width"
  />
</template>

<style>
.vue-apexcharts {
  width: 800px;
}
</style>
