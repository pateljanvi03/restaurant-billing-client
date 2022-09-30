<template>
  <ValidationObserver ref="user-form" v-slot="{ handleSubmit }">
    <form class="h-full" @submit.prevent="handleSubmit(save)">
      <div class="shadow sm:rounded-md border border-gray-300 h-full">
        <div class="px-4 py-5 bg-white sm:p-6">
          <div class="grid grid-cols-6 gap-7">
            <div class="col-span-6 sm:col-span-4">
              <label
                class="text-2xl font-semibold text-gray-900"
              >{{ editableUser._id? "Edit" : "Add" }} User</label>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="first-name" class="ml-0 block text-sm font-medium text-black-700">Name</label>
              <ValidationProvider name="Name" rules="required" v-slot="{ errors }">
                <input
                  v-model="form.name"
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
              <label for="userName" class="block text-sm font-medium text-black-700">Username</label>
              <ValidationProvider name="userName" rules="required" v-slot="{ errors }">
                <input
                  v-model="form.userName"
                  type="text"
                  name="userName"
                  id="userName"
                  class="mt-2 appearance-none text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm focus:outline-none placeholder:text-slate-400"
                  :class="errors.length ? 'focus:ring-2 focus:ring-sky-500 ring-2 ring-rose-400' : 'focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200'"
                />
                <span class="text-red-600 text-sm">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>

            <div v-if="editableUser" class="col-span-6 sm:col-span-4">
              <label for="password" class="block text-sm font-medium text-black-700">Password</label>
              <input
                v-model="form.password"
                name="password"
                id="password"
                class="mt-2 text-slate-900 bg-white rounded-md block w-full px-3 h-10 shadow-sm sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 ring-1 ring-slate-200"
              />
            </div>
            <div v-else class="col-span-6 sm:col-span-4">
              <label for="password" class="block text-sm font-medium text-black-700">Password</label>
              <ValidationProvider name="Password" rules="required" v-slot="{ errors }">
                <input
                  v-model="form.password"
                  name="password"
                  id="password"
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
            class="inline-flex justify-center ml-2 py-2 px-4 text-sm font-medium"
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
    editableUser: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        name: "",
        userName: "",
        password: ""
      },
      isLoading: false
    };
  },
  mounted() {
    this.setEditableData();
  },
  watch: {
    editableUser() {
      this.setEditableData();
    }
  },
  methods: {
    setEditableData() {
      if (this.editableUser._id) {
        let data = JSON.parse(JSON.stringify(this.editableUser));
        delete data._id;
        this.form = data;
      } else {
        this.form = {
          name: "",
          userName: "",
          password: ""
        };
      }
    },
    closeForm() {
      this.$modal.hide("user-form");
    },
    async save() {
      this.isLoading = true;
      try {
        if (this.editableUser._id) {
          await axios.put("/users/" + this.editableUser._id, this.form);
        } else {
          await axios.post("/users", this.form);
        }
        this.form = {
          name: "",
          userName: "",
          password: ""
        };
        this.$emit("refresh");
        this.closeForm();
      } catch (err) {
        let errors = {};
        for (let _err of err.response.data.errors) {
          errors[_err.param] = [_err.msg];
        }
        this.$refs["user-form"].setErrors(errors);
      }
      this.isLoading = false;
    }
  }
};
</script>