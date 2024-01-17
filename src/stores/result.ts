import { defineStore } from "pinia";
import axios from "axios";
import { IOverviewParams, ISkuParams, ISkuList, IItemDate } from "../types";

export const useResultStore = defineStore("ResultStore", {
  state: () => {
    return {
      currency: "",
      isYoyExist: true,
      salesItems: [],
      salesItemDates: [] as Array<IItemDate>,
      skuList: [] as Array<ISkuList>,
    };
  },
  getters: {
    getSalesItems(state) {
      return state.salesItems;
    },
    getSalesItemDates(state) {
      return state.salesItemDates;
    },
    getSelectedSalesItemDatesCount(state) {
      return state.salesItemDates.filter((item) => item.selected === true)
        .length;
    },
    getSelectedSalesItemDates(state) {
      return state.salesItemDates.filter((item) => item.selected === true);
    },
    getSalesItemDatesByIndex(state) {
      return (index: number) => state.salesItemDates[index];
    },
    getSkuList(state) {
      return state.skuList;
    },
  },
  actions: {
    resetSelectedItemDates() {
      this.salesItemDates.map((item) => (item.selected = false));
    },
    setSelectedItemDate(index: number) {
      this.salesItemDates[index].selected = true;
    },
    setSalesItems(data) {
      this.currency = data.Currency;
      this.isYoyExist = data.isYoyExist;
      this.salesItems = data.item;
      data.item.map((d: IItemDate) => {
        this.salesItemDates.push({
          date: d.date,
          selected: false,
        } as IItemDate);
      });
    },
    setSkuListItems(data) {
      const skuListData = data.skuList;

      this.skuList = skuListData.map((item: ISkuList) => {
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

        this.setSalesItems(data);
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

        this.setSkuListItems(data);
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
