<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Order History</h1>
    <div>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardState label="Orders Today" duration="daily" type="count"></DashboardState>
        <DashboardState label="Orders This week" duration="weekly" type="count"></DashboardState>
        <DashboardState label="Orders This month" duration="monthly" type="count"></DashboardState>
      </dl>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardState label="Revenue Today" duration="daily" type="revenue"></DashboardState>
        <DashboardState label="Revenue This week" duration="weekly" type="revenue"></DashboardState>
        <DashboardState label="Revenue This month" duration="monthly" type="revenue"></DashboardState>
      </dl>
    </div>
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Date</th>
                  <th class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Bill Total</th>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900"
                  >Discount Amount</th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >Net Amount</th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                  >Is paid</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="isLoading">
                  <td colspan="5" align="center" class="py-5">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-6 w-6 text-indigo-600"
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
                  </td>
                </tr>
                <tr v-else v-for="(order) in orders" :key="order._id">
                  <td
                    class="whitespace-nowrap text-center py-4 pl-3 pr-4 text-sm font-medium sm:pr-6"
                  >{{order.date}}</td>
                  <td
                    class="text-center py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
                  >{{ order.total }}</td>
                  <td
                    class="text-center py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
                  >{{ order.discountAmount }}</td>
                  <td
                    class="whitespace-nowrap text-center py-4 pl-3 pr-4 text-sm sm:pr-6 text-gray-500"
                  >{{order.netAmount}}</td>
                  <td
                    class="whitespace-nowrap text-center py-4 pl-3 pr-4 text-sm sm:pr-6 text-gray-500"
                  >{{order.isPaid ? 'Yes' : 'No'}}</td>
                </tr>
              </tbody>
            </table>
            <nav
              class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{orders.length}}</span>
                  results of page number
                  <span class="font-medium">{{page}}</span>
                </p>
              </div>
              <div class="flex flex-1 justify-between sm:justify-end">
                <select
                  @change="loadData"
                  v-model="limit"
                  class="py-2 w-ayto border pl-3 pr-3 mr-4 text-base border-gray-300 sm:text-sm rounded-md"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>

                <button
                  :disabled="disablePreviousButton"
                  @click="previousPage"
                  :class="disablePreviousButton?'text-gray-300':'text-gary-700'"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >Previous</button>
                <button
                  :disabled="disableNextButton"
                  @click="nextPage"
                  :class="disableNextButton?'text-gray-300':'text-gary-700'"
                  class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >Next</button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DashboardState from "@/components/DashboardState.vue";

export default {
  components: {
    DashboardState
  },
  data() {
    return {
      orders: [],
      isLoading: false,
      page: 1,
      limit: 10
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    disablePreviousButton() {
      return this.page == 1;
    },
    disableNextButton() {
      return this.orders.length < this.limit;
    }
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      const response = await axios.get("/orders/", {
        params: {
          page: this.page,
          limit: this.limit
        }
      });
      this.orders = response.data;
      this.isLoading = false;
    },
    async nextPage() {
      this.page++;
      this.loadData();
    },
    async previousPage() {
      this.page--;
      this.loadData();
    }
  }
};
</script>