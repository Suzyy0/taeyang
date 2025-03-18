<template>
    <div>
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 class="font-medium mb-4">Sunscreen Application Reminder</h3>
        
        <div class="flex flex-col items-center mb-6">
          <button 
            class="bg-amber-600 text-white px-6 py-3 rounded-full mb-4 flex items-center"
            @click="$emit('apply-sunscreen')"
          >
            <sun-icon class="w-5 h-5 mr-2" />
            I just applied sunscreen
          </button>
          
          <div v-if="lastApplied" class="text-sm text-center">
            <p>Last applied: {{ getLastAppliedTime() }}</p>
            <p class="font-medium">{{ getTimeUntilNextApplication() }}</p>
          </div>
          <p v-else class="text-sm text-gray-600 text-center">
            Track when you apply sunscreen to get reminders
          </p>
        </div>
        
        <div>
          <h4 class="text-sm font-medium mb-2">Reminder Settings</h4>
          <div class="flex items-center">
            <span class="mr-3">Remind me every</span>
            <select 
              class="border rounded p-2"
              :value="reminderTime"
              @change="$emit('set-reminder-time', $event.target.value)"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-4">
        <h3 class="font-medium mb-3">Sunscreen Application Tips</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start">
            <span class="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center mr-2 mt-0.5">1</span>
            <span>Apply sunscreen 20 minutes before going outside</span>
          </li>
          <li class="flex items-start">
            <span class="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center mr-2 mt-0.5">2</span>
            <span>Use approximately 1 teaspoon for face/neck, 1 for each arm/leg</span>
          </li>
          <li class="flex items-start">
            <span class="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center mr-2 mt-0.5">3</span>
            <span>Reapply after swimming or excessive sweating</span>
          </li>
          <li class="flex items-start">
            <span class="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center mr-2 mt-0.5">4</span>
            <span>No sunscreen is completely waterproof</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { SunIcon } from 'lucide-vue-next';
  
  export default {
    name: 'Reminder',
    components: {
      SunIcon
    },
    props: {
      lastApplied: {
        type: Date,
        default: null
      },
      reminderTime: {
        type: Number,
        required: true
      }
    },
    methods: {
      getLastAppliedTime() {
        return this.lastApplied ? this.lastApplied.toLocaleTimeString() : '';
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
      }
    }
  };
  </script>