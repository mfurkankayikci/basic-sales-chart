<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Table from "../components/Table.vue";
import { useUserStore } from "../stores/user";
import { useResultStore } from "../stores/result";
import { chartOptions } from "../data/chartOptions.ts";

const userStore = useUserStore();
const resultStore = useResultStore();

const barChartOptions = ref(chartOptions);

const width = ref(document.querySelector(".vue-apexcharts")?.clientWidth);
const filterDayRef = ref("7");
const barChartSeries = ref([
  { name: "Profit", data: [] },
  { name: "FBA Sales", data: [] },
  { name: "FBM Sales", data: [] },
]);
let tableColumns = ref([
  { key: "sku", label: "SKU" },
  { key: "productName", label: "Product Name" },
  {
    key: "detailFirst",
    label: `Tuesday<br />
          11-16-2022 <br />
          Sales/Units <br />
          Avg. Selling Price`,
  },
  {
    key: "detailSecond",
    label: `Wednesday<br />
          11-16-2022 <br />
          Sales/Units <br />
          Avg. Selling Price`,
  },
  {
    key: "skuRefundRate",
    label: ` SKU Refund Rate <br />
          <sup>(Last 60 days)</sup>`,
  },
]);

const tableData = ref([]);

const setChartValues = (data) => {
  barChartOptions.value.xaxis.categories = data.item.map((item) => item.date);
  barChartSeries.value[0].data = data.item.map((item) => item.profit);
  barChartSeries.value[1].data = data.item.map((item) => item.fbaAmount);
  barChartSeries.value[2].data = data.item.map((item) => item.fbmAmount);
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

const fetchSkuList = async (date) => {
  const userInformation = userStore.getUser;
  const marketplace = userInformation.user.store[0].marketplaceName;
  const sellerId = userInformation.user.store[0].storeId;

  try {
    await resultStore.fetchDailySalesSkuList({
      isDaysCompare: 0,
      marketplace: marketplace,
      pageNumber: 1,
      pageSize: 30,
      salesDate: date,
      salesDate2: ".",
      sellerId: sellerId,
    });

    tableData.value = resultStore.getSkuList;

    console.log(resultStore.getSkuList);
  } catch (error) {
    console.error("Error:", error);
  }
};

watch(filterDayRef, () => {
  initChart();
});

onMounted(async () => initChart());

const handleBarClick = (event, chartContext, config) => {
  const dataPointIndex = config.dataPointIndex;

  if (dataPointIndex !== -1) {
    const data = resultStore.getItemByIndex(dataPointIndex);
    fetchSkuList(data.date);
  }
};
</script>

<template>
  <div class="chart">
    <div class="chart-header">
      <h4 class="heading">Daily Sales</h4>

      <select v-model="filterDayRef">
        <option value="60">Last 60 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="14">Last 14 Days</option>
        <option value="7" selected>Last 7 Days</option>
      </select>
    </div>
    <div class="chart-content">
      <apexchart
        type="bar"
        :options="barChartOptions"
        :series="barChartSeries"
        height="350"
        :width="width"
        @click="handleBarClick"
      />
    </div>
    <div class="chart-details">
      <Table :columns="tableColumns" :data="tableData" />
    </div>
  </div>
</template>

<style>
.vue-apexcharts {
  width: 800px;
}
</style>
