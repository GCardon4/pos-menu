<template>
  <q-item
    clickable
    tag="a"
    :href="props.link"
    class="rounded-xl mx-2 mb-1 px-3 py-2.5 flex items-center gap-3 transition-colors text-slate-500 hover:text-primary hover:bg-primary/5 q-focus-helper-opacity-0"
    active-class="bg-primary/10 text-primary font-bold border border-primary/20"
  >
    <q-item-section v-if="props.icon" avatar class="min-w-0 pr-0 flex items-center justify-center">
      <span class="material-symbols-outlined text-2xl">{{ props.icon }}</span>
    </q-item-section>

    <q-item-section>
      <q-item-label class="font-medium text-sm">{{ props.title }}</q-item-label>
      <q-item-label caption class="text-xs text-slate-400" v-if="props.caption">{{
        props.caption
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})
</script>
