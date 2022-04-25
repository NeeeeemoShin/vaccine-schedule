<template>
  <div>
    <v-row>
      <v-col>
        <v-btn @click="turnLoginVue">ログイン画面に戻ります</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "NotLogin",
  methods: {
    turnLoginVue() {
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>