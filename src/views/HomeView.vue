<template>
  <div class="home">
    <AppHeader />

    <main ref="mainRef" class="home-main scroll-y" @scroll.passive="onMainScroll">
      <!-- 主视频 -->
      <section class="hero">
        <VideoPlayer :src="videoSrc" />
      </section>

      <!-- Arab Bee Platform 入口卡片 -->
      <section class="platform-card">
        <span class="tag">{{ $t('router_link_08') }}</span>
        <h2 class="card-title">Arab Bee Platform</h2>
        <img class="deco" src="@/assets/img/home-platform-deco.png" alt="" />
      </section>

      <!-- 四大板块快捷入口 -->
      <nav class="quick-nav">
        <div v-for="item in navList" :key="item.to" class="quick-item" @click="toRouLink(item)">
          <div class="hex">
            <span class="hex-inner">
              <img :src="item.path" :alt="String(item.name)" />
            </span>
          </div>
          <p class="label">{{ item.name }}</p>
        </div>
      </nav>

      <!-- 一级 Tab -->
      <nav class="tab-bar">
        <button v-for="item in listDate" :key="item.id" type="button" class="tab"
          :class="{ active: activeItem === item.id }" @click="menuClickFn(item)">
          {{ item.name }}
        </button>
      </nav>

      <!-- 二级菜单 -->
      <div v-if="mainList.length" class="sub-menu">
        <button v-for="item in mainList" :key="item.id" type="button" class="sub-item"
          :class="{ active: activeLeftItem === item.id }" :disabled="emptyMenuIds.includes(item.id)"
          @click="leftTabFn(item)">
          <span class="ico" v-html="iconMap[item.key]" />
          {{ item.name }}
        </button>
      </div>

      <!-- 内容区 -->
      <section class="content-area">
        <component :is="currentComponent" v-if="currentComponent" />
        <p v-else class="intro">{{ $t('home_intro') }}</p>
      </section>
    </main>

    <footer class="app-footer">{{ $t('footer_16') }}</footer>

    <!-- 回到顶部：滚动过一屏才浮出来 -->
    <button type="button" class="back-top" :class="{ 'is-visible': showBackTop }" :aria-label="$t('back_to_top')"
      @click="backToTop">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V6M5.5 12.5L12 6l6.5 6.5" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import AboutUs from './components/AboutUs.vue'
import ActivitiesServices from './components/ActivitiesServices.vue'
import TrainingPrograms from './components/TrainingPrograms.vue'
import ContactUs from './components/ContactUs.vue'
import Placeholder from './components/Placeholder.vue'
import Exhibitions from './components/Exhibitions.vue'
import GeneralSecretary from './components/GeneralSecretary.vue'
import RegionalOfficePage from './components/RegionalOfficePage.vue'
import Presidency from './components/Presidency.vue'
import ChinaPage from './components/ChinaPage.vue'
import iconArabFund from '@/assets/img/icon-arab-fund.png'
import iconExportBank from '@/assets/img/icon-export-bank.png'
import iconArabBee from '@/assets/img/icon-arab-bee.png'
import iconEconomicCity from '@/assets/img/icon-economic-city.png'
import { computed, ref, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'HomeView'
})

const { t } = useI18n()
const router = useRouter()

/** 视频源：与桌面端首页一致 */
const videoSrc = ref('https://files.arab-bee.com/website_video/one/master.m3u8')

/** 四大板块快捷入口
 *
 * 注意：这里必须用静态 import。桌面端用的 new URL(`.../${name}`, import.meta.url)
 * 是运行时拼接，Vite 无法静态分析，会把 assets/img 整个目录当成依赖打进产物。
 */
const navList = [
  { name: t('router_link_01'), to: '/arabFund', path: iconArabFund },
  { name: t('router_link_02'), to: '/arabExportAndImportBank', path: iconExportBank },
  { name: t('router_link_04'), to: '/beeFinancialServiceGroup', path: iconArabBee },
  { name: t('router_link_06'), to: '/economics', path: iconEconomicCity }
]

/** 一级 Tab */
type MenuList = { id: string; name: string }
const listDate = ref<MenuList[]>([
  { name: t('menu_text_01'), id: '001' },
  { name: t('menu_text_09'), id: '003' },
  { name: t('menu_text_10'), id: '005' },
  { name: t('menu_text_06'), id: '007' },
  { name: t('menu_text_08'), id: '009' }
])

/** 二级菜单（Home Page 下展示全部 8 项） */
type MainList = { id: number; name: string; key: string }
const manList: MainList[] = [
  { id: 1, name: t('menu_left_text_01'), key: 'aboutUs' },
  { id: 2, name: t('menu_left_text_02'), key: 'activates' },
  { id: 3, name: t('menu_left_text_03'), key: 'study' },
  { id: 4, name: t('menu_left_text_04'), key: 'projects' },
  { id: 5, name: t('menu_left_text_05'), key: 'exhibitions' },
  { id: 6, name: t('menu_left_text_06'), key: 'training' },
  { id: 7, name: t('menu_left_text_07'), key: 'quality' },
  { id: 8, name: t('menu_left_text_08'), key: 'contactUs' }
]

/**
 * 没有内容的二级菜单项（Study / Projects / Quality）
 *
 * 桌面端这几项对应的组件在别处，本身也没有实际内容。移动端与其让用户点下去没有反应，
 * 不如直接置灰禁用——按钮上用 :disabled，点不动，视觉上也表明「这里还没有东西」。
 */
const emptyMenuIds = [3, 4, 7]

const activeItem = ref<string>('001')
const activeLeftItem = ref<number>(1)
const mainList = ref<MainList[]>(manList)

/** 二级菜单按钮图标（对照设计稿按钮左侧的小图标，内联 SVG 免去额外请求） */
const iconMap: Record<string, string> = {
  aboutUs:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c0-3.2 2.9-5.4 6.5-5.4s6.5 2.2 6.5 5.4"/></svg>',
  activates:
    '<svg viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7.5 9.5h9M7.5 13h9M7.5 16.5h5.5"/></svg>',
  study:
    '<svg viewBox="0 0 24 24"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9z"/><path d="M6.5 11.2V16c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.8"/></svg>',
  projects:
    '<svg viewBox="0 0 24 24"><path d="M3.5 7a2 2 0 012-2h3.4l2 2h7.6a2 2 0 012 2v8.5a2 2 0 01-2 2H5.5a2 2 0 01-2-2V7z"/></svg>',
  exhibitions:
    '<svg viewBox="0 0 24 24"><path d="M3 20V9.5L12 4l9 5.5V20"/><path d="M9 20v-6.5h6V20"/></svg>',
  training:
    '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="11.5" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  quality:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="9.5" r="5"/><path d="M8.6 13.8L7 21l5-2.4L17 21l-1.6-7.2"/></svg>',
  contactUs:
    '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/></svg>'
}

/**
 * 二级菜单 -> 内容组件
 *
 * 说明：Study / Projects / Quality 没有内容，界面上已按 emptyMenuIds 置灰禁用，
 * 这里给它们挂占位组件只是兜底（正常路径下点不到，activeLeftItem 不会等于这几个 id）。
 */
const contentMap: Record<number, Component> = {
  1: AboutUs, // About Us —— 联盟介绍
  2: ActivitiesServices, // Activities and Services —— 联盟服务清单（与桌面端同源）+ 论坛活动
  3: Placeholder, // Study —— 无内容，已置灰禁用
  4: Placeholder, // Projects —— 无内容，已置灰禁用
  5: Exhibitions, // Exhibitions —— 桌面端 boardOfGeneral 同款素材
  6: TrainingPrograms, // Training —— 培训项目
  7: Placeholder, // Quality —— 无内容，已置灰禁用
  8: ContactUs // Contact Us —— 联系方式
}

/**
 * 一级菜单 -> 直接内容
 *
 * Home Page(001) 走上面的二级菜单；其余 Tab 在设计稿里就是独立板块，直接给内容。
 */
const tabContentMap: Record<string, Component> = {
  '003': Presidency, // Presidency —— 对齐桌面端 Services 组件（实际只展示 active_001 图）
  '005': GeneralSecretary, // General Secretariat —— 对齐桌面端 Media 组件（秘书长名片图）
  '007': RegionalOfficePage, // Regional Office —— 对齐桌面端 regionalOfficePage（两个「开发中」占位卡片）
  '009': ChinaPage // China —— 对齐桌面端 aboutUs 组件（video / pdf 两个页签）
}

const currentComponent = computed<Component | null>(() => {
  if (activeItem.value === '001') {
    return contentMap[activeLeftItem.value] ?? null
  }
  return tabContentMap[activeItem.value] ?? null
})

const regex = /^(http|https):/

function toRouLink(item: { to: string }) {
  if (regex.test(item.to)) {
    window.open(item.to)
  } else {
    router.push(item.to)
  }
}

/** 一级 Tab 切换：决定二级菜单展示与默认选中项 */
function menuClickFn(item: MenuList) {
  activeItem.value = item.id
  if (item.id === '001') {
    mainList.value = manList
    activeLeftItem.value = 1
  } else {
    mainList.value = []
    activeLeftItem.value = 0
  }
}

/** 二级菜单切换：只换内容，不动滚动位置（没有内容的项是 disabled 的，点不进来） */
function leftTabFn(item: MainList) {
  activeLeftItem.value = item.id
}

const mainRef = ref<HTMLElement | null>(null)
const showBackTop = ref(false)

/** 滚动过一屏多才浮出回到顶部，免得首屏就压着一块浮层 */
function onMainScroll() {
  showBackTop.value = (mainRef.value?.scrollTop ?? 0) > 360
}

function backToTop() {
  mainRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
/* 整页深绿伊斯兰花纹底（对照设计稿） */
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  /* 背景 = 设计稿「背景图」(4094:14) 的导出切图：
     深绿 #064a31 底 + 极淡的细纹理。
     原来铺的 home-bg-pattern.png 是大朵伊斯兰花、又密又亮，与设计稿不符，已撤掉。
     .home 高度即视口高度、内容在 .home-main 里滚，所以背景固定不滚动。 */
  background-color: #064a31;
  background-image: url('@/assets/img/home_bgc.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.home-main {
  flex: 1 1 auto;
  min-height: 0;
}

/* ===== 视频：白色圆角卡片 ===== */
.hero {
  padding: 14px 16px 0;

  :deep(.video-player) {
    background: #f4f9f0;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  }

  :deep(.play-mask) {
    width: 62px;
    height: 62px;
    background: rgba(255, 255, 255, 0.9);
    color: #2f8a22;
  }
}

/* ===== Arab Bee Platform 卡片（对照设计稿 Group 1707482005：343×64） ===== */
.platform-card {
  position: relative;
  height: 64px;
  margin: 14px 16px 0;
  border-radius: 6px;
  background: linear-gradient(to top, #bbf0d8 0%, #ebfff2 50%, #edfaf6 100%);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);

  /* 标签：左上角，绿渐变底白字（设计稿 80×20 @ left 12 / top 0） */
  .tag {
    position: absolute;
    left: 12px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 20px;
    font-size: 10px;
    line-height: 1;
    color: #fff;
    background: linear-gradient(90deg, #104e40 0%, #0ba252 100%);
    border-radius: 4px;
  }

  /* 标题：左下，16px Bold（设计稿 @ left 16 / top 28，行高 24） */
  .card-title {
    position: absolute;
    left: 16px;
    top: 28px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #064a31;
  }

  /* 装饰图：右侧并向上溢出卡片（设计稿 4094:117 @ right 16 / top -12，73×64） */
  .deco {
    position: absolute;
    right: 16px;
    top: -12px;
    width: 73px;
    height: 64px;
  }
}

/* ===== 四大板块：金色六边形徽章 ===== */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 16px 10px 14px;

  .quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    text-align: center;

    &:active {
      opacity: 0.8;
    }
  }

  /* 金色立体六边形底图 —— 设计稿里的徽章质感 */
  .hex {
    width: 62px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('@/assets/img/home-hex-gold.png') no-repeat center;
    background-size: contain;
  }

  .hex-inner {
    width: 43px;
    height: 43px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 34px;
      height: 34px;
      object-fit: contain;
    }
  }

  .label {
    font-size: 10.5px;
    line-height: 1.25;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* ===== 一级 Tab：黄绿横向渐变条（设计稿 4094:21，375×60） ===== */
.tab-bar {
  /* 抬一层，让选中项下方的小尖角能盖在下面菜单的背景上 */
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  height: 60px;
  /* 左右各 10px，配合 tab 自身的 6px 内边距，让首个 tab 的文字距边正好 16px */
  padding: 0 10px;
  /* 上层：底部 16px 由半透明白渐到纯白（设计稿 4094:22），与下方白色内容卡无缝相接；
     下层：黄绿横向渐变（设计稿 4094:21，左 #e4ee86 → 右 #84bc38）。
     角度走变量，RTL 下镜像，让阅读起点那一侧始终落在最亮的浅色端。 */
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, #ffffff 100%) bottom / 100% 16px no-repeat,
    linear-gradient(var(--tab-angle, 90deg), #e4ee86 0%, #84bc38 100%);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab {
    position: relative;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    /* 44px 高的点击热区，文字（行高 24）落在 10~34，与设计稿的文字位置一致 */
    height: 44px;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    white-space: nowrap;
    /* 未选中项在设计稿里明显淡于选中项 */
    color: rgba(6, 74, 49, 0.55);
    background: transparent;
    border: none;
    padding: 0 6px;
    cursor: pointer;

    &.active {
      color: #064a31;
      font-weight: 700;

      /* 选中指示器（设计稿 4094:28）：从下方白色内容卡顶边向上探出的圆角小尖，
         48×24，底边正好落在渐变条下沿 */
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -16px;
        transform: translateX(-50%);
        width: 48px;
        height: 24px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 24'%3E%3Cpath d='M0 24C8 24 15 21.5 17 13A7.45 7.45 0 0 1 31 13C33 21.5 40 24 48 24Z' fill='%23fff'/%3E%3C/svg%3E") no-repeat center / 100% 100%;
      }

      /* 小尖里那颗圆点（设计稿 4094:30，4×4 深绿 #256e1b），压在尖角之上 */
      &::before {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -2px;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #256e1b;
        z-index: 1;
      }
    }
  }
}

/* RTL：黄绿渐变镜像，让阿语的首个 tab（排在最右）落在最亮的浅色端 */
:global(.directionRtl) .tab-bar {
  --tab-angle: 270deg;
}

/* 白色内容卡（设计稿 4094:20）：紧接渐变条下沿。
   设计稿的白卡顶部有 16px 圆角，但那是 375 画布上的画法——H5 全宽铺满时圆角外侧
   没有可露的空间，只会露出 .home 的深绿页底，反而多出两个杂色三角。
   而渐变条底部本身已经「渐白到底」（4094:22 收到 #ffffff），所以白卡直接接上就是
   无缝的，圆角在这个配色下本来也看不出来，故不设圆角、也不用补白底。 */
.sub-menu,
.content-area {
  background: #fff;
}

/* ===== 二级菜单 ===== */
.sub-menu {
  display: flex;
  gap: 8px;
  /* 顶边距按钮 16px，与白卡顶边对齐 */
  padding: 16px 16px 12px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .sub-item {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font: inherit;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    color: #0ba252;
    background: #fff;
    border: 1px solid #0ba252;
    border-radius: 6px;
    padding: 0 16px;
    height: 32px;
    cursor: pointer;

    /* 按钮左侧的小图标（设计稿 16×16，距左 16） */
    .ico {
      display: inline-flex;
      align-items: center;

      :deep(svg) {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    /* 选中态：绿渐变底（设计稿 #104e40 → #0ba252），无描边 */
    &.active {
      color: #fff;
      background: linear-gradient(90deg, #104e40 0%, #0ba252 100%);
      border-color: transparent;
    }

    /* 没有内容的项（Study / Projects / Quality）：置灰 + 不可点，点下去没有任何反应 */
    &:disabled {
      color: #a9b5ac;
      border-color: #dde3de;
      cursor: not-allowed;
    }
  }
}

/* ===== 内容区 ===== */
.content-area {
  min-height: 45vh;
  padding: 14px 16px 22px;

  .intro {
    font-size: 13.5px;
    line-height: 1.95;
    color: #2b2b2b;
    text-align: justify;
  }
}

/* ===== 回到顶部 ===== */
.back-top {
  position: fixed;
  right: 16px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: #fff;
  background: linear-gradient(135deg, #104e40 0%, #0ba252 100%);
  border: none;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  /* 收起时 visibility: hidden，不会误触到看不见的按钮 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    visibility 0.22s;

  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

/* ===== 页脚 ===== */
.app-footer {
  flex: 0 0 auto;
  text-align: center;
  font-size: 11.5px;
  padding: 10px 12px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  color: rgba(255, 255, 255, 0.9);
  /* 背景交给 .home 那张切图（设计稿页脚用的就是同一张底图的下半截 4094:17），
     这里保持透明，别把它盖住 */
  background-color: transparent;
  border-top: 2px solid #d3a625;
}
</style>
