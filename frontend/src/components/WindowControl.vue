<template>
  <div class="panel">
    <h4>🎚️ 窗宽窗位调节</h4>
    <div class="preset-row">
      <el-button v-for="(p, k) in presets" :key="k" size="small"
        @click="store.selectWindowPreset(k)"
        :type="store.activeWindow===k?'primary':''">
        {{ labels[k] || k }}
      </el-button>
      <el-button size="small" @click="store.resetToPartPreset()" title="回到当前检查部位的默认窗方案">↩ 本部位</el-button>
    </div>
    <div class="slider-row">
      <span>窗宽: {{ store.windowVal }}</span>
      <input type="range" :min="10" :max="3000" v-model.number="store.windowVal" @input="store.notifyManualWindow()"/>
    </div>
    <div class="slider-row">
      <span>窗位: {{ store.levelVal }}</span>
      <input type="range" :min="-1000" :max="1000" v-model.number="store.levelVal" @input="store.notifyManualWindow()"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useImagingStore, DEFAULT_WINDOW_PRESETS, PRESET_LABELS } from '../store/imaging'
const store = useImagingStore()

const labels = PRESET_LABELS

const presets = computed(() => store.volumeData?.windowPresets || DEFAULT_WINDOW_PRESETS)
</script>

<style scoped>
.panel { background:#161b22; border-radius:6px; padding:10px; border:1px solid #30363d }
.panel h4 { color:#58a6ff; font-size:12px; margin-bottom:8px }
.preset-row { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:10px }
.slider-row { display:flex; align-items:center; gap:8px; margin:6px 0; font-size:11px; color:#8b949e }
.slider-row input { flex:1; accent-color:#58a6ff }
</style>
