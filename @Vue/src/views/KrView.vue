<template>
  <div class="kr-view">
    <div v-if="error" class="error">
      <p>Error loading content: {{ error.message }}</p>
    </div>
    <div v-else-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div class="youtube-container">
        <div v-for="(url, index) in youtubeUrls" :key="index" class="youtube-player">
          <div :id="`player-${index}`"></div>
        </div>
      </div>
      <div class="content" v-html="formattedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const markdownContent = ref('');
const loading = ref(true);
const error = ref(null);
const players = ref([]);

// --- YouTube Player API Logic ---

// 1. Load the YouTube IFrame Player API script
const loadYouTubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      return resolve(window.YT);
    }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
    };
  });
};

// 2. Initialize players for each YouTube URL
const initPlayers = async () => {
  await loadYouTubeAPI();
  
  players.value.forEach(player => player.destroy());
  players.value = [];

  await nextTick();

  youtubeUrls.value.forEach((url, index) => {
    const videoId = url.split('/').pop().split('?')[0];
    const player = new window.YT.Player(`player-${index}`, {
      videoId: videoId,
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
    players.value.push(player);
  });
};

// 3. Handle player state changes to pause other videos
const onPlayerStateChange = (event) => {
  if (event.data === window.YT.PlayerState.PLAYING) {
    const currentPlayerIframe = event.target.getIframe();
    players.value.forEach(player => {
      if (player.getIframe() !== currentPlayerIframe) {
        player.pauseVideo();
      }
    });
  }
};

// --- Markdown and Content Logic ---

watch(() => route.params.id, async (id) => {
  if (!id) return;

  try {
    loading.value = true;
    error.value = null;
    const response = await fetch(`/markdowns/${id}.md`);
    if (!response.ok) {
      throw new Error(`File not found: ${id}.md`);
    }
    markdownContent.value = await response.text();
    initPlayers(); // Re-initialize players when content changes
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false;
  }
}, { immediate: true });

const youtubeUrls = computed(() => {
  if (!markdownContent.value) return [];
  const lines = markdownContent.value.split('\n');
  const urls = [];
  for (const line of lines) {
    if (line.startsWith('#')) {
      const url = line.substring(1).trim();
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        urls.push(`https://www.youtube.com/embed/${videoId}`);
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        urls.push(`https://www.youtube.com/embed/${videoId}`);
      }
    }
  }
  return urls;
});

const contentWithoutYoutubeLinks = computed(() => {
  if (!markdownContent.value) return '';
  return markdownContent.value.split('\n').filter(line => !line.startsWith('#')).join('\n');
});

const formattedContent = computed(() => {
  if (!contentWithoutYoutubeLinks.value) return '';
  return contentWithoutYoutubeLinks.value
    .replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
    .replace(/```([\s\S]*?)```/g, '<div class="code-block">$1</div>');
});
</script>

<style>
.kr-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: pre-line;
  font-family: sans-serif;
  line-height: 1.6;
  text-align: center;
  font-size: var(--main-font-size, 16px);
}
.loading, .error {
  text-align: center;
  font-size: 1.2em;
  color: #888;
}
.youtube-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}
.youtube-player {
  position: relative;
  max-width: 560px;
  aspect-ratio: 16 / 9;
  flex: 1 1 100%;
}
.youtube-player iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (max-width: 560px) {
  .youtube-player {
    flex-basis: 100%;
  }
}
</style>