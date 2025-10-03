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
      <div class="content" v-html="processedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const markdownContent = ref('');
const processedContent = ref(''); // For the final HTML
const loading = ref(true);
const error = ref(null);
const players = ref([]);
const timeCues = ref([]);

// --- Playback Sync Logic ---
const activePlayer = ref(null);
const animationFrameId = ref(null);
let lastTimestamp = 0;
let lastHighlightedBlockId = null;
const lastUserScrollTime = ref(0);
let isAutoScrolling = false;

const handleScroll = () => {
  if (isAutoScrolling) {
    return; // Ignore programmatic scrolls
  }
  lastUserScrollTime.value = Date.now();
};

const parseTimeToSeconds = (timeStr) => {
  const parts = timeStr.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseFloat(parts[1]);
  return minutes * 60 + seconds;
};

function syncLoop() {
  if (!activePlayer.value || typeof activePlayer.value.getCurrentTime !== 'function') {
    return;
  }

  const currentTime = activePlayer.value.getCurrentTime();
  const playerIndex = players.value.findIndex(p => p === activePlayer.value);

  if (playerIndex === -1) return;

  for (const cue of timeCues.value) {
    const cueTime = cue.times[playerIndex];
    if (cueTime !== undefined && currentTime >= cueTime && (!lastTimestamp || lastTimestamp < cueTime)) {
      const element = document.getElementById(cue.elementId);
      if (element) {
        if (lastHighlightedBlockId && lastHighlightedBlockId !== cue.elementId) {
          const lastElement = document.getElementById(lastHighlightedBlockId);
          if (lastElement) lastElement.classList.remove('highlight-active');
        }
        element.classList.add('highlight-active');
        lastHighlightedBlockId = cue.elementId;

        // Scroll only if user hasn't scrolled in the last second
        if (Date.now() - lastUserScrollTime.value > 1000) {
          isAutoScrolling = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { isAutoScrolling = false; }, 1200); // Reset flag after scroll animation
        }
      }
    }
  }
  
  lastTimestamp = currentTime;
  animationFrameId.value = requestAnimationFrame(syncLoop);
}

const stopSyncLoop = () => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  if (lastHighlightedBlockId) {
    const lastElement = document.getElementById(lastHighlightedBlockId);
    if (lastElement) lastElement.classList.remove('highlight-active');
    lastHighlightedBlockId = null;
  }
  activePlayer.value = null;
};

// --- YouTube Player API Logic ---

let youtubeAPIReadyPromise = null;

const loadYouTubeAPI = () => {
  if (youtubeAPIReadyPromise) {
    console.log('loadYouTubeAPI: API promise already exists.');
    return youtubeAPIReadyPromise;
  }

  youtubeAPIReadyPromise = new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) {
      console.log('loadYouTubeAPI: YT API already loaded.');
      return resolve(window.YT);
    }

    console.log('loadYouTubeAPI: Setting window.onYouTubeIframeAPIReady.');
    window.onYouTubeIframeAPIReady = () => {
      console.log('onYouTubeIframeAPIReady: YT API is ready.');
      resolve(window.YT);
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = (error) => {
      console.error('loadYouTubeAPI: Failed to load YouTube IFrame API script:', error);
      reject(new Error('YouTube API script failed to load.'));
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag) {
      console.log('loadYouTubeAPI: Inserting script before first script tag.');
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      console.log('loadYouTubeAPI: Appending script to head.');
      document.head.appendChild(tag);
    }
  });
  return youtubeAPIReadyPromise;
};

const initPlayers = async () => {
  console.log('initPlayers: Starting player initialization.');
  try {
    const YT = await loadYouTubeAPI();
    console.log('initPlayers: YouTube API loaded. YT object:', YT);

    if (!YT || !YT.Player) {
      console.error('initPlayers: window.YT.Player is not available after API load.', YT);
      throw new Error('YouTube Player constructor not found.');
    }

    players.value.forEach(player => {
      try {
        player.destroy();
      } catch (e) {
        console.warn('initPlayers: Error destroying old player:', e);
      }
    });
    players.value = [];

    // Ensure DOM is updated before trying to find player divs
    await nextTick(); 

    if (youtubeUrls.value.length === 0) {
      console.log('initPlayers: No YouTube URLs to initialize players for.');
      return;
    }

    youtubeUrls.value.forEach((url, index) => {
      const playerId = `player-${index}`;
      const targetDiv = document.getElementById(playerId);
      if (!targetDiv) {
        console.error(`initPlayers: Target div #${playerId} not found for videoId: ${url.videoId}`);
        return;
      }
      console.log(`initPlayers: Creating player for #${playerId} with videoId: ${url.videoId}`);
      try {
        const player = new YT.Player(playerId, {
          videoId: url.videoId,
          events: { 'onStateChange': onPlayerStateChange }
        });
        players.value.push(player);
        console.log(`initPlayers: Player #${playerId} created successfully.`);
      } catch (e) {
        console.error(`initPlayers: Error creating player #${playerId} for videoId: ${url.videoId}:`, e);
      }
    });
  } catch (e) {
    console.error('initPlayers: Top-level error during player initialization:', e);
    error.value = new Error('Failed to initialize YouTube players.');
  }
};

const onPlayerStateChange = (event) => {
  if (event.data === window.YT.PlayerState.PLAYING) {
    const currentPlayerIframe = event.target.getIframe();
    players.value.forEach(player => {
      if (player.getIframe() !== currentPlayerIframe) {
        player.pauseVideo();
      }
    });
    stopSyncLoop();
    activePlayer.value = event.target;
    lastTimestamp = activePlayer.value.getCurrentTime();
    animationFrameId.value = requestAnimationFrame(syncLoop);
  } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
    if (activePlayer.value === event.target) {
      stopSyncLoop();
    }
  }
};

// --- Markdown and Content Logic ---
const youtubeUrls = ref([]);

const processMarkdown = (content) => {
  const lines = content.split('\n');
  const newUrls = [];
  const contentLines = [];
  lines.forEach(line => {
    if (line.startsWith('#')) {
      const url = line.substring(1).trim();
      if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('youtu.be/')[1].split('?')[0];
        newUrls.push({ videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` });
      }
    } else {
      contentLines.push(line);
    }
  });
  youtubeUrls.value = newUrls;

  const contentWithoutUrls = contentLines.join('\n');
  let codeBlockIndex = 0;
  const newTimeCues = [];
  let finalHtml = contentWithoutUrls.replace(/```([\s\S]*?)```/g, (match, code) => {
    const elementId = `code-block-${codeBlockIndex}`;
    let processedCode = code;
    const timeCueMatch = code.match(/__([\d:.\s]+)__/);
    if (timeCueMatch) {
      const times = timeCueMatch[1].trim().split(/\s+/).map(parseTimeToSeconds);
      newTimeCues.push({ elementId, times });
      processedCode = code.replace(timeCueMatch[0], '').trim();
    }
    codeBlockIndex++;
    return `<div id="${elementId}" class="code-block">${processedCode}</div>`;
  });
  finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
  
  timeCues.value = newTimeCues;
  processedContent.value = finalHtml;
};

watch(() => route.params.id, async (id) => {
  if (!id) return;
  try {
    loading.value = true;
    error.value = null;
    stopSyncLoop();
    const response = await fetch(`/markdowns/${id}.md`);
    if (!response.ok) throw new Error(`File not found: ${id}.md`);
    const rawContent = await response.text();
    console.log('watch: rawContent', rawContent);
    markdownContent.value = rawContent;
        processMarkdown(rawContent);
    
        await nextTick(); // Wait for DOM to update with v-for
    
        // Set loading to false here so the v-else block renders the player divs
        loading.value = false;
    
        if (youtubeUrls.value.length > 0) {
          // Poll until the first player div is actually in the DOM, with a timeout
          await new Promise((resolve, reject) => {
            const startTime = Date.now();
            const timeout = 5000; // 5 seconds timeout
    
            const poll = () => {
              if (document.getElementById('player-0')) {
                console.log('watch: player-0 div found.');
                resolve();
              } else if (Date.now() - startTime > timeout) {
                console.error('watch: Timeout waiting for player-0 div.');
                reject(new Error('Timeout waiting for player div to render.'));
              } 
              else {
                requestAnimationFrame(poll);
              }
            };
            console.log('watch: Starting poll for player-0 div.');
            poll();
          });
          await initPlayers();
        }
      } catch (e) {    error.value = e;
  } finally {
    loading.value = false;
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  stopSyncLoop();
  players.value.forEach(player => player.destroy());
  window.removeEventListener('scroll', handleScroll);
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

.code-block.highlight-active {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

body.dark-mode .code-block.highlight-active {
    box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.4);
}

@media (max-width: 560px) {
  .youtube-player {
    flex-basis: 100%;
  }
}
</style>