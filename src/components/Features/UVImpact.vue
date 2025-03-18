<template>
    <div>
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 class="font-medium mb-4">Skin Cancer Trends in Australia</h3>
        <div class="h-64 mb-4">
          <!-- Simplified visualization -->
          <div class="h-full flex items-end space-x-1">
            <div 
              v-for="(year, idx) in cancerData.years" 
              :key="idx" 
              class="flex-1 flex flex-col items-center"
            >
              <div 
                class="w-full bg-amber-500 rounded-t" 
                :style="{height: `${(cancerData.cases[idx] / 20000) * 100}%`}"
              ></div>
              <span class="text-xs mt-1 transform -rotate-45 origin-top-left">{{ year }}</span>
            </div>
          </div>
        </div>
        <p class="text-sm text-gray-600">Melanoma cases per year in Australia</p>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-4">
        <h3 class="font-medium mb-4">Did You Know?</h3>
        <div class="space-y-4">
          <div class="flex">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <info-icon class="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p class="text-sm">2 in 3 Australians will be diagnosed with skin cancer by age 70</p>
            </div>
          </div>
          <div class="flex">
            <div class="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <info-icon class="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p class="text-sm">More than 2,000 Australians die from skin cancer each year</p>
            </div>
          </div>
          <div class="flex">
            <div class="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <info-icon class="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p class="text-sm">UV radiation can damage skin even on cooler or cloudy days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { InfoIcon } from 'lucide-vue-next';
  
  export default {
    name: 'UVImpact',
    components: {
      InfoIcon
    },
    data() {
      return {
        // Mock cancer data for visualizations
        cancerData: {
          years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
          cases: [13200, 13800, 14100, 14500, 15000, 15400, 15900, 16200, 16600]
        }
      };
    }
  };
  </script>