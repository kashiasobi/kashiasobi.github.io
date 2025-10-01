<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'
import FloatingButton from './components/FloatingButton.vue'
import SettingsModal from './components/SettingsModal.vue'

const isSidebarOpen = ref(false)
const isModalOpen = ref(false)
const mainFontSize = ref(16) // Default font size

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeModal = () => {
  isModalOpen.value = false
}

const openModal = () => {
  isModalOpen.value = true
}

const updateFontSize = (size) => {
  mainFontSize.value = size
}
</script>

<template>
  <div id="app-layout">
    <TheHeader @toggle-sidebar="toggleSidebar" />
    <TheSidebar :is-open="isSidebarOpen" @close-sidebar="toggleSidebar" />
    <FloatingButton @open-modal="openModal" />
    
    <main class="main-content" :style="{ '--main-font-size': mainFontSize + 'px' }">
      <RouterView />
    </main>
    
    <SettingsModal 
      :is-open="isModalOpen" 
      :font-size="mainFontSize"
      @close-modal="closeModal" 
      @update:font-size="updateFontSize"
    />
  </div>
</template>

<style scoped>
#app-layout {
  padding-top: 60px; /* Height of the header */
}

.main-content {
  width: 100%;
  max-width: 1200px; /* Adjust max-width as needed */
  margin: 0 auto; /* Center the block */
  padding: 20px;
  box-sizing: border-box;
}
</style>