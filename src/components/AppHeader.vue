<template>
  <header class="app-header">
    <div class="logos">
      <div class="logo-badge">
        <img src="@/assets/img/logo_001.png" alt="Council of Arab Economic Unity" />
      </div>
      <div class="logo-badge">
        <img src="@/assets/img/logo_002.png" alt="Arab Exporters and Importers Union" />
      </div>
    </div>

    <div class="titles">
      <p class="t1">{{ $t('home_title1') }}</p>
      <p class="t2">{{ $t('home_title') }}</p>
    </div>
  </header>

  <!-- 语言切换按钮：对照设计稿 —— 底色是 4094:103 那个绿渐变胶囊
       (#104e40 → #0ba252, 88×24 @ 画板 271,140)，内容 4094:104 叠在上面。
       只显示当前语言那一面圆形旗，点它切到另一种语言；
       旗右下角带一枚双向箭头表示可切换。
       只有首页用 AppHeader——二级页面按设计稿 4094:305 走 page-bar 那套。 -->
  <div class="lang-switch">
    <button type="button" class="lang-btn" :title="langLabel" @click="switchLang">
      <span class="flag" :class="appStore.language">
        <img :src="currentFlag.src" :alt="currentFlag.alt" />
        <svg class="switch-icon" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0.6 3.1h5.2V1.4L9.2 3.6 5.8 5.8V4.1H0.6z" />
          <path d="M9.4 6.9H4.2v1.7L0.8 6.4 4.2 4.2v1.7h5.2z" />
        </svg>
      </span>
      <span class="lang-label">{{ langLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import uaeFlag from '@/assets/img/Flag_of_the_United_Arab_Emirates.svg.png'
import usFlag from '@/assets/img/flag_us.png'

defineOptions({
  name: 'AppHeader'
})

const appStore = useAppStore()

/** 各语言对应的圆形旗 */
const flags: Record<string, { src: string; alt: string }> = {
  arabic: { src: uaeFlag, alt: 'العربية' },
  en: { src: usFlag, alt: 'English' }
}

/** 当前语言那一面旗 */
const currentFlag = computed(() => flags[appStore.language] ?? flags.en)

/** 右侧文字：跟随当前语言 */
const langLabel = computed(() => (appStore.language === 'arabic' ? 'العربية' : 'English'))

/** 点旗子切到另一种语言 */
function switchLang() {
  const next = appStore.language === 'arabic' ? 'en' : 'arabic'
  appStore.changeLanguage(next)
  // 与桌面端行为一致：切换语言后整页刷新，保证各组件文本同步
  window.location.reload()
}
</script>

<style scoped lang="scss">
/* 顶栏：整块铺设计稿「顶部框」(4094:80) 的导出切图，
   横向绿渐变 + 四周金色描边都在图里，无需再用 CSS 拼。
   切图本身是 375×64，所以内边距要凑出 64 高（12 + logo 40 + 12），
   否则 background-size: 100% 100% 会把图纵向拉伸。 */
.app-header {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  /* 与标题之间的 10px 由 .titles 的 padding-inline-start 给，这里不再叠 gap */
  gap: 0;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background-color: #104e40;
  background-image: url('@/assets/img/header_bg_001.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  z-index: 20;
}

.logos {
  display: flex;
  align-items: center;
  flex: 0 0 auto;

  /* 素材 logo_001 / logo_002 自身就带了浅青绿底和金色描边，
     所以这里只做圆形裁切 + 投影，不能再叠白底和 border，
     否则圈会叠成两层。 */
  .logo-badge {
    /* 设计稿 4094:97 / 4094:91：两个都是 40×40，
       位置 16 和 62 —— 中间留 6px 间隙，不是叠在一起。 */
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);

    & + .logo-badge {
      margin-inline-start: 6px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
  }
}

/* 标题：设计稿 4094:90 是一个两行文本，13px / Medium / 行高 20，
   深色字(#001a14) + 黄绿描边。
   描边用多层 text-shadow 拼外侧——`-webkit-text-stroke` 是居中描边，
   在 13px 的字上会把笔画啃细。 */
.titles {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  /* 距左侧第二个 logo 右边 10px（设计稿：logo 到 102，文字从 112 起） */
  padding-inline-start: 10px;

  p {
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #001a14;
    text-shadow:
      -1px -1px 0 #b8d94c,
      1px -1px 0 #b8d94c,
      -1px 1px 0 #b8d94c,
      1px 1px 0 #b8d94c,
      0 -1px 0 #b8d94c,
      0 1px 0 #b8d94c,
      -1px 0 0 #b8d94c,
      1px 0 0 #b8d94c;
  }
}

/* ===== 语言切换：紧贴顶栏下方，靠右 ===== */
.lang-switch {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* 设计稿里这个按钮高 24、距画板右边 16px、上沿正好贴着顶栏底边。
     两个语言版本都靠右，所以锁死 ltr —— 否则 RTL 下 flex-end 会翻到左边去。 */
  direction: ltr;
  height: 24px;
  padding: 0 16px;
}

/* 按钮底：设计稿 4094:103 的绿渐变胶囊（#104e40 → #0ba252） */
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 10px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(180deg, #104e40 0%, #0ba252 100%);
  color: #fff;
  cursor: pointer;

  &:active {
    opacity: 0.88;
  }
}

.flag {
  position: relative;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* 右下角的双向切换箭头 */
  .switch-icon {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 8px;
    height: 8px;
  }

  /* 箭头配色跟设计稿一致：阿语旗上是黑色、英语旗上是红色 */
  &.arabic .switch-icon {
    fill: #111;
  }

  &.en .switch-icon {
    fill: #c8102e;
  }
}

.lang-label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  color: #fff;
}
</style>
