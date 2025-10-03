<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheSidebar from './components/TheSidebar.vue'
import FloatingButton from './components/FloatingButton.vue'
import SettingsModal from './components/SettingsModal.vue'
import PlayerControlBar from './components/PlayerControlBar.vue'

const isSidebarOpen = ref(false)
const isModalOpen = ref(false)
const mainFontSize = ref(16) // Default font size

// Playback state
const currentVideoId = ref(null);
const currentVideoTitle = ref(null);
const isPlaying = ref(false);
const isRepeating = ref(false);
const isShuffling = ref(false);

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

// Playback control methods (to be implemented later)
const handlePlayPause = () => {
  isPlaying.value = !isPlaying.value;
  // Logic to play/pause the actual player
};
const handlePlayPrevious = () => {
  console.log('Play Previous');
  // Logic to navigate to previous song
};
const handlePlayNext = () => {
  console.log('Play Next');
  // Logic to navigate to next song
};
const handleToggleRepeat = () => {
  isRepeating.value = !isRepeating.value;
};
const handleToggleShuffle = () => {
  isShuffling.value = !isShuffling.value;
};

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

    <PlayerControlBar
      :current-video-title="currentVideoTitle"
      :is-playing="isPlaying"
      :is-repeating="isRepeating"
      :is-shuffling="isShuffling"
      @play-pause="handlePlayPause"
      @play-previous="handlePlayPrevious"
      @play-next="handlePlayNext"
      @toggle-repeat="handleToggleRepeat"
      @toggle-shuffle="handleToggleShuffle"
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