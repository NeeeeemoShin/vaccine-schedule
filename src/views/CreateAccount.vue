<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card width="400px" class="mx-auto mt-5">
          <v-card-title>
            <h1 class="display-1">アカウント登録</h1>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account-circle"
                label="メールアドレス"
                v-model="registerEmail"
              />
              <v-text-field
                v-bind:type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                prepend-icon="mdi-lock"
                v-bind:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="パスワード"
                v-model="registerPassword"
              />
              <v-card-actions>
                <v-btn class="info" @click="signUp">登録</v-btn>
                <v-btn class="info" to="/">ログイン画面</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";

export default {
  data() {
    return {
      showPassword: false,
      registerEmail: "",
      registerPassword: "",
      vaccineList: "",
    };
  },
  methods: {
    async signUp() {
      const auth = getAuth();
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          this.registerEmail,
          this.registerPassword
        );
        console.log(user.user.uid);
        this.getVaccineList(user.user.uid);
        this.$router.push("/");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    },
    async getVaccineList(uid) {
      const db = getDatabase();
      const vaccineList = await ref(db, "vaccineList");
      try {
        onValue(vaccineList, (snapshot) => {
          // const data = snapshot.val();
          set(ref(db, `users/${uid}`), {
            personalData: snapshot.val(),
          });
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