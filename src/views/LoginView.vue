<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card width="600px" class="mx-auto mt-5">
          <v-card-title>
            <h1 class="display-1">ログイン</h1>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account-circle"
                label="メールアドレス"
                v-model="email"
              />
              <v-text-field
                v-bind:type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                prepend-icon="mdi-lock"
                v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="パスワード"
                v-model="password"
              />
              <v-card-actions>
                <v-btn class="info" @click="login">ログイン</v-btn>
                <v-btn class="info" to="/createAccount">アカウント作成</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import { instance, query } from "../axios-auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

export default {
  data() {
    return {
      showPassword: false,
      email: "",
      password: "",
      loginId: ""
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log(user.user.uid);
        this.loginId = user.user.uid
        this.getVaccineList(this.loginId);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    },
    async getVaccineList(uid) {
      const db = getDatabase();
      const vaccineList = await ref(db, `users/${uid}/personalData`);
      try {
        onValue(vaccineList, (snapshot) => {
          // const data = snapshot.val();
          // console.log(data);
          this.$emit('login-data', [snapshot.val(), `${this.loginId}`])
          // this.$router.push('/vaccineList')
        });
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    },
  },
};
</script>

<style>
</style>