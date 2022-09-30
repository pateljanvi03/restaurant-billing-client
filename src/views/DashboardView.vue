<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    <div class="py-4">
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
      <BarChart></BarChart>
      <RevenueTable></RevenueTable>
    </div>
  </div>
</template>

<script>
import DashboardState from "../components/DashboardState.vue";
import BarChart from "@/components/BarChart.vue";
import RevenueTable from "@/components/RevenueTable.vue";

export default {
  components: {
    DashboardState,
    BarChart,
    RevenueTable
  }
};
</script>
