import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import TablesView from '../views/TablesView.vue'
import CategoryView from '../views/CategoryView.vue'
import OrdersView from '../views/OrdersView.vue'
import FoodItemView from '../views/FoodItemView.vue'
import DashboardView from '../views/DashboardView.vue'
import WaitingView from '../views/WaitingView.vue'
import OrderHistoryView from '../views/OrderHistoryView.vue'
import TaxView from '../views/TaxView.vue'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView
  },
  {
    path: '/fooditems',
    name: 'fooditems',
    component: FoodItemView
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoryView
  },
  {
    path: '/waiting',
    name: 'waiting',
    component: WaitingView
  },
  {
    path: '/order-history',
    name: 'orderhistory',
    component: OrderHistoryView
  },
  {
    path: '/taxes',
    name: 'taxes',
    component: TaxView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((req, res, next) => {
  if (!localStorage.getItem("authToken")) {
    if (req.path === '/login') {
      return next()
    }

    return next({ name: 'login' })
  }

  axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("authToken");

  next()
})

export default router
