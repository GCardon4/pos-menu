<template>
  <label class="flex flex-col w-full">
    <p v-if="label" class="text-slate-900 text-sm font-medium leading-normal pb-2 px-1">
      {{ label }}
    </p>
    <div
      class="flex w-full items-stretch rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-primary transition-colors"
      :class="{
        'border-primary ring-1 ring-primary/20': focused,
        'opacity-60 cursor-not-allowed': disabled,
      }"
    >
      <!-- Prepend icon -->
      <div v-if="icon" class="text-slate-400 flex items-center justify-center pl-4 pr-2">
        <span class="material-symbols-outlined">{{ icon }}</span>
      </div>

      <!-- Main Input -->
      <input
        ref="inputRef"
        v-bind="$attrs"
        :value="modelValue"
        :type="inputType"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="
          focused = true
          $emit('focus', $event)
        "
        @blur="
          focused = false
          $emit('blur', $event)
        "
        @keyup.enter="$emit('enter')"
        class="form-input flex w-full min-w-0 flex-1 border-none bg-transparent h-14 text-slate-900 placeholder:text-slate-400 focus:ring-0 text-base font-normal px-2"
        :class="{ 'pl-4': !icon }"
      />

      <!-- Append Action (e.g. Password Toggle) -->
      <div
        v-if="type === 'password'"
        class="text-slate-400 flex items-center justify-center pr-4 pl-2 cursor-pointer hover:text-primary transition-colors"
        @click="togglePasswordVisibility"
      >
        <span class="material-symbols-outlined">{{
          showPassword ? 'visibility_off' : 'visibility'
        }}</span>
      </div>
      <slot name="append"></slot>
    </div>
    <p v-if="error" class="text-rose-500 text-xs mt-1 px-1">{{ error }}</p>
  </label>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  icon: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'focus', 'blur', 'enter'])

const focused = ref(false)
const inputRef = ref(null)

// Handle password visibility
const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>
