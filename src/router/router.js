import { createRouter, createWebHistory } from 'vue-router';

// Import your feature components
import UVTracker from '../components/Features/UVTracker.vue';
import UVImpact from '../components/Features/UVImpact.vue';
import Personalize from '../components/Features/Personalize.vue';
import Reminder from '../components/Features/Reminder.vue';

const routes = [
  {
    path: '/',
    redirect: '/uv-tracker'
  },
  {
    path: '/uv-tracker',
    name: 'UVTracker',
    component: UVTracker
  },
  {
    path: '/uv-impact',
    name: 'UVImpact',
    component: UVImpact
  },
  {
    path: '/personalize',
    name: 'Personalize',
    component: Personalize
  },
  {
    path: '/reminder',
    name: 'Reminder',
    component: Reminder
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;