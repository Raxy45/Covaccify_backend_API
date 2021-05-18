<template>
  <v-app>
    <v-main class="pb-0">
      <v-app-bar color="green" class="text-h5">
        <v-toolbar-title class="white--text text-h4 font-weight-bold pr-1">
          Covaccify<span class="text-h5">💉</span></v-toolbar-title
        >
        <v-spacer></v-spacer>
        <div class="text-right green--text">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" dark v-bind="attrs" v-on="on">
                <v-icon class="white--text">mdi-menu</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in items" :key="index">
                <v-list-item-title @click="$router.push(item.routerPush)">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div></v-app-bar
      >
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </v-main>
    <v-footer fixed-bottom>
      <v-col class="text-center" cols="12">
        <v-icon small>mdi-copyright</v-icon>Yash Salvi -
        {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},

  data: () => ({
    items: [
      { title: "Find Centers", routerPush: "/" },
      { title: "Get Notified", routerPush: "/sendNotifications" },
      { title: "Unsubcribe", routerPush: "/unsubscribeUser" },
    ],
  }),
};
</script>
