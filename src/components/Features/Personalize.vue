<template>
    <div>
      <div class="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 class="font-medium mb-4">Select Your Skin Type</h3>
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="type in skinTypeInfo" 
            :key="type.id"
            :class="[
              'border rounded-lg p-3 cursor-pointer hover:bg-amber-50 transition',
              skinType === type.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
            ]"
            @click="$emit('set-skin-type', type.id)"
          >
            <h4 class="font-medium">{{ type.name }}</h4>
            <p class="text-sm text-gray-600">{{ type.color }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="skinType" class="bg-white rounded-lg shadow-md p-4">
        <h3 class="font-medium mb-4">Your Personalized Recommendations</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <sun-icon class="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h4 class="font-medium">Recommended SPF</h4>
              <p>{{ selectedSkinType.spf }}</p>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <clock-icon class="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 class="font-medium">Safe Sun Exposure</h4>
              <p>Approximately {{ selectedSkinType.exposure }} without protection</p>
            </div>
          </div>
          <div class="bg-amber-50 p-3 rounded-md">
            <p class="text-sm">
              <strong>Note:</strong> People with darker skin tones may need longer sun exposure for adequate vitamin D production but should still protect against UV damage.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { SunIcon, ClockIcon } from 'lucide-vue-next';
  
  export default {
    name: 'Personalize',
    components: {
      SunIcon,
      ClockIcon
    },
    props: {
      skinType: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        // Skin type recommendations
        skinTypeInfo: [
          { id: 1, name: 'Type I', color: 'Very fair, always burns', spf: 'SPF 50+', exposure: '5-10 mins' },
          { id: 2, name: 'Type II', color: 'Fair, burns easily', spf: 'SPF 50', exposure: '10-15 mins' },
          { id: 3, name: 'Type III', color: 'Medium, sometimes burns', spf: 'SPF 30+', exposure: '15-20 mins' },
          { id: 4, name: 'Type IV', color: 'Olive, rarely burns', spf: 'SPF 30', exposure: '20-30 mins' },
          { id: 5, name: 'Type V', color: 'Brown, very rarely burns', spf: 'SPF 15+', exposure: '30-40 mins' },
          { id: 6, name: 'Type VI', color: 'Dark brown/black, rarely burns', spf: 'SPF 15', exposure: '40+ mins' }
        ]
      };
    },
    computed: {
      selectedSkinType() {
        if (!this.skinType) return null;
        return this.skinTypeInfo.find(type => type.id === this.skinType);
      }
    }
  };
  </script>