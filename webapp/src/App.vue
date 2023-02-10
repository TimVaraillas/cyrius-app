<script setup lang="ts">
import HomeView from "@/views/HomeView.vue";

const src = "https://cyrius.co/lib_UYJACBFvKjyflrmM/02hmuy6s42ggz8hd.png?w=40";
</script>

<template>
  <header
    class="header flex items-center justify-between px-8 border-b-2 border-slate-200"
  >
    <a href="/" class="flex items-center">
      <img :src="src" alt="Logo Cyrius" />
      <h1 class="px-5 font-bold tracking-wide uppercase text-slate-600">
        Cyrius technical test
      </h1>
    </a>
  </header>

  <main>
    <HomeView />
  </main>
</template>

<style scoped>
.header {
  height: 60px;
}
</style>
