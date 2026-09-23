import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { VolumeData, ROIResult, WindowPreset } from '@/types'

// 五种窗方案数值（与后端 WINDOW_PRESETS 保持一致，作为后端未返回时的兜底）
export const DEFAULT_WINDOW_PRESETS: Record<string, WindowPreset> = {
  lung: { window: 1500, level: -600, desc: '肺窗 (W1500/L-600)' },
  mediastinum: { window: 350, level: 50, desc: '纵隔窗 (W350/L50)' },
  bone: { window: 2000, level: 300, desc: '骨窗 (W2000/L300)' },
  brain: { window: 80, level: 40, desc: '脑窗 (W80/L40)' },
  abdomen: { window: 400, level: 40, desc: '腹窗 (W400/L40)' },
}

// 检查部位 -> 载入影像时自动套用的窗方案
export const PART_DEFAULT_PRESET: Record<string, string> = {
  brain: 'brain',     // 头部CT -> 脑窗
  chest: 'lung',      // 胸部CT -> 肺窗
  abdomen: 'abdomen', // 腹部CT -> 腹窗
}

// 方案区按钮显示名称
export const PRESET_LABELS: Record<string, string> = {
  lung: '肺窗',
  mediastinum: '纵隔窗',
  bone: '骨窗',
  brain: '脑窗',
  abdomen: '腹窗',
}

interface SavedWindowState {
  window: number
  level: number
  active: string // 当前生效的方案 key；手动微调后为空
}

const STORAGE_KEY = 'medical-viewer:window-state:v1'

interface PersistedState {
  lastPart: string
  parts: Record<string, SavedWindowState>
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PersistedState) : null
  } catch {
    return null
  }
}

export const useImagingStore = defineStore('imaging', () => {
  const loading = ref(false)
  const volumeData = ref<VolumeData | null>(null)
  const persisted = loadPersisted()
  const savedSession = ref(!!persisted)
  const preset = ref(persisted?.lastPart || 'brain') // 检查部位: brain / chest / abdomen
  const windowVal = ref(80)
  const levelVal = ref(40)
  const activeWindow = ref('') // 方案区当前生效项
  const roiResults = ref<ROIResult[]>([])
  const mprSlice = ref({ axial: 32, coronal: 32, sagittal: 32 })

  // 各部位最近使用的窗值与生效项
  const partWindowStates = ref<Record<string, SavedWindowState>>(persisted?.parts || {})

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastPart: preset.value,
        parts: partWindowStates.value,
      }))
    } catch {
      // localStorage 不可用时静默降级为仅本次会话生效
    }
  }

  function saveCurrentPart() {
    partWindowStates.value[preset.value] = {
      window: windowVal.value,
      level: levelVal.value,
      active: activeWindow.value,
    }
    persist()
  }

  // 手动微调滑杆：取消方案高亮，但保留当前窗值
  function notifyManualWindow() {
    activeWindow.value = ''
    saveCurrentPart()
  }

  // 点选某个窗方案
  function selectWindowPreset(key: string) {
    const p = volumeData.value?.windowPresets?.[key] || DEFAULT_WINDOW_PRESETS[key]
    if (!p) return
    windowVal.value = p.window
    levelVal.value = p.level
    activeWindow.value = key
    saveCurrentPart()
  }

  // 一键回到当前检查部位对应的窗方案
  function resetToPartPreset() {
    selectWindowPreset(PART_DEFAULT_PRESET[preset.value] || 'brain')
  }

  async function loadVolume() {
    loading.value = true
    try {
      const { data } = await axios.post('/api/volume', {
        preset: preset.value, width: 64, height: 64, depth: 64
      })
      volumeData.value = data

      // 按部位自动套用：该部位有最近使用记录则恢复窗值与生效项，否则套用部位默认方案
      const presets = data.windowPresets || DEFAULT_WINDOW_PRESETS
      const defaultKey = PART_DEFAULT_PRESET[preset.value] || 'brain'
      const saved = partWindowStates.value[preset.value]
      if (saved) {
        windowVal.value = saved.window
        levelVal.value = saved.level
        activeWindow.value = saved.active && presets[saved.active] ? saved.active : ''
      } else {
        const p = presets[defaultKey] || DEFAULT_WINDOW_PRESETS[defaultKey]
        windowVal.value = p.window
        levelVal.value = p.level
        activeWindow.value = defaultKey
      }
      saveCurrentPart()

      mprSlice.value = { axial: 32, coronal: 32, sagittal: 32 }
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
    windowVal.value = w
    levelVal.value = l
    activeWindow.value = ''
    saveCurrentPart()
  }

  return { loading, volumeData, savedSession, preset, windowVal, levelVal, activeWindow,
    roiResults, mprSlice, loadVolume, analyzeROI, applyWindow,
    selectWindowPreset, notifyManualWindow, resetToPartPreset }
})
