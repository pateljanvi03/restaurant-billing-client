<template>
  <div id="app" class="h-full bg-gray-100">
    <div>
      <SideBar v-if="$route.path !== '/login'"></SideBar>
      <TopBar v-if="$route.path !== '/login'"></TopBar>
      <div v-if="$route.path !== '/login'" class="md:pl-64 flex flex-col">
        <main class="flex-1">
          <div class="py-6 px-12">
            <router-view></router-view>
          </div>
        </main>
      </div>
      <div v-else>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import SideBar from "./components/SideBar.vue";
import axios from "axios";
import TopBar from "./components/TopBar.vue";

export default {
  components: {
    SideBar,
    TopBar
  },
  created() {
    axios.interceptors.response.use(
      response => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response.status == 401) {
          this.$router.push("/login");
        }
        return Promise.reject(error);
      }
    );
  }
};
</script>
