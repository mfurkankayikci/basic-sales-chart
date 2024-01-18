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
const width = ref(document.querySelector(".chart")?.clientWidth);
const showTable = ref(false);
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
    const tableHeaderData: Array<ITableHeaderItem> = [
      { key: "sku", label: "SKU" },
      { key: "productName", label: "Product Name" },
      {
        key: "detailFirst",
        label: `${skuList[0].selectedDate} <br /> Sales/Units <br />Avg. Selling Price`,
      },
    ];
    const tableBodyData = skuList.map((item: any) => {
      return {
        sku: item.sku,
        productName: item.productName,
        detailFirst: `${resultStore.getCurrency}${parseFloat(
          item.amount
        ).toFixed(2)} / ${parseFloat(item.qty).toFixed(2)}<br/> ${
          resultStore.getCurrency
        }${parseFloat(item.amount / item.qty).toFixed(2)}`,
        detailSecond: `${resultStore.getCurrency}${parseFloat(
          item.amount2
        ).toFixed(2)} / ${parseFloat(item.qty2).toFixed(2)}<br/> ${
          resultStore.getCurrency
        }${parseFloat(item.amount2 / item.qty2).toFixed(2)}`,
        skuRefundRate: `${item.skuRefundRate}%`,
      };
    });

    if (resultStore.getSelectedSalesItemDatesCount >= 2) {
      tableHeaderData.push({
        key: "detailSecond",
        label: `${skuList[0].selectedDate2} <br /> Sales/Units <br />Avg. Selling Price`,
      });
    }

    tableHeaderData.push({
      key: "skuRefundRate",
      label: `SKU Refund Rate <br /><sup>(Last ${filterDayRef.value} days)</sup>`,
    });
    tableColumns.value = tableHeaderData;
    tableData.value = tableBodyData;
    showTable.value = true;
  } catch (error) {
    console.error("Error:", error);
  }
};

const setChartBarColors = (color: string, index: number) => {
  const seriesSvg = document.querySelector(
    ".apexcharts-bar-series.apexcharts-plot-series"
  );
  const gProfit =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="Profit"] path`
    ) || [];
  const gFBAxSales =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="FBAxSales"] path`
    ) || [];
  const gFBMxSales =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="FBMxSales"] path`
    ) || [];

  gProfit[index].setAttribute("fill", color);
  gFBAxSales[index].setAttribute("fill", color);
  gFBMxSales[index].setAttribute("fill", color);
};

const resetChartBarColors = () => {
  const seriesSvg = document.querySelector(
    ".apexcharts-bar-series.apexcharts-plot-series"
  );
  const gProfit =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="Profit"] path`
    ) || [];
  const gFBAxSales =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="FBAxSales"] path`
    ) || [];
  const gFBMxSales =
    seriesSvg?.querySelectorAll(
      `.apexcharts-series[seriesName="FBMxSales"] path`
    ) || [];

  gProfit?.forEach((g) => g.setAttribute("fill", "rgba(0,143,251,0.85)"));
  gFBAxSales?.forEach((g) => g.setAttribute("fill", "rgba(0,227,150,0.85)"));
  gFBMxSales?.forEach((g) => g.setAttribute("fill", "rgba(254,176,25,0.85)"));
};

const handleBarClick = (
  _event: MouseEvent,
  _chartContext: any,
  config: any
): void => {
  const dataPointIndex: number = config.dataPointIndex;

  if (dataPointIndex !== -1) {
    if (resultStore.getSelectedSalesItemDatesCount === 0) {
      setChartBarColors("lightseagreen", dataPointIndex);
    }

    if (resultStore.getSelectedSalesItemDatesCount === 1) {
      setChartBarColors("purple", dataPointIndex);
    }

    if (resultStore.getSelectedSalesItemDatesCount === 2) {
      resultStore.resetSelectedItemDates();
      resetChartBarColors();
      setChartBarColors("lightseagreen", dataPointIndex);
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

  <Section v-if="showTable" class="section-table">
    <Table :columns="tableColumns" :data="tableData" />
  </Section>
</template>

<style lang="scss">
@import "../styles/chart.scss";
</style>
