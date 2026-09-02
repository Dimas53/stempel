import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CheckView from '@/views/CheckView.vue'
import CheckoutView from '@/views/CheckoutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/chronology' },
    { path: '/chronology', name: 'login', component: LoginView },
    { path: '/chronology/check', name: 'check', component: CheckView },
    { path: '/chronology/checkout', name: 'checkout', component: CheckoutView },
  ],
})

export default router
