import AnyDistrict from "./components/AnyDistrict.vue";
import UnsubscribeUser from "./components/UnsubscribeUser.vue";
import GetSMS from "./components/GetSMS.vue";

export const routes = [
  { path: "/", component: AnyDistrict },
  { path: "/unsubscribeUser", component: UnsubscribeUser },
  { path: "/sendNotifications", component: GetSMS },
];
