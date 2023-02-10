<script setup lang="ts">
import { ref, onMounted } from "vue";

import type Org from "@/types/org";
import type User from "@/types/user";
import { fetchOrgs, fetchUsers, removeUser } from "@/utils/api";
import UserDetail from "@/components/UserDetail.vue";
import UserEdit from "@/components/UserEdit.vue";
import UsersTable from "@/components/UsersTable.vue";

enum Action {
  Read,
  Write,
}

const orgs = ref<Org[]>([]);
const users = ref<User[]>([]);
const sideMenuOpened = ref(false);
const selectedUser = ref<User | null>(null);
const action = ref<Action | null>(null);

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  orgs.value = await fetchOrgs();
  users.value = await fetchUsers(orgs.value);
};

const openSideMenu = () => {
  sideMenuOpened.value = true;
};

const closeSideMenu = () => {
  sideMenuOpened.value = false;
  selectedUser.value = null;
  action.value = null;
};

const onViewUserClick = (user: User | null) => {
  action.value = Action.Read;
  selectedUser.value = user;
  openSideMenu();
};

const onEditUserClick = (user: User | null) => {
  action.value = Action.Write;
  selectedUser.value = user;
  openSideMenu();
};

const onRemoveUserClick = (user: User | null) => {
  if (user && confirm("Are you sure you want to delete this user?")) {
    removeUser(user)
      .then(async () => {
        await fetchData();
        closeSideMenu();
      })
      .catch((err: any) => console.log(err));
  }
};

const onUserEdited = async (user: User) => {
  if (user) {
    await fetchData();
    selectedUser.value = user;
    action.value = Action.Read;
  }
};
</script>

<template>
  <div class="view-container flex">
    <div class="main-panel grow p-5">
      <UsersTable
        v-if="users"
        :users="users"
        @view-user="onViewUserClick"
        @edit-user="onEditUserClick"
        @remove-user="onRemoveUserClick"
      />
    </div>
    <div
      class="side-panel flex flex-col border-l-2 border-slate-200 w-0 transition-all overflow-hidden"
      :class="{ opened: sideMenuOpened }"
    >
      <div v-show="sideMenuOpened">
        <div class="top-bar p-4 flex justify-between">
          <h3
            v-if="selectedUser"
            class="text-slate-700 text-xl font-bold uppercase grow flex items-center justify-center"
          >
            {{ selectedUser.first_name }} {{ selectedUser.last_name }}
          </h3>
          <div class="flex items-center">
            <button
              v-if="action !== Action.Read"
              type="button"
              class="text-slate-400 hover:text-cyan-500 text-md mr-4"
              title="View user"
              @click="onViewUserClick(selectedUser)"
            >
              <font-awesome-icon icon="fa-solid fa-eye" />
            </button>
            <button
              v-if="action !== Action.Write"
              type="button"
              class="text-slate-400 hover:text-amber-500 text-md mr-4"
              title="Edit user"
              @click="onEditUserClick(selectedUser)"
            >
              <font-awesome-icon icon="fa-solid fa-edit" />
            </button>
            <button
              type="button"
              class="text-slate-400 hover:text-red-500 text-md mr-4"
              title="Remove user"
              @click="onRemoveUserClick(selectedUser)"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
            <button
              type="button"
              class="text-slate-400 hover:text-slate-700 text-xl"
              title="Close panel"
              @click="closeSideMenu"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
        <div class="p-5 grow">
          <UserDetail
            v-if="action == Action.Read && selectedUser"
            :user="selectedUser"
            :key="selectedUser.id"
          />
          <UserEdit
            v-if="action == Action.Write && selectedUser"
            :user="selectedUser"
            :key="selectedUser.id"
            @user-edited="onUserEdited"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  height: calc(100vh - 60px);
}

.side-panel.opened {
  width: 33vw;
}
</style>