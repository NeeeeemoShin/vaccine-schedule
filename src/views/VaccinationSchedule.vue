<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>接種スケジュール</h2>
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" scrollable max-width="300px" persistent>
      <v-card>
        <v-card-title>Select Country</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-for="(vaccine, index) in todayVaccine" :key="index"
          >{{ vaccine.name }}
          <v-btn small @click="deleteVaccine(vaccine.id)">削除</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-checkbox
            v-for="not in notToday"
            :key="not.id"
            :label="not.name"
            :value="not"
            v-model="selectedVaccine"
            class="my-0"
          ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">
            キャンセル
          </v-btn>
          <v-btn color="blue darken-1" text @click="addSchedule"> 追加 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "VaccinationSchedule",
  props: {
    vaccineList: Array,
    login: Boolean,
  },
  data() {
    return {
      notToday: [],
      todayVaccine: [],
      dialog: false,
      selectedVaccine: [],
      focus: "",
      type: "month",
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "green",
        "orange",
        "grey darken-1",
        "lime",
        "yellow",
        "deep-orange",
        "teal",
        "purple",
      ],
    };
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      let dayAry = [];
      this.vaccineList.forEach((vaccine) => {
        if (!vaccine.time) return;
        for (let key in vaccine.time) {
          dayAry.push({
            id: vaccine.id,
            name: vaccine.name,
            time: vaccine.time[key],
          });
        }
      });
      dayAry.forEach((day) => {
        if (day.time === this.focus) {
          this.todayVaccine.push(day);
        }
      });
      this.vaccineList.forEach((vaccine) => {
        let flag = false;
        this.todayVaccine.forEach((today) => {
          if (vaccine.id === today.id) flag = true;
        });
        if (!flag) {
          this.notToday.push({
            id: vaccine.id,
            name: vaccine.name,
          });
        }
      });
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.todayVaccine = [];
      this.notToday = [];
      this.selectedVaccine = [];
    },
    addSchedule() {
      this.vaccineList.forEach((vaccine) => {
        this.selectedVaccine.forEach((select) => {
          if (select.id === vaccine.id && "time" in vaccine) {
            let num = Object.keys(vaccine.time).length;
            vaccine.time[++num + "st"] = this.focus;
            vaccine.time = this.sortSchedule(vaccine.time);
          } else if (select.id === vaccine.id) {
            let num = 1;
            vaccine.time = { [num + "st"]: this.focus };
          }
        });
      });
      this.$emit("new-schedule");
      this.$router.push('/vaccineList')
      this.dialog = false;
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
      return newTime;
    },
    deleteVaccine(id) {
      console.log(id);
      let newTime = {};
      let timeAry = [];
      let newAry = [];
      this.vaccineList.forEach((vaccine) => {
        if (!vaccine.time) return;
        if (vaccine.id === id) {
          console.log(vaccine.time);
          console.log(this.focus);
          timeAry = Object.values(vaccine.time);
          newAry = timeAry.filter((item) => item.match(this.focus) == null);
        }
        newAry = newAry.sort(function (a, b) {
          return a > b ? 1 : -1;
        });
        let i = 1;
        newAry.forEach((time) => {
          newTime[i++ + "st"] = time;
        });
      });
      this.vaccineList.forEach(vaccine => {
        if (vaccine.id === id) {
          vaccine.time = newTime
        }
      })
      this.$emit("new-schedule");
      this.dialog = false
      this.$router.push('/vaccineList')
      // this.$router.push('/schedule')
    },
    editSchedule() {
      this.dialog = true;
      console.log(this.selectedEvent.name);
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange() {
      const events = [];
      this.vaccineList.forEach((vaccine) => {
        if (vaccine.time) {
          for (let day in vaccine.time) {
            events.push({
              name: vaccine.name,
              start: vaccine.time[day],
              end: vaccine.time[day],
              color: this.colors[vaccine.id],
            });
          }
        }
      });
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  created() {
    if (!this.login) {
      this.$router.push("/notLogin");
    }
  },
};
</script>

<style>
</style>