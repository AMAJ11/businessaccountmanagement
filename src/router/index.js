import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HistoryView from '../views/HistoryView.vue'
import Auth from '../views/Auth.vue'
import TredingUp from "../views/TredingUp.vue"
const isAuthenticated = function () {
  const token = localStorage.getItem("token")
  if (!token) return false
  else { return true }
}
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: async (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/Auth')
      }
    }
  },
  {
    path: '/Auth',
    name: 'Auth',
    component: Auth,
    beforeEnter: async (to, from, next) => {
      if (isAuthenticated()) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/history',
    name: 'HistoryView',
    component: HistoryView,
    beforeEnter: async (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/Auth')
      }
    }
  },
  {
    path: '/account',
    name: 'account',
    component: TredingUp,
    beforeEnter: async (to, from, next) => {
      if (isAuthenticated()) {
        next()
      } else {
        next('/Auth')
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
