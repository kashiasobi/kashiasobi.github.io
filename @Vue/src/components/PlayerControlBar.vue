<template>
  <div class="player-control-bar">
    <div class="song-info">
      <span class="current-song-title">{{ currentVideoTitle || '재생 중인 곡 없음' }}</span>
    </div>
    <div class="controls">
      <button @click="toggleShuffle" :class="{ active: isShuffling }" title="셔플">&#128256;</button>
      <button @click="playPrevious" title="이전 곡">&#9198;</button>
      <button @click="togglePlayPause" :title="isPlaying ? '일시 정지' : '재생'">
        <span v-if="isPlaying">&#9208;</span>
        <span v-else>&#9658;</span>
      </button>
      <button @click="playNext" title="다음 곡">&#9199;</button>
      <button @click="toggleRepeat" :class="{ active: isRepeating }" title="반복">&#8634;</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentVideoTitle: String,
  isPlaying: Boolean,
  isRepeating: Boolean,
  isShuffling: Boolean,
});

const emit = defineEmits([
  'playPause',
  'playPrevious',
  'playNext',
  'toggleRepeat',
  'toggleShuffle',
]);

const togglePlayPause = () => emit('playPause');
const playPrevious = () => emit('playPrevious');
const playNext = () => emit('playNext');
const toggleRepeat = () => emit('toggleRepeat');
const toggleShuffle = () => emit('toggleShuffle');
</script>

<style scoped>
.player-control-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #222; /* Dark background */
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  z-index: 100000; /* Ensure it's above other content */
}

.song-info {
  flex-grow: 1;
  text-align: left;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls button {
  background-color: #ff6087; /* Accent color */
  color: white;
  border: none;
  padding: 8px 12px; /* Adjusted padding for icons */
  margin: 0 3px; /* Adjusted margin */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.2em; /* Larger font size for icons */
}

.controls button:hover {
  background-color: #f2285a;
}

.controls button.active {
  background-color: #f2285a; /* Highlight active state */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .player-control-bar {
    flex-direction: column;
    padding: 10px;
  }
  .controls {
    margin-top: 10px;
  }
  .controls button {
    padding: 6px 10px;
    margin: 0 3px;
    font-size: 1em;
  }
}
</style>