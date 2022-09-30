<template>
  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="py-3.5 border border-b-gray text-center text-lg font-bold text-gray-900 sm:pl-6"
                  colspan="3"
                >Top Items</th>
              </tr>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 w-[33%] pl-4 pr-3 text-center text-sm text-gray-900 sm:pl-6 border border-l-gray"
                >Item</th>
                <th
                  scope="col"
                  class="py-3.5 w-[33%] text-center text-sm text-gray-900 sm:pl-6 border border-l-gray"
                >Order</th>
                <th
                  scope="col"
                  class="py-3.5 text-center text-sm text-gray-900 sm:pl-6 w-[33%]"
                >Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="isLoading">
                <td colspan="4" align="center" class="py-5">
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
              <tr v-else v-for="(element, index) in data" :key="index">
                <td
                  class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-[30%] text-center"
                >{{ element.title }}</td>
                <td
                  class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-[30%] text-center"
                >{{ element.quantity }}</td>
                <td
                  class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-[30%] text-center"
                >{{ element.revenue }}</td>
              </tr>
            </tbody>
          </table>
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
      data: [],
      isLoading: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      const fooditems = await axios.get("/fooditems");
      const response = await axios.get("/stats/orders/top-items");
      response.data.revenue.map(x => {
        x.title = fooditems.data.find(y => y._id == x._id.itemId)?.title;
        return x;
      });
      this.data = response.data.revenue;
      this.isLoading = false;
    }
  }
};
</script>
