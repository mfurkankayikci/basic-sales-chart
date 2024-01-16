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
      item: [],
      isYoyExist: true,
      skuList: [],
    };
  },
  getters: {
    getItemByIndex(state) {
      return (index: number) => state.item[index];
    },
    getSkuList(state): Array<object> {
      return this.skuList;
    },
  },
  actions: {
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
        const data = response.data.Data.item.skuList;
        console.log(data);

        this.skuList = data.map((item) => {
          return {
            sku: item.sku,
            productName: item.productName,
            detailFirst: "",
            detailSecond: "",
            skuRefundRate: "",
          };
        });
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
  },
});
