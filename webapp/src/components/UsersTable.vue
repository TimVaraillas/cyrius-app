<script setup lang="ts">
import type User from "@/types/user";

const emit = defineEmits(["view-user", "edit-user", "remove-user"]);

const props = defineProps<{
  users: User[];
}>();

const onViewUserClick = (user: User) => {
  emit("view-user", user);
};

const onEditUserClick = (user: User) => {
  emit("edit-user", user);
};

const onRemoveUserClick = (user: User) => {
  emit("remove-user", user);
};
</script>

<template>
  <div v-if="props.users" class="w-full h-full overflow-hidden">
    <table class="w-full text-sm text-left text-slate-600">
      <thead class="rounded-t text-xs text-slate-50 uppercase bg-slate-400">
        <tr>
          <th scope="col" class="p-4" width="150">First name</th>
          <th scope="col" class="p-4" width="150">Last name</th>
          <th scope="col" class="p-4" width="400">Email</th>
          <th scope="col" class="p-4" width="300">Org</th>
          <th scope="col" class="p-4" width="auto">Labels</th>
          <th scope="col" class="p-4" width="170">Actions</th>
        </tr>
      </thead>
      <tbody class="rounded-b border-l border-r border-b">
        <tr
          v-for="user in props.users"
          :key="user.id"
          class="odd:bg-white even:bg-slate-50 text-slate-500 border-b cursor-pointer hover:bg-slate-100"
          @click="onViewUserClick(user)"
        >
          <td class="px-4 py-3" width="150">
            {{ user.first_name }}
          </td>
          <td class="px-4 py-3" width="150">
            {{ user.last_name }}
          </td>
          <td class="px-4 py-3" width="400">
            {{ user.email }}
          </td>
          <td class="px-4 py-3" width="300">
            {{ user.org_name }}
          </td>
          <td class="px-4 py-3" width="auto">
            <div
              v-for="(label, idx) in user.labels"
              :key="idx"
              class="ml-1 mb-1 text-xs inline-flex items-center font-semibold capitalize px-2 py-1 rounded-full bg-slate-200 text-slate-400"
            >
              {{ label }}
            </div>
          </td>
          <td class="px-6 py-3" width="170">
            <button
              type="button"
              title="View user"
              class="text-cyan-500 border border-cyan-500 hover:bg-cyan-500 hover:text-white rounded-full text-xs p-2 text-center inline-flex items-center"
              @click.stop="onViewUserClick(user)"
            >
              <font-awesome-icon icon="fa-solid fa-eye" />
              <span class="sr-only">View user</span>
            </button>

            <button
              type="button"
              title="Edit user"
              class="ml-3 text-amber-500 border border-amber-500 hover:bg-amber-500 hover:text-white rounded-full text-xs p-2 text-center inline-flex items-center"
              @click.stop="onEditUserClick(user)"
            >
              <font-awesome-icon icon="fa-solid fa-edit" />
              <span class="sr-only">Edit user</span>
            </button>

            <button
              type="button"
              title="Delete user"
              class="ml-3 text-rose-500 border border-rose-500 hover:bg-rose-500 hover:text-white rounded-full p-2 text-xs inline-flex items-center"
              @click.stop="onRemoveUserClick(user)"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
              <span class="sr-only">Delete user</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tbody {
  display: block;
  height: calc(100vh - 148px);
  overflow: auto;
}
thead,
tbody tr {
  display: table;
  width: 100%;
}
</style>
