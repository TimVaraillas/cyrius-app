import { createApp } from "vue";
import App from "./App.vue";

import "./assets/main.css";
import "./assets/tailwind.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEye,
  faEdit,
  faTrash,
  faXmark,
  faCheck,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

library.add(faEye, faEdit, faTrash, faXmark, faCheck, faChevronDown);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
