<template>
  <div>
    <v-row>
      <v-col cols="6">
        <h2>接種期間表</h2>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="2">
        <v-timeline align-top>
          <v-timeline-item small fill-dot></v-timeline-item>
          <v-timeline-item ></v-timeline-item>
          <v-timeline-item hide-dot></v-timeline-item>
          <v-timeline-item hide-dot></v-timeline-item>
          <v-timeline-item></v-timeline-item>
          <v-timeline-item></v-timeline-item>
          <v-timeline-item hide-dot></v-timeline-item>
          <v-timeline-item></v-timeline-item>
          <v-timeline-item></v-timeline-item>
          <v-timeline-item></v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
    <v-timeline>
      <v-timeline-item>項目1</v-timeline-item>
      <v-timeline-item class="text-right">項目2</v-timeline-item>
      <v-timeline-item>項目3</v-timeline-item>
      <v-timeline-item class="text-right">項目4</v-timeline-item>
      <v-timeline-item>項目5</v-timeline-item>
    </v-timeline> -->
  </div>
</template>

<script>
export default {
  name: "VaccinationPeriod",
  props: {
    vaccineList: Array,
    login: Boolean,
  },
  data() {
    return {};
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