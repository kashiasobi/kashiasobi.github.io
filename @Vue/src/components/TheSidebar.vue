<template>
  <transition name="fade">
    <div v-if="isOpen" class="sidebar-overlay" @click="$emit('close-sidebar')"></div>
  </transition>
  <transition name="slide">
    <div v-if="isOpen" class="sidebar" @click.stop>
      <ul>
        <li><a class="sidebarButton" href="/">홈</a></li>
        <hr/>
        <!-- Placeholder for song list -->
        <li>
          <a class="sidebarButton" href="/kr/30">
            <div class="sideTitle">PLAYERS</div>
            <div class="sideTitle_otherlangs">Sample</div>
          </a>
        </li>
        <!-- Add more songs here -->
      </ul>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean
});
defineEmits(['close-sidebar']);
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: #fff;
  color: #000;
  padding-top: 60px;
  z-index: 10002;
  max-height: 100vh;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  border-color: #f2285a;
  border-style: solid;
  border-width: 1px;
  padding: 15px;
  margin: 5px;
  text-align: center;
}

.sidebar ul li:hover {
  background-color: #ffe5eb;
}

.sidebar ul li a {
  color: black;
  text-decoration: none;
  text-align: left;
  display: block;
}

.sideTitle {
  font-size: 18px;
  font-weight: bold;
  color: #f2285a;
}

.sideTitle_otherlangs {
  font-size: 12px;
  color: #f2285a;
}
</style>