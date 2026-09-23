/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useImagingStore, DEFAULT_WINDOW_PRESETS, PRESET_LABELS } from '../store/imaging';
const store = useImagingStore();
const labels = PRESET_LABELS;
const presets = computed(() => store.volumeData?.windowPresets || DEFAULT_WINDOW_PRESETS);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "preset-row" },
});
for (const [p, k] of __VLS_getVForSourceType((__VLS_ctx.presets))) {
    const __VLS_0 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        key: (k),
        size: "small",
        type: (__VLS_ctx.store.activeWindow === k ? 'primary' : ''),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        key: (k),
        size: "small",
        type: (__VLS_ctx.store.activeWindow === k ? 'primary' : ''),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            __VLS_ctx.store.selectWindowPreset(k);
        }
    };
    __VLS_3.slots.default;
    (__VLS_ctx.labels[k] || k);
    var __VLS_3;
}
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    size: "small",
    title: "回到当前检查部位的默认窗方案",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    size: "small",
    title: "回到当前检查部位的默认窗方案",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.resetToPartPreset();
    }
};
__VLS_11.slots.default;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.store.windowVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.store.notifyManualWindow();
        } },
    type: "range",
    min: (10),
    max: (3000),
});
(__VLS_ctx.store.windowVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "slider-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.store.levelVal);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.store.notifyManualWindow();
        } },
    type: "range",
    min: (-1000),
    max: (1000),
});
(__VLS_ctx.store.levelVal);
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['preset-row']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
/** @type {__VLS_StyleScopedClasses['slider-row']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            labels: labels,
            presets: presets,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
