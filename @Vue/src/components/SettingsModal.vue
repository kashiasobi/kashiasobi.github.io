<script setup>
import { ref, watch, onMounted } from 'vue';

defineProps({
  isOpen: Boolean,
  fontSize: Number
});
defineEmits(['close-modal', 'update:fontSize']);

const isDarkMode = ref(false);
const isDeepDarkMode = ref(false);

function applyTheme() {
  // Ensure only one theme is active
  if (isDeepDarkMode.value) {
    document.body.classList.add('deep-dark-mode');
    document.body.classList.remove('dark-mode');
  } else if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('deep-dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.remove('deep-dark-mode');
  }
}

watch(isDarkMode, (newVal) => {
  if (newVal) {
    isDeepDarkMode.value = false;
  }
  localStorage.setItem('darkMode', newVal);
  localStorage.setItem('deepDarkMode', 'false');
  applyTheme();
});

watch(isDeepDarkMode, (newVal) => {
  if (newVal) {
    isDarkMode.value = false;
  }
  localStorage.setItem('deepDarkMode', newVal);
  localStorage.setItem('darkMode', 'false');
  applyTheme();
});

onMounted(() => {
  isDarkMode.value = localStorage.getItem('darkMode') === 'true';
  isDeepDarkMode.value = localStorage.getItem('deepDarkMode') === 'true';
  applyTheme();
});
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h2>설정</h2>

      <div class="setting-item">
        <label for="fontSizeSlider">글씨 크기: {{ fontSize }}px</label>
        <input 
          type="range" 
          id="fontSizeSlider" 
          min="8" 
          max="48" 
          :value="fontSize"
          @input="$emit('update:fontSize', parseInt($event.target.value))"
        >
      </div>
      
      <p class="toggle-container">
        가사 원문 숨기기
        <input type="checkbox" class="toggle" id="toggleoriginal" hidden>
        <label for="toggleoriginal" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>
      <p class="toggle-container">
        가사 발음 숨기기
        <input type="checkbox" class="toggle" id="togglehatsuon" hidden>
        <label for="togglehatsuon" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>
      <p class="toggle-container">
        가사 번역 숨기기
        <input type="checkbox" class="toggle" id="toggletranslation" hidden>
        <label for="toggletranslation" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>
      <p class="toggle-container">
        함께 부르는 가사 표시하기
        <input type="checkbox" class="toggle" id="toggleisshoniutatte" hidden>
        <label for="toggleisshoniutatte" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>
      <p class="toggle-container">
        다크모드
        <input type="checkbox" id="toggleDarkmode" class="toggleDarkmode" v-model="isDarkMode" hidden>
        <label for="toggleDarkmode" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>
      <p class="toggle-container">
        딥-다크모드
        <input type="checkbox" id="toggleDeepDarkmode" class="toggleDarkmode" v-model="isDeepDarkMode" hidden>
        <label for="toggleDeepDarkmode" class="toggleSwitch">
          <span class="toggleButton"></span>
        </label>
      </p>

      <button class="close-btn" @click="$emit('close-modal')">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10003;
}

.modal {
  background: white;
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

.close-btn {
  margin-top: 10px;
  padding: 10px 20px;
  background: #f2285a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background: #ff6087;
}

.toggle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.toggleSwitch {
  width: 30px;
  height: 15px;
  display: block;
  position: relative;
  border-radius: 9px;
  background-color: #fff;
  box-shadow: 0 0 16px 3px rgba(0 0 0 / 15%);
  cursor: pointer;
}

.toggleSwitch .toggleButton {
  width: 12px;
  height: 12px;
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #f2285a;
  transition: all 0.2s ease-in;
}

input.toggle:checked ~ .toggleSwitch {
  background: #f2285a;
}

input.toggle:checked ~ .toggleSwitch .toggleButton {
  left: calc(100% - 13px);
  background: #fff;
}
</style>