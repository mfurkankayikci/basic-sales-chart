import { defineStore } from "pinia";
import axios from "axios";
import { ILogin } from "../types";

export const useUserStore = defineStore("UserStore", {
  state: () => {
    return {
      user: {},
      token: null as string | null,
      marketplaceName: "",
      sellerId: "",
      isLoginComplete: false,
    };
  },
  getters: {
    getUser(state) {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

      state.user = { ...state.user, ...storedUser };
      return state.user;
    },
  },
  actions: {
    saveUserToLocalStorage() {
      sessionStorage.setItem("user", JSON.stringify(this.user));
    },
    async fetchToken(formData: ILogin): Promise<void> {
      const { email, password } = formData;

      const user = {
        Email: email,
        Password: password,
        GrantType: "password",
        Scope: "amazon_data",
        ClientId: "C0001",
        ClientSecret: "SECRET0001",
        RedirectUri: "https://api.eva.guru",
      };

      try {
        try {
          const tokenResponse = await axios.post("/oauth/token", user);
          const token = tokenResponse.data.Data.AccessToken;
          sessionStorage.setItem("token", token || "");
          return await this.fetchUserInformation(email, token);
        } catch (error) {
          console.error("Error:", error);
        }
      } finally {
        this.saveUserToLocalStorage();
        this.isLoginComplete = true;
      }
    },

    async fetchUserInformation(email: string, token: string): Promise<void> {
      try {
        const userInformationResponse = await axios.post(
          "/user/user-information",
          { email: email || "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = userInformationResponse.data.Data.user.store[0];
        const userData = {
          marketplace: data.marketplaceName,
          sellerId: data.storeId,
        };
        this.user = userData;
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
});
