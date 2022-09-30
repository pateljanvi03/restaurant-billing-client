<template>
  <div>
    <div class="py-4">
      <div>
        <div class="flex flex-col w-[60%]">
          <div>
            <div class="sm:flex justify-between">
              <h1 class="text-2xl font-semibold text-gray-900">Waiting List</h1>
            </div>

            <div class="flex flex-col">
              <div class="py-8 sm:flex-auto">
                <ValidationObserver ref="waiting-form" v-slot="{ handleSubmit }">
                  <form class="space-y-6" @submit.prevent="handleSubmit(adstowaitingList)">
                    <div class="shadow overflow-hidden sm:rounded-md border border-gray-300">
                      <div class="px-4 py-5 bg-white sm:p-6">
                        <div class="grid gap-6">
                          <div class="col-span-6 sm:col-span-3">
                            <label
                              for="table-no"
                              class="block text-sm font-medium text-black-700"
                            >Name</label>
                            <ValidationProvider name="Name" rules="required" v-slot="{ errors }">
                              <input
                                v-model="waitingList.name"
                                type="text"
                                name="name"
                                id="name"
                                class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                                :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                              />
                              <span class="text-red-600 text-sm">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>

                          <div class="col-span-6 sm:col-span-4">
                            <label
                              for="numberOfpeople"
                              class="block text-sm font-medium text-black-700"
                            >No.of people</label>
                            <ValidationProvider
                              name="numberOfpeople"
                              rules="required"
                              v-slot="{ errors }"
                            >
                              <input
                                v-model="waitingList.numberOfpeople"
                                type="number"
                                name="numberOfpeople"
                                class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                                :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                              />
                              <span class="text-red-600 text-sm">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>

                          <div class="col-span-6 sm:col-span-4">
                            <label
                              for="phone"
                              class="block text-sm font-medium text-black-700"
                            >Phone No.</label>
                            <ValidationProvider name="phone" rules="required" v-slot="{ errors }">
                              <input
                                v-model="waitingList.phone"
                                type="number"
                                name="phone"
                                class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                                :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                              />
                              <span class="text-red-600 text-sm">{{ errors[0] }}</span>
                            </ValidationProvider>
                          </div>
                        </div>
                      </div>

                      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          :disabled="isLoadingForm"
                          :class="
                            isLoadingForm
                            ? 'bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 '
                            "
                        >
                          <svg
                            v-if="isLoadingForm"
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
                          Add
                        </button>
                      </div>
                    </div>
                  </form>
                </ValidationObserver>
              </div>
              <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
                  >
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >Name</th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >No of people</th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >Phone No.</th>
                          <th></th>
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
                        <tr v-else v-for="person in waitingLists" :key="person._id">
                          <td
                            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                          >{{ person.name }}</td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >{{ person.numberOfpeople }}</td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >{{ person.phone }}</td>
                          <td>
                            <a
                              class="text-indigo-600 hover:text-indigo-900 ml-2 hover:cursor-pointer"
                              @click="clearFromWaitingList(person)"
                            >Clear</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      waitingLists: [],
      showForm: false,
      isLoading: false,
      waitingList: {
        name: "",
        numberOfpeople: undefined,
        phone: undefined
      },
      isLoadingForm: false
    };
  },
  created() {
    this.loadWaitingList();
  },
  methods: {
    async loadWaitingList() {
      this.isLoading = true;
      const response = await axios.get("/waiting-list");
      this.waitingLists = response.data;
      this.isLoading = false;
      console.log(this.isLoading);
    },

    async adstowaitingList() {
      this.isLoadingForm = true;
      await axios.post("/waiting-list", this.waitingList);
      await this.loadWaitingList();

      this.waitingList = {
        name: "",
        numberOfpeople: undefined,
        phone: undefined
      };
      this.isLoadingForm = false;
      this.showForm = false;

      this.$refs["waiting-form"].reset();
    },

    async clearFromWaitingList(person) {
      await axios.delete("/waiting-list/" + person._id);
      await this.loadWaitingList();
    }
  }
};
</script>