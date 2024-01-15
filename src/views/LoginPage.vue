<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
const form = ref({
  email: "",
  password: "",
});
const isLoggingIn = ref(false);

const login = async () => {
  isLoggingIn.value = true;
  try {
    await userStore.fetchToken(form.value);
    if (userStore.isLoginComplete) {
      router.push("/result");
    }
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<template>
  <div class="container flex justify-center items-center h-screen">
    <form
      class="bg-blue-700 text-center w-1/2 px-3 py-4 mx-auto rounded"
      @submit.prevent="login"
    >
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        class="block w-full mx-auto text-sm py-2 px-3 rounded"
        required
      />
      <input
        v-model="form.password"
        type="password"
        placeholder="Password"
        class="block w-full mx-auto text-sm py-2 px-3 rounded my-3"
        required
      />
      <button
        class="bg-blue text-white font-bold py-2 px-4 rounded border block mx-auto w-full"
        type="submit"
        :disabled="isLoggingIn"
      >
        Login
      </button>
    </form>
  </div>
</template>
