import { createApp } from "vue";
import "../style.css";
import "../flags.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import FileUpload from "primevue/fileupload";
import Toast from "primevue/toast";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.component("Toast", Toast);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("InputText ", InputText);
app.component("Dropdown ", Dropdown);
app.component("Message ", Message);
app.component("FileUpload ", FileUpload);

app.use(router).mount("#app");
