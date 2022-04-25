<template>
  <div>
    <v-row>
      <v-col cols="6">
        <h2>ワクチン一覧</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-for="vaccine in vaccineList" :key="vaccine.id">
        <v-card class="mx-2 my-2" @click="showDetail(vaccine.id)">
          <v-row>
            <v-col cols="9">
              <v-card-title class="py-0">{{ vaccine.name }}</v-card-title>
              <v-spacer></v-spacer>
            </v-col>
            <v-col cols="3"><v-icon>mdi-information</v-icon></v-col>
          </v-row>
          <!-- 接種予定日を羅列 -->
          <v-row v-if="vaccine.time">
            <v-card-text
              v-for="(date, key) in vaccine.time"
              :key="key"
              class="py-0"
            >
              {{ key }}: {{ date }}
            </v-card-text>
          </v-row>
          <v-row v-else><v-card-text class="py-0">未定</v-card-text></v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ selected.name }}
        </v-card-title>
        <v-card-text>
          {{ selected.contents }}
        </v-card-text>
        <v-divider></v-divider>
        <v-spacer></v-spacer>
        <v-row v-if="selected.time">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-col cols="8">
                <v-card-text
                  class="py-0"
                  v-for="(day, key) in selected.time"
                  :key="key"
                >
                  {{ key }}: {{ day }}
                  <v-btn v-on="on" @click="selectKey = key">編集</v-btn>
                  <v-btn @click="deleteSchedule(key)">削除</v-btn>
                </v-card-text>
              </v-col>
            </template>
            <v-date-picker
              no-title
              v-model="date"
              @input="editSchedule"
            ></v-date-picker>
          </v-menu>
        </v-row>
        <v-col>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-btn v-on="on"> 追加 </v-btn>
              <v-btn @click="closeDialog"> 閉じる </v-btn>
            </template>
            <v-date-picker
              no-title
              v-model="date"
              @input="addSchedule"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  props: {
    vaccineList: Array,
    login: Boolean
  },
  name: "VaccineList",
  data() {
    return {
      date: "",
      menu: false,
      menu2: false,
      dialog: false,
      selectVaccine: 0,
      selected: "",
      lastNum: 0,
      selectKey: "",
    };
  },
  methods: {
    showDetail(id) {
      this.selectVaccine = id;
      this.selected = this.vaccineList[this.selectVaccine];
      console.log(this.selected);
      this.dialog = true;
    },
    closeDialog() {
      this.date = "";
      this.$emit("new-schedule", this.selected);
      this.dialog = false;
    },
    addSchedule() {
      if ("time" in this.selected) {
        let num = Object.keys(this.selected.time).length;
        this.selected.time[++num + "st"] = this.date;
      } else {
        let num = 1;
        this.selected.time = { [num + "st"]: this.date };
      }
      this.date = "";
      this.menu = false;
      this.sortSchedule(this.selected.time);
    },
    editSchedule() {
      this.selected.time[this.selectKey] = this.date;
      this.sortSchedule(this.selected.time);
      this.menu2 = false;
    },
    deleteSchedule(key) {
      delete this.selected.time[key];
      this.sortSchedule(this.selected.time);
    },
    sortSchedule(obj) {
      let newTime = {};
      let timeAry = Object.values(obj);
      timeAry = timeAry.sort(function (a, b) {
        return a > b ? 1 : -1;
      });
      let i = 1;
      timeAry.forEach((time) => {
        newTime[i++ + "st"] = time;
      });
      this.selected.time = newTime;
      this.dialog = false;
      this.dialog = true;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        vm.date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10);
      });
    });
  },
  created() {
    if (!this.login) {
      this.$router.push('/notLogin')
    } 
  }
  // created() {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (!user) {
  //       console.log("ログインされていません");
  //       this.$router.push("/notLogin");
  //     }
  //   });
  // },
  
};
</script>

<style>
</style>