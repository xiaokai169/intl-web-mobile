<template>
  <div class="video-player">
    <!-- controls 交给浏览器原生控制栏：进度、音量、全屏都在里面。
         自己拼一套的话，移动端拿不到音量控制（iOS 根本不允许 JS 改音量），全屏也得走各家的私有 API。 -->
    <video
      ref="videoRef"
      class="video-el"
      :poster="poster"
      :muted="muted"
      controls
      playsinline
      webkit-playsinline
      preload="metadata"
      @click="onVideoClick"
    ></video>

    <!-- 未播放时叠一枚品牌绿的大播放钮；开始播放就撤掉，避免压住画面、和原生控制栏重复 -->
    <button v-if="!playing" class="play-mask" type="button" @click="toggle">
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'VideoPlayer'
})

const props = withDefaults(
  defineProps<{
    /** 视频地址，支持 HLS(m3u8) 与普通 mp4 */
    src: string
    poster?: string
    /** 是否自动播放（移动端多为静音自动播放） */
    autoplay?: boolean
    /**
     * 是否静音
     *
     * 默认不静音，这样原生控制栏上的音量按钮才有意义；
     * 若将来要做「进页面即自动播放」，移动端浏览器要求必须静音，那时给调用方传 `muted`。
     */
    muted?: boolean
  }>(),
  {
    poster: '',
    autoplay: false,
    muted: false
  }
)

const videoRef = ref<HTMLVideoElement>()
const playing = ref(false)
let hls: Hls | null = null

/** 判断是否 HLS 流 */
function isHls(url: string) {
  return /\.m3u8($|\?)/i.test(url)
}

function destroyHls() {
  if (hls) {
    hls.destroy()
    hls = null
  }
}

function loadSource(url: string) {
  const el = videoRef.value
  if (!el || !url) return
  destroyHls()

  if (isHls(url) && Hls.isSupported()) {
    hls = new Hls({
      // 移动端网络波动较大，放宽重试策略
      manifestLoadingMaxRetry: 3,
      levelLoadingMaxRetry: 3,
      fragLoadingMaxRetry: 3
    })
    hls.loadSource(url)
    hls.attachMedia(el)
  } else {
    // Safari 原生支持 HLS，直接赋值
    el.src = url
  }
}

function toggle() {
  const el = videoRef.value
  if (!el) return
  if (el.paused) {
    el.play().catch(() => {
      /* 浏览器策略拦截时静默失败 */
    })
  } else {
    el.pause()
  }
}

/**
 * 播放中不接管视频本体的点击
 *
 * 有原生控制栏之后，点全屏 / 音量这些按钮的坐标也在视频上，
 * 这里的 click 一旦响应就会把视频暂停——交给控制栏处理即可。
 */
function onVideoClick() {
  if (!playing.value) toggle()
}

onMounted(() => {
  loadSource(props.src)

  const el = videoRef.value
  if (!el) return
  el.addEventListener('play', () => (playing.value = true))
  el.addEventListener('pause', () => (playing.value = false))
  el.addEventListener('ended', () => (playing.value = false))

  if (props.autoplay) {
    el.play().catch(() => {
      /* 自动播放被拦截 */
    })
  }
})

watch(
  () => props.src,
  (url) => {
    playing.value = false
    loadSource(url)
  }
)

onBeforeUnmount(() => {
  destroyHls()
})
</script>

<style scoped lang="scss">
.video-player {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #cfe6c6;
  border-radius: 6px;
  overflow: hidden;

  .video-el {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* 未播放时的品牌绿播放钮 */
  .play-mask {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(37, 110, 27, 0.72);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);

    &:active {
      background: rgba(37, 110, 27, 0.9);
    }
  }
}
</style>
