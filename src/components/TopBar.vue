<template>
  <div class="flex flex-col md:pl-64">
    <div class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
      <div class="flex flex-1 justify-between px-4">
        <div class="flex flex-1"></div>
        <div class="ml-4 flex items-center md:ml-6">
          <!-- Profile dropdown -->
          <div class="relative ml-3">
            <div>
              <button
                type="button"
                class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                @click="pofileDropDown = !pofileDropDown"
              >
                <span class="sr-only">Open user menu</span>
                <!-- <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt
                />-->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-8 h-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <!--
              Dropdown menu, show/hide based on menu state
            -->
            <div
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer"
              :class="pofileDropDown == false ? 'hidden' : '' "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <a
                class="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabindex="-1"
                id="user-menu-item-2"
                @click="logOut"
              >Sign out</a>
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
  data() {
    return {
      pofileDropDown: false
    };
  },
  methods: {
    async logOut() {
      axios.delete("users/logout/" + localStorage.getItem("authToken"));
      console.log(localStorage.getItem("authToken"));
      localStorage.removeItem("authToken");
      this.$router.push("/login");
    }
  }
};
</script>
