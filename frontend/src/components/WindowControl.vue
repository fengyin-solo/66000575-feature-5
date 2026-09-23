<template>
  <div class="panel">
    <h4>🎚️ 窗宽窗位调节</h4>
    <div class="preset-row">
      <el-button v-for="(p, k) in presets" :key="k" size="small"
        :type="store.activeScheme===k?'primary':''"
        @click="store.applyScheme(k)">{{ k }}</el-button>
    </div>
    <div class="slider-row">
      <span>窗宽: {{ store.windowVal }}</span>
      <input type="range" :min="10" :max="3000" v-model.number="store.windowVal" @input="store.noteManualWindow()"/>
    </div>
    <div class="slider-row">
      <span>窗位: {{ store.levelVal }}</span>
      <input type="range" :min="-1000" :max="1000" v-model.number="store.levelVal" @input="store.noteManualWindow()"/>
    </div>
    <div class="reset-row">
      <el-button size="small" plain @click="store.resetToPartScheme()">↩ 恢复本部位方案</el-button>
      <span class="active-hint" v-if="store.activeScheme">
        当前：{{ presets[store.activeScheme]?.desc || store.activeScheme }}
      </span>
      <span class="active-hint custom" v-else>当前：自定义窗值</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useImagingStore } from '../store/imaging'
import type { WindowPreset } from '../types'
const store = useImagingStore()

const defaultPresets: Record<string, WindowPreset> = {
  lung: { window: 1500, level: -600, desc: '肺窗' },
  mediastinum: { window: 350, level: 50, desc: '纵隔窗' },
  bone: { window: 2000, level: 300, desc: '骨窗' },
  brain: { window: 80, level: 40, desc: '脑窗' },
  abdomen: { window: 400, level: 40, desc: '腹窗' },
}

const presets = computed(() => store.volumeData?.windowPresets || defaultPresets)
</script>

<style scoped>
.panel { background:#161b22; border-radius:6px; padding:10px; border:1px solid #30363d }
.panel h4 { color:#58a6ff; font-size:12px; margin-bottom:8px }
.preset-row { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px }
.slider-row { display:flex; align-items:center; gap:8px; margin:6px 0; font-size:11px; color:#8b949e }
.slider-row input { flex:1; accent-color:#58a6ff }
.reset-row { display:flex; align-items:center; gap:8px; margin-top:8px }
.active-hint { font-size:11px; color:#58a6ff }
.active-hint.custom { color:#d29922 }
</style>
