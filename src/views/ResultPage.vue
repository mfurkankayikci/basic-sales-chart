<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "../stores/user";
import { useResultStore } from "../stores/result";
import { chartOptions } from "../data/chartOptions.ts";
import { log } from "console";

const userStore = useUserStore();
const resultStore = useResultStore();

const barChartOptions = ref(chartOptions);

const width = ref(document.querySelector(".vue-apexcharts")?.clientWidth);
const filterDayRef = ref("30");
const barChartSeries = ref([
  { name: "Profit", data: [] },
  { name: "FBA Sales", data: [] },
  { name: "FBM Sales", data: [] },
]);

const setChartValues = (data: object) => {
  barChartOptions.value.xaxis.categories = data.item.map(
    (item: object) => item.date
  );
  barChartSeries.value[0].data = data.item.map((item: object) => item.profit);
  barChartSeries.value[1].data = data.item.map(
    (item: object) => item.fbaAmount
  );
  barChartSeries.value[2].data = data.item.map(
    (item: object) => item.fbmAmount
  );
};

const initChart = async () => {
  const userInformation = userStore.getUser;
  const marketplace = userInformation.user.store[0].marketplaceName;
  const sellerId = userInformation.user.store[0].storeId;

  try {
    await resultStore.fetchDailySalesOverview({
      marketplace: marketplace,
      sellerId: sellerId,
      requestStatus: 0,
      day: parseInt(filterDayRef.value, 10),
      excludeYoYData: false,
    });

    setChartValues(resultStore);
  } catch (error) {
    console.error("Error:", error);
  }
};

watch(filterDayRef, () => {
  initChart();
});

onMounted(async () => initChart());
</script>

<template>
  <div class="chart">
    <div class="chart-header">
      <h4 class="heading">Daily Sales</h4>

      <select v-model="filterDayRef">
        <option value="60">Last 60 Days</option>
        <option value="30" selected>Last 30 Days</option>
        <option value="14">Last 14 Days</option>
        <option value="7">Last 7 Days</option>
      </select>
    </div>
    <div class="chart-content"></div>
    <div class="chart-details"></div>
  </div>

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
