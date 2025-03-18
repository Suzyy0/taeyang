// src/components/UVTracker.vue
<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <!-- Location header with search functionality -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center">
          <map-pin-icon class="w-5 h-5 text-gray-500 mr-2" />
          <div class="relative">
            <input 
              v-if="isSearching"
              v-model="searchQuery"
              @input="searchLocations"
              @blur="hideSearchResults"
              @focus="showSearchResults"
              ref="searchInput"
              type="text"
              placeholder="Search location..."
              class="text-lg border-b border-gray-300 focus:outline-none focus:border-amber-500"
            />
            <h2 
              v-else 
              @click="startSearch"
              class="text-lg font-medium cursor-pointer"
            >
              {{ currentLocation ? `${currentLocation.locality}, ${currentLocation.state}` : 'Select Location' }}
            </h2>
            
            <!-- Search results dropdown -->
            <div 
              v-if="isSearching && searchResults.length > 0" 
              class="absolute z-10 mt-1 bg-white border rounded-md shadow-lg w-64"
            >
              <ul>
                <li 
                  v-for="result in searchResults" 
                  :key="result.id"
                  @click="selectLocation(result)"
                  class="p-2 hover:bg-amber-50 cursor-pointer"
                >
                  {{ result.locality }}, {{ result.state }} {{ result.postcode }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Location permission button -->
        <div v-if="!locationPermission">
          <button 
            class="bg-amber-600 text-white px-3 py-1 rounded-md text-sm"
            @click="requestLocation"
          >
            Use my location
          </button>
        </div>
        <span v-else class="text-sm text-gray-500">Location access granted</span>
      </div>
      
      <!-- UV Index display -->
      <div v-if="currentLocation" class="flex items-center justify-center mb-4">
        <div 
          :class="[
            'w-24 h-24 rounded-full flex items-center justify-center', 
            getUvLevelClass(uvData.uv_index), 
            'text-white'
          ]"
        >
          <div class="text-center">
            <div class="text-3xl font-bold">{{ Math.round(uvData.uv_index) }}</div>
            <div class="text-xs">{{ uvData.uv_level }}</div>
          </div>
        </div>
      </div>
      
      <!-- Location and update time -->
      <div v-if="currentLocation" class="text-center mb-4">
        <p class="text-sm text-gray-600">
          Current UV Index at {{ currentLocation.locality }}, {{ currentLocation.state }}
        </p>
        <p class="text-sm font-medium">Updated: {{ formatDateTime(uvData.measured_at) }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-4">
        <p class="text-sm text-gray-500">Loading UV data...</p>
      </div>
      
      <!-- Error message -->
      <div v-if="error" class="text-center py-2 text-red-500 text-sm">
        {{ error }}
      </div>
    </div>
    
    <!-- Protection recommendations -->
    <div v-if="recommendations" class="bg-white rounded-lg shadow-md p-4">
      <h3 class="font-medium mb-4 text-center">Recommended Sun Protection for Today</h3>
      
      <div class="space-y-3">
        <!-- Sunscreen -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span>Sunscreen</span>
          </div>
          <span class="text-sm text-gray-600">{{ recommendations.sunscreen_spf }}</span>
        </div>
        
        <!-- Hat -->
        <div 
          v-if="recommendations.hat_recommended" 
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span>Hat</span>
          </div>
          <span class="text-sm text-gray-600">{{ recommendations.hat_type }}</span>
        </div>
        
        <!-- Sunglasses -->
        <div 
          v-if="recommendations.sunglasses_recommended" 
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span>Sunglasses</span>
          </div>
          <span class="text-sm text-gray-600">UV protective</span>
        </div>
        
        <!-- Clothing -->
        <div 
          v-if="recommendations.clothing_recommended" 
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span>UPF Clothing</span>
          </div>
          <span class="text-sm text-gray-600">{{ recommendations.clothing_type }}</span>
        </div>
        
        <!-- Shade -->
        <div 
          v-if="recommendations.shade_recommended" 
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
            <span>Shade</span>
          </div>
          <span class="text-sm text-gray-600">Seek shade during peak hours</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MapPinIcon } from 'lucide-vue-next';
import axios from 'axios';

// API base URL - you can use environment variables in Vue
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  name: 'UVTracker',
  components: {
    MapPinIcon
  },
  data() {
    return {
      locationPermission: false,
      currentLocation: null,
      uvData: {
        uv_index: 0,
        uv_level: 'Unknown',
        measured_at: new Date()
      },
      recommendations: null,
      loading: false,
      error: null,
      isSearching: false,
      searchQuery: '',
      searchResults: [],
      searchTimeout: null
    };
  },
  mounted() {
    // Load saved location if available
    const savedLocationId = localStorage.getItem('preferredLocationId');
    if (savedLocationId) {
      this.loadSavedLocation(savedLocationId);
    }
  },
  methods: {
    // Format date and time
    formatDateTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    // Get color for UV level
    getUvLevelClass(level) {
      if (level <= 2) return 'bg-green-500';
      if (level <= 5) return 'bg-yellow-500';
      if (level <= 7) return 'bg-orange-500';
      if (level <= 10) return 'bg-red-500';
      return 'bg-purple-500';
    },
    
    // Load a saved location
    async loadSavedLocation(locationId) {
      try {
        this.loading = true;
        this.error = null;
        
        // Get location data
        const response = await axios.get(`${API_URL}/uv-index/${locationId}`);
        
        this.currentLocation = response.data.location;
        this.uvData = {
          uv_index: response.data.uv_index,
          uv_level: response.data.uv_level,
          measured_at: response.data.measured_at
        };
        
        // Get recommendations
        await this.fetchRecommendations(this.uvData.uv_index);
        
        this.loading = false;
      } catch (error) {
        console.error('Error loading saved location:', error);
        this.error = 'Could not load saved location.';
        this.loading = false;
      }
    },
    
    // Start location search
    startSearch() {
      this.isSearching = true;
      this.searchQuery = '';
      this.searchResults = [];
      
      // Focus the search input
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    
    // Hide search results
    hideSearchResults() {
      setTimeout(() => {
        this.isSearching = false;
      }, 200);
    },
    
    // Show search results
    showSearchResults() {
      if (this.searchQuery) {
        this.searchLocations();
      }
    },
    
    // Search locations by query
    searchLocations() {
      clearTimeout(this.searchTimeout);
      
      if (!this.searchQuery || this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }
      
      this.searchTimeout = setTimeout(async () => {
        try {
          const response = await axios.get(`${API_URL}/locations/search`, {
            params: { query: this.searchQuery }
          });
          
          this.searchResults = response.data;
        } catch (error) {
          console.error('Error searching locations:', error);
          this.error = 'Could not search locations.';
        }
      }, 300);
    },
    
    // Select a location from search results
    async selectLocation(location) {
      this.isSearching = false;
      this.loading = true;
      this.error = null;
      
      try {
        // Save the selected location
        this.currentLocation = location;
        localStorage.setItem('preferredLocationId', location.id);
        
        // Get UV data for this location
        const response = await axios.get(`${API_URL}/uv-index/${location.id}`);
        
        this.uvData = {
          uv_index: response.data.uv_index,
          uv_level: response.data.uv_level,
          measured_at: response.data.measured_at
        };
        
        // Get recommendations
        await this.fetchRecommendations(this.uvData.uv_index);
        
        this.loading = false;
      } catch (error) {
        console.error('Error fetching UV data:', error);
        this.error = 'Could not fetch UV data for the selected location.';
        this.loading = false;
      }
    },
    
    // Request user's current location
    requestLocation() {
      if (!navigator.geolocation) {
        this.error = 'Geolocation is not supported by your browser.';
        return;
      }
      
      this.loading = true;
      this.error = null;
      
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    },
    
    // Handle successful geolocation
    async handleLocationSuccess(position) {
      try {
        const { latitude, longitude } = position.coords;
        
        // Find nearest location
        const response = await axios.get(`${API_URL}/locations/nearby`, {
          params: { latitude, longitude }
        });
        
        this.currentLocation = response.data;
        this.locationPermission = true;
        localStorage.setItem('preferredLocationId', this.currentLocation.id);
        
        // Get UV data
        await this.selectLocation(this.currentLocation);
      } catch (error) {
        console.error('Error finding nearby location:', error);
        this.error = 'Could not find a location near you.';
        this.loading = false;
      }
    },
    
    // Handle geolocation error
    handleLocationError(error) {
      this.loading = false;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.error = 'Location permission denied.';
          break;
        case error.POSITION_UNAVAILABLE:
          this.error = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          this.error = 'Location request timed out.';
          break;
        default:
          this.error = 'Unknown location error.';
      }
    },
    
    // Fetch sun protection recommendations
    async fetchRecommendations(uvIndex) {
      try {
        const response = await axios.get(`${API_URL}/recommendations`, {
          params: { uvIndex }
        });
        
        this.recommendations = response.data;
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        this.error = 'Could not fetch protection recommendations.';
      }
    }
  }
};
</script>