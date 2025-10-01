<template>
  <header class="navbar">
    <button @click="$emit('toggle-sidebar')" class="open-btn">☰</button>
    <div class="logo">🎵 KashiASOBI</div>
    <div class="placeholder"></div>
  </header>
</template>

<script setup>
defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222;
  color: white;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.open-btn {
  background: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 22px;
}

.open-btn:hover {
  background: #555;
}

/* This is to help center the logo since the button takes up space */
.placeholder {
  width: 50px; /* Adjust to match the button width */
}
</style>
