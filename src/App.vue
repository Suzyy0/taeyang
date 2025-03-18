<template>
  <div class="flex flex-col min-h-screen bg-amber-50">
    <!-- Header -->
    <header class="bg-amber-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-xl font-bold">Taeyang</h1>
        <div v-if="lastApplied" class="flex items-center bg-amber-500 rounded-full px-3 py-1 text-sm">
          <bell-icon class="w-4 h-4 mr-1" />
          <span>{{ getTimeUntilNextApplication() }}</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 mb-6">
        <router-link 
          to="/uv-tracker"
          class="px-4 py-2 font-medium"
          :class="[$route.path === '/uv-tracker' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500']"
        >
          UV Tracker
        </router-link>
        <router-link 
          to="/uv-impact"
          class="px-4 py-2 font-medium"
          :class="[$route.path === '/uv-impact' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500']"
        >
          UV Impact
        </router-link>
        <router-link 
          to="/personalize"
          class="px-4 py-2 font-medium"
          :class="[$route.path === '/personalize' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500']"
        >
          Personalize
        </router-link>
        <router-link 
          to="/reminder"
          class="px-4 py-2 font-medium"
          :class="[$route.path === '/reminder' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500']"
        >
          Reminder
        </router-link>
      </div>

      <router-view 
        :current-location="currentLocation"
        :uv-index="uvIndex"
        :location-permission="locationPermission"
        :last-applied="lastApplied"
        :reminder-time="reminderTime"
        :skin-type="skinType"
        @request-location="requestLocationPermission"
        @apply-sunscreen="applySunscreen"
        @set-reminder-time="setReminderTime"
        @set-skin-type="setSkinType"
      />
    </main>

    <!-- Footer -->
    <footer class="bg-amber-800 text-white p-4">
      <div class="container mx-auto text-center text-sm">
        <p>This app is designed to promote sun safety awareness</p>
        <p class="mt-1">© 2025 Taeyang | Not a medical device</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { BellIcon } from 'lucide-vue-next';

export default {
  name: 'App',
  components: {
    BellIcon
  },
  data() {
    return {
      // State for current location and UV data
      currentLocation: 'Melbourne, VIC',
      uvIndex: 7,
      locationPermission: false,
      
      // State for skin type and personalization
      skinType: null,
      
      // State for sunscreen reminder
      lastApplied: null,
      reminderTime: 2, // hours
    };
  },
  methods: {
    // Request location permission
    requestLocationPermission() {
      this.locationPermission = true;
      // In a real app, would use the browser's geolocation API
    },

    // Apply sunscreen handler
    applySunscreen() {
      const now = new Date();
      this.lastApplied = now;
    },

    // Calculate time until next application
    getTimeUntilNextApplication() {
      if (!this.lastApplied) return null;
      
      const now = new Date();
      const nextApplication = new Date(this.lastApplied);
      nextApplication.setHours(nextApplication.getHours() + this.reminderTime);
      
      const diffMs = nextApplication - now;
      if (diffMs <= 0) return 'Time to reapply!';
      
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      return `${hours}h ${mins}m until next application`;
    },

    // Set reminder time
    setReminderTime(time) {
      this.reminderTime = Number(time);
    },

    // Set skin type
    setSkinType(type) {
      this.skinType = type;
    }
  }
};
</script>

<style>
/* Global styles */
</style>