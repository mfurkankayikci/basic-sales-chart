<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Table from "../components/Table.vue";
import { useUserStore } from "../stores/user";
import { useResultStore } from "../stores/result";
import { chartOptions } from "../data/chartOptions.ts";
import { log } from "console";

const userStore = useUserStore();
const resultStore = useResultStore();

const userInformation = userStore.getUser;
const marketplace = userInformation.user.store[0].marketplaceName;
const sellerId = userInformation.user.store[0].storeId;

const isChartDataFetched = ref(false);
const filterDayRef = ref("6");

const barChartOptions = ref(chartOptions);
const width = ref(document.querySelector(".vue-apexcharts")?.clientWidth);
const barChartSeries = ref([
  { name: "Profit", data: [] },
  { name: "FBA Sales", data: [] },
  { name: "FBM Sales", data: [] },
]);

const tableColumns = ref([]);
const tableData = ref([]);

const setChartValues = (data) => {
  barChartOptions.value.xaxis.categories = data.map((item) => item.date);
  barChartSeries.value[0].data = data.map((item) => item.profit);
  barChartSeries.value[1].data = data.map((item) => item.fbaAmount);
  barChartSeries.value[2].data = data.map((item) => item.fbmAmount);
};

const initChart = async () => {
  try {
    await resultStore.fetchDailySalesOverview({
      marketplace: marketplace,
      sellerId: sellerId,
      requestStatus: 0,
      day: parseInt(filterDayRef.value, 10),
      excludeYoYData: false,
    });

    setChartValues(resultStore.getItems);
    isChartDataFetched.value = true;
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchSkuList = async (payload) => {
  try {
    await resultStore.fetchDailySalesSkuList(payload);

    const skuList = resultStore.getSkuList;
    console.log(skuList);

    const tableHeaderData = [
      { key: "sku", label: "SKU" },
      { key: "productName", label: "Product Name" },
      {
        key: "detailFirst",
        label: `${skuList[0].selectedDate} <br /> Sales/Units <br />Avg. Selling Price`,
      },
      {
        key: "detailSecond",
        label: `${skuList[0].selectedDate2} <br /> Sales/Units <br />Avg. Selling Price`,
      },
      {
        key: "skuRefundRate",
        label: `SKU Refund Rate <br /><sup>(Last ${filterDayRef.value} days)</sup>`,
      },
    ];

    const tableBodyData = skuList.map((item) => {
      return {
        sku: item.sku,
        productName: item.productName,
        detailFirst: `${item.amount} / ${item.qty}<br/> ${
          item.amount / item.qty
        }`,
        detailSecond: `${item.amount2} / ${item.qty2}<br/> ${
          item.amount2 / item.qty2
        }`,
        skuRefundRate: "",
      };
    });

    tableColumns.value = tableHeaderData;

    tableData.value = tableBodyData;
  } catch (error) {
    console.error("Error:", error);
  }
};

watch(filterDayRef, () => {
  initChart();
});

onMounted(async () => initChart());

const handleBarClick = (
  event: MouseEvent,
  chartContext: any,
  config: any
): void => {
  const dataPointIndex: number = config.dataPointIndex;

  if (dataPointIndex !== -1) {
    if (resultStore.getSelectedItemDatesCount === 2) {
      resultStore.resetSelectedItemDates();
    }

    resultStore.setSelectedItemDate(dataPointIndex);

    const payload = {
      isDaysCompare: resultStore.getSelectedItemDatesCount > 1 ? 1 : 0,
      marketplace: marketplace,
      pageNumber: 1,
      pageSize: 30,
      salesDate: resultStore.getSelectedItemDates[0]?.date,
      salesDate2: resultStore.getSelectedItemDates[1]?.date || ".",
      sellerId: sellerId,
    };

    fetchSkuList(payload);
  }
};
</script>

<template>
  <div class="chart">
    <div class="chart-header">
      <h4 class="heading">Daily Sales</h4>

      <select v-model="filterDayRef">
        <option value="59">Last 60 Days</option>
        <option value="29">Last 30 Days</option>
        <option value="13">Last 14 Days</option>
        <option value="6" selected>Last 7 Days</option>
      </select>
    </div>
    <div class="chart-content">
      <apexchart
        v-if="isChartDataFetched"
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
