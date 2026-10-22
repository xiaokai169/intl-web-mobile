<template>
  <div class="china">
    <!-- video / pdf 两个页签：与桌面端 aboutUs 组件一致（桌面端这两处文案也是硬编码） -->
    <div class="switcher">
      <button
        type="button"
        class="sw-btn"
        :class="{ active: tab === 'video' }"
        @click="tab = 'video'"
      >
        video
      </button>
      <button type="button" class="sw-btn" :class="{ active: tab === 'pdf' }" @click="tab = 'pdf'">
        pdf
      </button>
    </div>

    <VideoPlayer v-if="tab === 'video'" :src="videoSrc" />

    <div v-else class="gallery">
      <img v-for="(item, i) in sortedImages" :key="i" :src="item" alt="" loading="lazy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoPlayer from '@/components/VideoPlayer.vue'
import { computed, ref } from 'vue'

defineOptions({
  name: 'ChinaPage'
})

/** 与桌面端 aboutUs 组件同源：video 页签放宣传片，pdf 页签放 aboutUs 图集 */
const tab = ref<'video' | 'pdf'>('video')
const videoSrc = 'https://files.arab-bee.com/website_video/two/master.m3u8'

/**
 * 图集：对应桌面端的 import.meta.glob('@/assets/img/aboutUs/*.webp')
 * 桌面端按构建后 URL 里的数字排序，这里直接按文件路径里的数字排，结果一致。
 */
const modules = import.meta.glob('@/assets/img/aboutUs/*.webp', { eager: true }) as Record<
  string,
  { default: string }
>

function pageNo(path: string) {
  const match = path.match(/page_(\d+)_/)
  return match ? parseInt(match[1], 10) : 0
}

const sortedImages = computed(() =>
  Object.keys(modules)
    .sort((a, b) => pageNo(a) - pageNo(b))
    .map((key) => modules[key].default)
)
</script>

<style scoped lang="scss">
.china {
  padding: 4px 0 16px;
}

.switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;

  .sw-btn {
    flex: 0 0 auto;
    font: inherit;
    font-size: 12px;
    color: #0ba252;
    background: #fff;
    border: 1px solid #0ba252;
    border-radius: 6px;
    padding: 0 16px;
    height: 32px;
    cursor: pointer;

    &.active {
      color: #fff;
      background: linear-gradient(90deg, #104e40 0%, #0ba252 100%);
      border-color: transparent;
    }
  }
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 8px;

  img {
    display: block;
    width: 100%;
    border-radius: 6px;
  }
}
</style>
