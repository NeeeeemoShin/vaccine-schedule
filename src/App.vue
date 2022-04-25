<template>
  <v-app>
    <header>
      <v-app-bar app dark color="info">
        <v-app-bar-nav-icon v-if="login" @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title style="width: 50%">予防接種管理</v-toolbar-title>
        <!-- <v-tabs right>
          <v-tab v-for="menu in menuList" :to="menu.link" :key="menu.id" link>
            {{ menu.name }}
          </v-tab>
        </v-tabs> -->
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" fixed temporary>
        <v-list nav dense>
          <v-list-item-group>
            <v-list-item
              v-for="menu in menuList"
              :to="menu.link"
              :key="menu.id"
              link
            >
              <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logout">
              <v-list-item-content>
                <v-list-item-title>ログアウト</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
    <v-main>
      <!-- <v-navigation-drawer
        app
        clipped
        v-model="drawer"
        dark
        color="info"
        v-if="login"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h5"> Application </v-list-item-title>
            <v-list-item-subtitle> subtext </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item
            v-for="menu in menuList"
            :to="menu.link"
            :key="menu.id"
            link
          >
            <v-list-item-content>
              <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-content>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer> -->
      <v-container>
        <router-view
          :vaccineList="vaccineList"
          :loginId="loginId"
          :login="login"
          @update-schedule="updateSchedule"
          @login-data="loginData"
          @new-schedule="newSchedule"
          ref="child"
        >
        </router-view>
        <!-- <pre>{{ vaccineList }}</pre> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "App",

  data: () => ({
    isShow: false,
    drawer: false,
    vaccineList: [],
    menuList: [
      { id: 0, name: "ワクチン一覧", link: "/vaccineList" },
      { id: 1, name: "接種スケジュール", link: "/schedule" },
      { id: 2, name: "接種期間表", link: "/vaccinationPeriod" },
      // { id: 3, name: "メニュー", link: "/" },
    ],
    loginId: "",
    login: false,
  }),
  methods: {
    loginData(e) {
      // console.log(e);
      this.vaccineList = e[0];
      this.loginId = e[1];
      // console.log(this.vaccineList)
      this.login = true;
      this.$router.push("/vaccineList");
    },
    updateSchedule(e) {
      const db = getDatabase();
      set(ref(db, `users/${this.loginId}/personalData/${e.id}`), {
        time: e.time,
      });
    },
    newSchedule() {
      // console.log(e.id);
      const db = getDatabase();
      set(ref(db, `users/${this.loginId}`), {
        personalData: this.vaccineList,
      });
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          this.login = false;
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  // created() {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid;
  //       console.log(uid + "がログインしています");
  //       console.log(this.vaccineList);
  //       this.$refs.child.getVaccineList(uid);
  //     } else {
  //       console.log("ログインされていません");
  //       this.$router.push("/");
  //     }
  //   });
  // },
};
</script>