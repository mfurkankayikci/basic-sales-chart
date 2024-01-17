import { defineStore } from "pinia";
import axios from "axios";

interface IOverviewParams {
  marketplace: string;
  sellerId: string;
  requestStatus: number;
  day: number;
  excludeYoYData: boolean;
}

interface ISkuParams {
  isDaysCompare: number;
  marketplace: string;
  pageNumber: number;
  pageSize: number;
  salesDate: string;
  salesDate2: string;
  sellerId: string;
}

export const useResultStore = defineStore("ResultStore", {
  state: () => {
    return {
      currency: "",
      isYoyExist: true,
      item: [],
      itemDates: [],
      skuList: [],
    };
  },
  getters: {
    getItems(state) {
      return state.item;
    },
    getItemDates(state) {
      return state.itemDates;
    },
    getSelectedItemDatesCount(state) {
      return state.itemDates.filter((item) => item.selected === true).length;
    },
    getSelectedItemDates(state) {
      return state.itemDates.filter((item) => item.selected === true);
    },
    getItemDatesByIndex(state) {
      return (index: number) => state.itemDates[index];
    },
    getSkuList(state): Array<object> {
      return this.skuList;
    },
  },
  actions: {
    resetSelectedItemDates() {
      this.itemDates.map((item) => (item.selected = false));
    },
    setSelectedItemDate(index: number) {
      this.itemDates[index].selected = true;
    },
    async fetchDailySalesOverview(params: IOverviewParams) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        };

        const response = await axios.post(
          "/data/daily-sales-overview",
          params,
          config
        );
        const data = response.data.Data;

        this.currency = data.Currency;
        this.isYoyExist = data.isYoyExist;
        this.item = data.item;
        data.item.map((d: object) => {
          this.itemDates.push({
            date: d.date,
            selected: false,
          });
        });
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    async fetchDailySalesSkuList(params: ISkuParams) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        };

        const response = await axios.post(
          "/data/daily-sales-sku-list",
          params,
          config
        );
        const data = response.data.Data.item;
        const skuListData = data.skuList;

        this.skuList = skuListData.map((item) => {
          return {
            sku: item.sku,
            productName: item.productName,
            skuRefundRate: "",
            amount: item.amount,
            amount2: item.amount2,
            qty: item.qty,
            qty2: item.qty2,
            selectedDate: data.selectedDate,
            selectedDate2: data.selectedDate2 || null,
          };
        });
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
