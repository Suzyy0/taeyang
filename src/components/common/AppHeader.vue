<template>
    <nav class="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="5" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m-10-10H2m20 0h-2m-8-8l-2-2m12 0l-2 2m0 16l2-2m-12 0l-2 2" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold tracking-wider">SunSafe Australia</h1>
          </div>
          <div class="flex space-x-1">
            <button class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Home
            </button>
            <button class="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Personal Settings
            </button>
            <button class="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Resources
            </button>
            <button class="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
              Information
            </button>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AppHeader'
  }
  </script>