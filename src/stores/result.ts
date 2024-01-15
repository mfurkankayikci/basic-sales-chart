import { defineStore } from "pinia";
import axios from "axios";

interface IParams {
  marketplace: string;
  sellerId: string;
  requestStatus: number;
  day: number;
  excludeYoYData: boolean;
}

export const useResultStore = defineStore("ResultStore", {
  state: () => {
    return {
      currency: "",
      item: [],
      isYoyExist: true,
    };
  },
  actions: {
    async fetchDailySalesOverview(params: IParams) {
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
  },
});
