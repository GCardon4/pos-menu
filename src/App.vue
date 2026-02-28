<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  $q.dark.set(true)
  document.documentElement.classList.add('dark')
})
</script>
