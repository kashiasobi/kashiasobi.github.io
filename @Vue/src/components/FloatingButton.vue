<template>
  <button class="floating-btn" @click="$emit('open-modal')">+</button>
</template>

<script setup>
defineEmits(['open-modal']);
</script>

<style scoped>
.floating-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  background-color: #ff6087;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  z-index: 999;
}

.floating-btn:hover {
  background-color: #f2285a;
  transform: scale(1.1);
}
</style>
