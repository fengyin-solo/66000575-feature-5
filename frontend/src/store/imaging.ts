import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { VolumeData, ROIResult, WindowPreset } from '@/types'

// 各检查部位载入时默认套用的窗方案
const PART_DEFAULT_SCHEME: Record<string, string> = {
  brain: 'brain',       // 头部CT -> 脑窗
  chest: 'lung',        // 胸部CT -> 肺窗
  abdomen: 'abdomen',   // 腹部CT -> 腹窗
}
const FALLBACK_SCHEME = 'mediastinum'

// 与后端 WINDOW_PRESETS 一致，用于影像尚未载入时的兜底取值
const FALLBACK_PRESETS: Record<string, WindowPreset> = {
  lung: { window: 1500, level: -600, desc: '肺窗 (W1500/L-600)' },
  mediastinum: { window: 350, level: 50, desc: '纵隔窗 (W350/L50)' },
  bone: { window: 2000, level: 300, desc: '骨窗 (W2000/L300)' },
  brain: { window: 80, level: 40, desc: '脑窗 (W80/L40)' },
  abdomen: { window: 400, level: 40, desc: '腹窗 (W400/L40)' },
}

const STORAGE_KEY = 'imaging-window-state-v1'

interface SavedWindow {
  window: number
  level: number
  scheme: string // 生效的窗方案 key；手动微调后为 ''
}
interface PersistedState {
  lastBodyPart: string
  parts: Record<string, SavedWindow>
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.parts) return null
    return parsed as PersistedState
  } catch {
    return null
  }
}

export const useImagingStore = defineStore('imaging', () => {
  const loading = ref(false)
  const volumeData = ref<VolumeData | null>(null)
  const initialPersisted = loadPersisted()
  const savedState = ref<PersistedState | null>(initialPersisted)
  const hasSavedSession = ref(!!initialPersisted)
  const preset = ref(initialPersisted?.lastBodyPart || 'brain')
  const windowVal = ref(initialPersisted?.parts[preset.value]?.window ?? 80)
  const levelVal = ref(initialPersisted?.parts[preset.value]?.level ?? 40)
  const activeScheme = ref(initialPersisted?.parts[preset.value]?.scheme ?? '')
  const roiResults = ref<ROIResult[]>([])
  const mprSlice = ref({ axial: 32, coronal: 32, sagittal: 32 })

  const windowPresets = (): Record<string, WindowPreset> =>
    volumeData.value?.windowPresets || FALLBACK_PRESETS

  function persist() {
    try {
      const part = volumeData.value?.preset || preset.value
      const state: PersistedState = {
        lastBodyPart: part,
        parts: {
          ...(savedState.value?.parts || {}),
          [part]: { window: windowVal.value, level: levelVal.value, scheme: activeScheme.value },
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      savedState.value = state
      hasSavedSession.value = true
    } catch {
      // localStorage 不可用时静默降级为仅本次会话有效
    }
  }

  /** 套用指定窗方案（数值与赋值方式沿用既有逻辑） */
  function applyScheme(key: string) {
    const p = windowPresets()[key]
    if (!p) return
    windowVal.value = p.window
    levelVal.value = p.level
    activeScheme.value = key
    persist()
  }

  /** 手动拖动滑块后调用：取消方案高亮并记住自定义窗值 */
  function noteManualWindow() {
    activeScheme.value = ''
    persist()
  }

  /** 一键回到当前检查部位对应的窗方案 */
  function resetToPartScheme() {
    const part = volumeData.value?.preset || preset.value
    applyScheme(PART_DEFAULT_SCHEME[part] || FALLBACK_SCHEME)
  }

  /** 载入影像后按部位恢复上次窗值，没有记录则套用该部位默认方案 */
  function applyWindowForPart(part: string) {
    const presets = windowPresets()
    const saved = savedState.value?.parts[part]
    if (saved) {
      windowVal.value = saved.window
      levelVal.value = saved.level
      activeScheme.value = presets[saved.scheme] ? saved.scheme : ''
    } else {
      applyScheme(PART_DEFAULT_SCHEME[part] || FALLBACK_SCHEME)
    }
  }

  async function loadVolume() {
    loading.value = true
    try {
      const { data } = await axios.post('/api/volume', {
        preset: preset.value, width: 64, height: 64, depth: 64
      })
      volumeData.value = data
      mprSlice.value = { axial: 32, coronal: 32, sagittal: 32 }
      applyWindowForPart(preset.value)
      persist()
    } finally { loading.value = false }
  }

  async function analyzeROI(rois: any[]) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/roi', { volume: volumeData.value?.volume, rois })
      roiResults.value = data.rois
    } finally { loading.value = false }
  }

  function applyWindow(w: number, l: number) {
    windowVal.value = w; levelVal.value = l
    activeScheme.value = ''
    persist()
  }

  return { loading, volumeData, preset, windowVal, levelVal, activeScheme, hasSavedSession,
    roiResults, mprSlice, loadVolume, analyzeROI, applyWindow,
    applyScheme, noteManualWindow, resetToPartScheme }
})
