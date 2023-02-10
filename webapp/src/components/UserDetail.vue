<script setup lang="ts">
import type User from "@/types/user";

const props = defineProps<{
  user: User;
}>();
</script>

<template>
  <form>
    <div>
      <div class="mb-4">
        <label class="block mb-2 text-sm uppercase text-slate-600">
          First name
        </label>
        <h3 class="text-slate-600 text-lg font-bold">
          {{ props.user.first_name }}
        </h3>
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm uppercase text-slate-600">
          Last name
        </label>
        <h3 class="text-slate-600 text-lg font-bold">
          {{ props.user.last_name }}
        </h3>
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm uppercase text-slate-600">
          Email address
        </label>
        <h3 class="text-slate-600 text-lg font-bold">
          {{ props.user.email }}
        </h3>
      </div>
      <div class="mb-4">
        <label class="block mb-2 text-sm uppercase text-slate-600">
          Company
        </label>
        <h3 class="text-slate-600 text-lg font-bold">
          {{ props.user.org_name }}
        </h3>
      </div>
      <div>
        <label for="label" class="block mb-2 text-sm uppercase text-slate-600">
          Labels
        </label>
        <div>
          <div
            v-for="(label, idx) in props.user.labels"
            :key="idx"
            class="ml-1 mb-1 text-sm inline-flex items-center font-semibold capitalize px-3 py-2 rounded-full bg-slate-400 text-slate-50"
          >
            {{ label }}
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
