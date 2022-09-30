<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form class="space-y-6" @submit.prevent="handleSubmit(addToCategory)">
      <div class="shadow sm:rounded-md border border-gray-300">
        <div class="px-4 py-5 bg-white sm:p-6">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-4">
              <label
                class="text-2xl font-semibold text-gray-900"
              >{{ editableCategory._id ?"Edit" : "Add" }} Category</label>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="title" class="ml-0 block text-sm font-medium text-black-700">Category name</label>
              <ValidationProvider name="Category name" rules="required" v-slot="{ errors }">
                <input
                  v-model="category.title"
                  type="text"
                  name="title"
                  class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                  :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                />
                <span class="text-red-600 text-sm">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex justify-end bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            @click="closeForm"
            class="inline-flex justify-center py-2 px-4 text-sm font-medium"
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
    editableCategory: {
      type: Object
    }
  },

  data() {
    return {
      category: {
        title: ""
      },
      isLoading: false
    };
  },
  watch: {
    editableCategory() {
      this.setEditableData();
    }
  },
  mounted() {
    this.setEditableData();
  },
  methods: {
    setEditableData() {
      if (this.editableCategory._id) {
        let data = JSON.parse(JSON.stringify(this.editableCategory));
        delete data._id;
        this.category = data;
      } else {
        this.category = {
          title: ""
        };
      }
    },
    closeForm() {
      this.$modal.hide("category-form");
    },
    async addToCategory() {
      this.isLoading = true;
      if (this.editableCategory._id) {
        await axios.put(
          "/categories/" + this.editableCategory._id,
          this.category
        );
      } else {
        await axios.post("/categories", this.category);
      }
      this.category = {
        title: ""
      };
      this.isLoading = false;
      this.$emit("refresh");
      this.closeForm();
    }
  }
};
</script>