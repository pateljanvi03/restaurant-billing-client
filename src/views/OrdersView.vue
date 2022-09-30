<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
    <div class="py-4">
      <div>
        <div class="grid grid-cols-3">
          <div
            v-for="table in tables"
            :key="table._id"
            class="shadow flex flex-wrap flex-col border bg-white mt-10 ml-3 mr-3 h-40"
            :class="table._id === selectedTable?._id ? 'border-blue-500' : ''"
          >
            <div class="flex min-h-[50%] bg-gray-100">
              <div
                class="flex flex-col shadow overflow-hidden border border-x-2 w-auto border-l-0 flex-auto justify-center items-center"
              >
                <span class="text-gray-500 py-2 text-sm">Table Number</span>
                <span class="text-indigo-600 py 2 text-xl font-semibold">{{table.tableNo}}</span>
              </div>
              <div
                class="flex flex-col justify-center items-center shadow overflow-hidden w-auto flex-auto"
              >
                <span class="text-gray-500 py-2 text-sm">Total Seat</span>
                <span class="text-indigo-600 py 2 text-xl font-semibold">{{table.capacity}}</span>
              </div>
            </div>
            <div v-if="table.order?._id" class="flex">
              <div class="flex justify-center items-center flex-auto w-auto text-lg font-semibold">
                <button
                  type="button"
                  class="shadow border border-blue-500 sm:rounded-md bg-indigo-600 text-white px-4 py-1 mt-6"
                  @click="viewOrder(table)"
                >View Order</button>
              </div>
              <div class="flex flex-col justify-center items-center flex-auto w-auto">
                <span class="text-gray-500 py-2 text-sm">Payable amount</span>
                <span class="text-indigo-600 py 2 text-2xl font-semibold">{{table.order?.total}}</span>
              </div>
            </div>
            <div v-else class="flex justify-center items-center">
              <button
                type="button"
                class="shadow border border-blue-500 sm:rounded-md bg-indigo-600 text-white px-4 py-1 mt-6"
                @click="bookTable(table)"
              >Book Now</button>
            </div>
          </div>
        </div>

        <div
          v-if="selectedTable != undefined"
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-10 w-[60%]"
        >
          <ValidationObserver v-slot="{ handleSubmit }">
            <form class="space-y-6" @submit.prevent="handleSubmit(addOrder)">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-[35%]"
                    >Item</th>
                    <th
                      class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 w-[10%]"
                    >Quantity</th>
                    <th
                      class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                    >Rate</th>
                    <th
                      class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                    >Subtotal</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody class="bg-white">
                  <tr v-for="(order, index) in foodItems" :key="index">
                    <!-- <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ order.itemId }}</td> -->
                    <td
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      <ValidationProvider rules="required" v-slot="{ errors }">
                        <select
                          name="foodItem"
                          class="mt-1 w-full border pl-3 pr-10 py-1 text-base border-gray-300 sm:text-sm rounded-md"
                          :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : ''"
                          v-model="order.itemId"
                          @change="onChangeInItem($event, index)"
                        >
                          <option value>Select item</option>
                          <option
                            v-for="item in items"
                            :value="item._id"
                            :key="item._id"
                          >{{item.title}}</option>
                        </select>
                      </ValidationProvider>
                    </td>
                    <td class="whitespace-nowrap py-4 text-sm text-black-500 w-12">
                      <ValidationProvider name="quantity" rules="between:1,999" v-slot="{ errors }">
                        <input
                          v-model="order.quantity"
                          @change="onChangeInQuantity($event, index)"
                          class="mt-1 w-12 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm sm:text-lg border border-gray-300 rounded-md px-2"
                          :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : ''"
                        />
                        <!-- <span class="text-red-600 text-sm">{{ errors[0] }}</span> -->
                      </ValidationProvider>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-black-500 text-center"
                    >{{ order.price }}</td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-black-500 text-center"
                    >{{ order.subTotal }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-black-500 text-center">
                      <button
                        @click="deleteFoodItem(index)"
                        class="text-indigo-600 hover:text-indigo-900 ml-2 hover:cursor-pointer font-semibold"
                      >Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                      colspan="1"
                    >
                      <button
                        type="button"
                        class="bg-indigo-600 text-white font-semibold px-4 py-2 sm:rounded-md flex"
                        @click="addItemsToFoodItems"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-4 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clip-rule="evenodd"
                          />
                        </svg>Add
                      </button>
                    </td>
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                      colspan="4"
                    >
                      <button
                        class="bg-indigo-600 text-white font-semibold px-4 py-2 sm:rounded-md flex"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"
                          />
                        </svg>Place Order
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </ValidationObserver>
        </div>
        <div
          v-if="selectedTable != undefined"
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-10 w-[60%]"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6 text-left w-[35%]"
                >Item</th>
                <th
                  class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 w-[10%]"
                >Quantity</th>
                <th
                  class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                >Rate</th>
                <th
                  class="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6"
                >Subtotal</th>
                <!-- <th></th> -->
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(orderItem, index) in orderItems" :key="index">
                <td
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >{{ orderItem.title }}</td>
                <td
                  class="flex justify-center items-center whitespace-nowrap px-3 py-4 text-sm text-black-500"
                >{{ orderItem.quantity }}</td>
                <td
                  class="whitespace-nowrap px-3 py-4 text-sm text-black-500 text-center"
                >{{ orderItem.price }}</td>
                <td
                  class="whitespace-nowrap px-3 py-4 text-sm text-black-500 text-center"
                >{{ orderItem.subTotal }}</td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  align="right"
                  class="whitespace-nowrap py-2 pr-3 font-medium text-gray-700 text-sm sm:pl-6"
                >
                  <span class="pr-2">Total:</span>
                  <span class="w-16 inline-block">{{ total }}</span>
                </td>
              </tr>
              <tr>
                <td
                  colspan="4"
                  align="right"
                  class="whitespace-nowrap py-2 pr-3 text-sm font-medium text-gray-700 sm:pl-6"
                >
                  <span class="pr-2">Discount:</span>
                  <span class="w-16 inline-block">{{ discount.amount }}</span>
                </td>
              </tr>
              <tr v-for="tax in taxes" :key="tax._id">
                <td
                  colspan="4"
                  align="right"
                  class="whitespace-nowrap py-2 pr-3 text-sm font-medium text-gray-700 sm:pl-6"
                >
                  <span class="pr-2">{{ tax.title }}({{ tax.percentage }}%):</span>
                  <span class="w-16 inline-block">{{ tax.amount }}</span>
                </td>
              </tr>

              <tr>
                <td
                  colspan="4"
                  align="right"
                  class="whitespace-nowrap py-2 pr-3 text-sm font-medium text-gray-700 sm:pl-6"
                >
                  <span class="pr-2">Bill Amount:</span>
                  <span class="w-16 inline-block">{{ billAmount }}</span>
                </td>
              </tr>
              <tr class="bg-gray-100">
                <td colspan="2" class="px-4" align="left">
                  <label class="mr-4">Discount(%):</label>
                  <input
                    type="number"
                    class="appearance-none w-16 text-slate-900 bg-white rounded-md mr-2 px-3 py-2 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 ring-2"
                    v-model.number="discountPercentage"
                  />
                </td>
                <td
                  colspan="2"
                  align="right"
                  class="whitespace-nowrap py-4 pr-3 text-sm font-medium sm:pl-6"
                >
                  <button
                    class="bg-indigo-600 text-white font-semibold px-4 py-2 sm:rounded-md inline-flex"
                    :disabled="isLoading"
                    :class="
                    isLoading
                      ? 'bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 '
                  "
                    @click="payBill"
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
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 mr-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Pay Bill
                  </button>
                </td>
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
  components: {
    //
  },
  data() {
    return {
      tables: [],
      items: [],
      foodItems: [],
      rowTaxes: [],
      isLoading: false,
      discountPercentage: 0,
      orderItems: [
        {
          title: "",
          itemId: "",
          quantity: undefined,
          price: undefined,
          subTotal: undefined,
          orderId: ""
        }
      ],
      selectedTable: undefined
    };
  },
  computed: {
    filterdItem() {
      return this.items.filter(
        x => this.foodItems.findIndex(y => y.itemId == x._id) == -1
      );
    },
    total() {
      return this.selectedTable?.order?.total || 0;
    },
    discount() {
      return {
        amount: this.discountAmount,
        percentage: this.discountPercentage
      };
    },
    discountAmount() {
      return +((this.total * this.discountPercentage) / 100).toFixed(2) || 0;
    },
    netAmount() {
      return this.total - this.discount.amount;
    },
    taxes() {
      return this.rowTaxes.map(x => {
        return {
          title: x.title,
          percentage: x.percentage,
          amount: +(this.netAmount * (x.percentage / 100)).toFixed(2)
        };
      });
    },
    billAmount() {
      let total = this.netAmount;
      for (const tax of this.taxes) {
        total += tax.amount;
      }
      return +total.toFixed(2);
    }
  },

  created() {
    this.loadTable();
    this.loadItems();
    this.loadTaxes();
  },

  methods: {
    async loadTable() {
      const response = await axios.get("/tables");
      this.tables = response.data;
      if (this.selectedTable != undefined) {
        this.selectedTable = this.tables.find(
          x => x._id === this.selectedTable._id
        );
        const response = await axios.get(
          "/orders/" + this.selectedTable.order._id + "/items"
        );
        this.orderItems = response.data;
        this.orderItems.map(x => {
          x.title = this.items.find(y => y._id == x.itemId).title;
          return x;
        });
      }
    },
    async bookTable(table) {
      this.selectedTable = table;
      await axios.put("/tables/" + table._id + "/reserve-table");
      await this.loadTable();
    },

    async loadItems() {
      const response = await axios.get("/fooditems");
      this.items = response.data;
    },

    async addOrder() {
      await axios.put("/orders/" + this.selectedTable.order._id, {
        items: this.foodItems
      });
      this.selectedTable = undefined;
      this.orders = [];
      await this.loadTable();
    },

    async payBill() {
      this.isLoading = true;
      await axios.put("/orders/" + this.selectedTable.order._id + "/paybill", {
        total: this.total,
        discount: this.discount,
        netAmount: this.netAmount,
        taxes: this.taxes,
        billAmount: this.billAmount
      });
      this.selectedTable = undefined;
      this.orderItems = [];
      this.foodItems = [];
      this.isLoading = false;
      await this.loadTable();
    },
    addItemsToFoodItems() {
      this.foodItems.push({
        itemId: "",
        quantity: 1,
        price: 0,
        subTotal: 0,
        orderId: this.selectedTable.order._id
      });
    },

    deleteFoodItem(index) {
      this.foodItems.splice(index, 1);
    },

    onChangeInItem($event) {
      const elementOfItems = this.items.find(x => x._id == $event.target.value);
      const item = this.foodItems.find(x => x.itemId == elementOfItems?._id);
      item.quantity = 1;
      item.price = elementOfItems.price;
      item.subTotal = elementOfItems.price * item.quantity || 0;
    },

    onChangeInQuantity($event, index) {
      const elementOfItems = this.items.find(
        x => x._id == this.foodItems[index].itemId
      );
      if (elementOfItems) {
        this.foodItems[index].price = elementOfItems.price;
        this.foodItems[index].subTotal =
          elementOfItems.price * this.foodItems[index].quantity;
      }
    },

    viewOrder(table) {
      this.selectedTable = table;
      this.orderItems = [];
      this.foodItems = [];
      this.loadTable();
    },

    async loadTaxes() {
      const tax = await axios.get("/taxes");
      this.rowTaxes = tax.data;
    }
  }
};
</script>
