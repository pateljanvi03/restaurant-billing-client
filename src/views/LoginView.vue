<template>
  <div>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          class="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900"
        >Sign in to your account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-xl">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form class="space-y-6" @submit.prevent="handleSubmit(loginToPage)">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Username</label>
                <div class="mt-1">
                  <ValidationProvider name="username" rules="required" v-slot="{ errors }">
                    <input
                      id="username"
                      name="username"
                      v-model="userName"
                      autocomplete="username"
                      class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                      :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                    />
                    <span class="text-red-600 text-sm">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="mt-1">
                  <ValidationProvider name="password" rules="required" v-slot="{ errors }">
                    <input
                      id="password"
                      name="password"
                      v-model="password"
                      type="password"
                      class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                      :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                    />
                    <span class="text-red-600 text-sm">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div v-if="error != undefined" class="text-red-600 text-sm">{{error}}</div>
              </div>

              <div>
                <button
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="isLoading"
                  :class="
                    isLoading
                      ? 'bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 '
                  "
                >
                  <svg
                    v-if="isLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sign in
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userName: "",
      password: "",
      error: undefined,
      isLoading: false
    };
  },
  methods: {
    async loginToPage() {
      try {
        this.isLoading = true;
        this.error = undefined;
        const response = await axios.post("/users/login", {
          userName: this.userName,
          password: this.password
        });

        localStorage.setItem("authToken", response.data.token);
        this.$router.push("/dashboard");
      } catch (err) {
        this.error = err.response?.data?.message;
      }

      this.isLoading = false;
    }
  }
};
</script>
