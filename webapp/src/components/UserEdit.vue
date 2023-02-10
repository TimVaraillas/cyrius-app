<script setup lang="ts">
import { reactive, computed, ref, onBeforeMount } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";

import type User from "@/types/user";
import { fetchLabels, saveUser, createLabel } from "@/utils/api";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

const emit = defineEmits(["user-edited"]);

const props = defineProps<{
  user: User;
}>();

let labels = ref<string[]>([]);

onBeforeMount(() => {
  fetchLabels(props.user.org).then((response: any) => {
    labels.value = response.data?.data;
  });
});

const query = ref("");
const queryLabel = computed(() => {
  return query.value === "" ? null : query.value;
});

const filteredLabel = computed(() =>
  query.value === ""
    ? labels.value
    : labels.value.filter((l) => {
        return l.toLowerCase().includes(query.value.toLowerCase());
      })
);

const state = reactive<any>({
  first_name: props.user.first_name,
  last_name: props.user.last_name,
  email: props.user.email,
  org_name: props.user.org_name,
  labels: props.user.labels,
});

const rules = computed(() => ({
  first_name: { required },
  last_name: { required },
  email: { required, email },
  labels: {},
}));

const v$ = useVuelidate(rules, state);

const removeLabel = (label: string) => {
  const index = v$.value.labels.$model.findIndex((l: string) => l === label);
  if (index > -1) {
    state.labels.splice(index, 1);
    v$.value.labels.$touch();
  }
};

const onLabelsChanged = (value: any) => {
  const difference = value.filter(
    (label: string) => !labels.value.includes(label)
  );
  if (difference.length) {
    createLabel(props.user.org, difference[0]).then(() => {
      fetchLabels(props.user.org).then((response: any) => {
        labels.value = response.data?.data;
      });
    });
  }
};

const onEditUserSubmit = async () => {
  let mask = Object.keys(state).reduce((acc: any, key: string) => {
    if (v$.value[key]?.$dirty) {
      acc.push(key);
    }
    return acc;
  }, []);

  const user = { ...props.user, ...state };
  saveUser(user, mask)
    .then(() => emit("user-edited", user))
    .catch((err: any) => console.log(err));
};
</script>

<template>
  <form>
    <div>
      <div class="mb-4">
        <label
          for="first_name"
          class="block mb-2 text-sm font-semibold uppercase text-slate-600"
          :class="{
            'text-sm text-red-700 dark:text-red-500':
              v$.first_name.$dirty && v$.first_name.$invalid,
          }"
        >
          First name
        </label>
        <input
          type="text"
          id="first_name"
          class="bg-slate-50 border border-slate-300 text-slate-600 text-sm rounded block w-full p-2.5"
          :class="{
            'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500':
              v$.first_name.$dirty && v$.first_name.$invalid,
          }"
          v-model="v$.first_name.$model"
        />
        <small
          v-if="v$.first_name.$dirty && v$.first_name.$invalid"
          class="mt-2 text-sm text-red-600 dark:text-red-500"
        >
          {{ v$.first_name.required.$message }}
        </small>
      </div>
      <div class="mb-4">
        <label
          for="last_name"
          class="block mb-2 text-sm font-semibold uppercase text-slate-600"
          :class="{
            'text-sm text-red-700 dark:text-red-500':
              v$.last_name.$dirty && v$.last_name.$invalid,
          }"
        >
          Last name
        </label>
        <input
          type="text"
          id="last_name"
          class="bg-slate-50 border border-slate-300 text-slate-600 text-sm rounded block w-full p-2.5"
          :class="{
            'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500':
              v$.last_name.$dirty && v$.last_name.$invalid,
          }"
          v-model="v$.last_name.$model"
        />
        <small
          v-if="v$.last_name.$dirty && v$.last_name.$invalid"
          class="mt-2 text-sm text-red-600 dark:text-red-500"
        >
          {{ v$.last_name.required.$message }}
        </small>
      </div>
      <div class="mb-4">
        <label
          for="email"
          class="block mb-2 text-sm font-semibold uppercase text-slate-600"
          :class="{
            'text-sm text-red-700 dark:text-red-500':
              v$.email.$dirty && v$.email.$invalid,
          }"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          class="bg-slate-50 border border-slate-300 text-slate-600 text-sm rounded block w-full p-2.5"
          :class="{
            'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500':
              v$.email.$dirty && v$.email.$invalid,
          }"
          v-model="v$.email.$model"
        />
        <small
          v-if="v$.email.$dirty && v$.email.$invalid"
          class="mt-2 text-sm text-red-600 dark:text-red-500"
        >
          <span v-if="v$.email.required.$invalid">
            {{ v$.email.required.$message }}
          </span>
          <span v-if="v$.email.email.$invalid">
            {{ v$.email.email.$message }}
          </span>
        </small>
      </div>
      <div class="mb-8">
        <label
          for="company"
          class="block mb-2 text-sm font-semibold uppercase text-slate-600"
        >
          Company
        </label>
        <input
          type="text"
          id="company"
          class="bg-slate-200 border border-slate-300 text-slate-600 text-sm rounded block w-full p-2.5"
          v-model="state.org_name"
          disabled
          readonly
        />
      </div>
      <div class="mb-8">
        <label
          for="company"
          class="block mb-2 text-sm font-semibold uppercase text-slate-600"
        >
          Labels
        </label>
        <Combobox
          v-model="v$.labels.$model"
          multiple
          @update:modelValue="onLabelsChanged"
        >
          <div class="relative rounded block w-full py-2">
            <ul
              v-if="v$.labels.$model.length > 0"
              class="text-slate-600 text-sm rounded w-full flex flex-wrap items-center mb-2"
            >
              <li
                v-for="label in v$.labels.$model"
                :key="label"
                class="mr-1 mb-1 text-xs inline-flex items-center font-semibold capitalize px-2 py-1 rounded-full bg-emerald-500 text-slate-50"
              >
                <span>{{ label }}</span>
                <font-awesome-icon
                  icon="fa-solid fa-xmark"
                  class="ml-1.5 cursor-pointer"
                  @click="removeLabel(label)"
                />
              </li>
            </ul>
            <div class="relative">
              <ComboboxInput
                class="w-full bg-slate-50 border border-slate-300 text-slate-600 text-sm rounded p-2.5"
                @change="query = $event.target.value"
                placeholder="Search value"
              />
              <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <font-awesome-icon
                  class="text-gray-400 text-sm"
                  icon="fa-solid fa-chevron-down"
                />
              </ComboboxButton>
            </div>
            <ComboboxOptions
              class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg"
            >
              <ComboboxOption
                v-if="queryLabel"
                :value="queryLabel"
                v-slot="{ active }"
              >
                <li
                  class="relative cursor-pointer select-none py-2 pl-10 pr-4 cursor"
                  :class="{
                    'bg-emerald-500 text-white': active,
                  }"
                >
                  <span class="block truncate">
                    Create new label: <b class="capitalize ml-2">{{ query }}</b>
                  </span>
                </li>
              </ComboboxOption>
              <ComboboxOption
                v-for="label in filteredLabel"
                :key="label"
                :value="label"
                v-slot="{ active, selected }"
              >
                <li
                  class="relative cursor-pointer select-none py-2 pl-10 pr-4 cursor"
                  :class="{
                    'bg-emerald-500 text-white': active,
                  }"
                >
                  <span
                    class="block truncate"
                    :class="{
                      'font-medium': selected,
                      'font-normal': !selected,
                    }"
                  >
                    {{ label }}
                  </span>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600"
                  >
                    <font-awesome-icon icon="fa-solid fa-check" />
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </div>
        </Combobox>
      </div>
      <div>
        <button
          type="button"
          :disabled="v$.$invalid || !v$.$anyDirty"
          class="text-white rounded block w-full text-sm px-5 py-2.5 mr-2 font-semibold"
          :class="{
            'bg-slate-300 cursor-not-allowed': v$.$invalid || !v$.$anyDirty,
            'bg-amber-500 hover:bg-amber-700': !v$.$invalid && v$.$anyDirty,
          }"
          @click="onEditUserSubmit"
        >
          <font-awesome-icon icon="fa-solid fa-edit" />
          <span class="ml-2">Edit user</span>
        </button>
      </div>
    </div>
  </form>
</template>
