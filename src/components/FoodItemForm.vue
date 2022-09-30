<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="h-full" @submit.prevent="handleSubmit(addItems)">
      <div class="shadow sm:rounded-md border border-gray-300">
        <div class="px-4 py-5 bg-white sm:p-6">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-4">
              <label
                class="text-2xl font-semibold text-gray-900"
              >{{ editableItem._id ? "Edit" : "Add" }} Fooditems</label>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="title" class="ml-0 block text-sm font-medium text-black-700">Item name</label>
              <ValidationProvider name="Item name" rules="required" v-slot="{ errors }">
                <input
                  v-model="item.title"
                  type="text"
                  name="title"
                  id="title"
                  class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                  :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                />
                <span class="text-red-600 text-sm">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>

            <div class="col-span-6 sm:col-span-4">
              <label for="price" class="block text-sm font-medium text-black-700">Price</label>
              <ValidationProvider name="Price" rules="required" v-slot="{ errors }">
                <input
                  v-model="item.price"
                  type="number"
                  name="price"
                  class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                  :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                />
                <span class="text-red-600 text-sm">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>

            <div class="col-span-6 sm:col-span-4">
              <label for="categoryItem" class="block text-sm font-medium text-black-700">Category</label>
              <ValidationProvider name="Category" rules="required" v-slot="{ errors }">
                <select
                  v-model="item.categoryId"
                  class="mt-1 w-full border pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
                >
                  <option value>Select item</option>
                  <option
                    v-for="(category, index) in categories"
                    :value="category._id"
                    :key="index"
                  >{{category.title}}</option>
                </select>
                <span class="text-red-600 text-sm">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex justify-end bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            @click="closeForm"
            class="justify-center py-2 px-4 text-sm font-medium"
          >Close</button>
          <button
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            Save
          </button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import axios from "axios";
export default {
  props: {
    categories: {
      type: Array
    },
    editableItem: {
      type: Object
    }
  },
  data() {
    return {
      item: {
        title: "",
        price: undefined,
        categoryId: ""
      },
      isLoading: false
    };
  },
  watch: {
    editableItem() {
      this.setEditableData();
    }
  },
  mounted() {
    this.setEditableData();
  },
  methods: {
    setEditableData() {
      if (this.editableItem._id) {
        let data = JSON.parse(JSON.stringify(this.editableItem));
        delete data._id;
        this.item = data;
      } else {
        this.item = {
          title: "",
          price: undefined,
          categoryId: ""
        };
      }
    },
    closeForm() {
      this.$modal.hide("item-form");
    },
    async addItems() {
      this.isLoading = true;
      if (this.editableItem._id) {
        await axios.put("/fooditems/" + this.editableItem._id, this.item);
      } else {
        await axios.post("/fooditems", this.item);
      }
      this.item = {
        price: undefined,
        title: "",
        categoryId: ""
      };
      this.isLoading = false;
      this.$emit("refresh");
      this.closeForm();
    }
  }
};
</script>