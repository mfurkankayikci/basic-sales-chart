<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Section from "../components/Section.vue";
import Table from "../components/Table.vue";
import { useUserStore } from "../stores/user";
import { useResultStore } from "../stores/result";
import { chartOptions } from "../data/chartOptions.ts";
import {
  ITableHeaderItem,
  ISkuParams,
  ISalesItem,
  IUserInformation,
} from "../types";
import { log } from "console";

const userStore = useUserStore();
const resultStore = useResultStore();
const userInformation = userStore.getUser as IUserInformation;
const marketplace = userInformation.marketplace;
const sellerId = userInformation.sellerId;
const isChartDataFetched = ref(false);
const filterDayRef = ref("7");
const tableColumns = ref();
const tableData = ref();
const barChartOptions = ref(chartOptions);
const width = ref(document.querySelector(".vue-apexcharts")?.clientWidth);
const barChartSeries = ref([
  { name: "Profit", data: [] },
  { name: "FBA Sales", data: [] },
  { name: "FBM Sales", data: [] },
]);
const setChartValues = (data: any) => {
  barChartOptions.value.xaxis.categories = data.map(
    (item: ISalesItem) => item.date
  );
  barChartSeries.value[0].data = data.map((item: ISalesItem) => item.profit);
  barChartSeries.value[1].data = data.map((item: ISalesItem) => item.fbaAmount);
  barChartSeries.value[2].data = data.map((item: ISalesItem) => item.fbmAmount);
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

    setChartValues(resultStore.getSalesItems);
    isChartDataFetched.value = true;
  } catch (error) {
    console.error("Error:", error);
  }
};
const fetchSkuList = async (payload: ISkuParams) => {
  try {
    await resultStore.fetchDailySalesSkuList(payload);

    const skuList = resultStore.getSkuList;

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
    ] as Array<ITableHeaderItem>;

    const tableBodyData = skuList.map((item: any) => {
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
const handleBarClick = (
  event: MouseEvent,
  chartContext: any,
  config: any
): void => {
  const dataPointIndex: number = config.dataPointIndex;

  if (dataPointIndex !== -1) {
    if (resultStore.getSelectedSalesItemDatesCount === 2) {
      resultStore.resetSelectedItemDates();
    }

    resultStore.setSelectedItemDate(dataPointIndex);

    const payload = {
      isDaysCompare: resultStore.getSelectedSalesItemDatesCount > 1 ? 1 : 0,
      marketplace: marketplace,
      pageNumber: 1,
      pageSize: 30,
      salesDate: resultStore.getSelectedSalesItemDates[0]?.date,
      salesDate2: resultStore.getSelectedSalesItemDates[1]?.date || ".",
      sellerId: sellerId,
    } as ISkuParams;

    fetchSkuList(payload);
  }
};

watch(filterDayRef, () => {
  initChart();
});

onMounted(async () => initChart());
</script>

<template>
  <Section class="section-chart">
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
          v-if="isChartDataFetched"
          type="bar"
          :options="barChartOptions"
          :series="barChartSeries"
          height="350"
          :width="width"
          @click="handleBarClick"
        />
      </div>
    </div>
  </Section>

  <Section class="section-table">
    <Table :columns="tableColumns" :data="tableData" />
  </Section>
</template>

<style lang="scss">
@import "../styles/chart.scss";
</style>
