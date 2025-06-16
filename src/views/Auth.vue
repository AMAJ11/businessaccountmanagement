<template>

    <v-row>
        <v-col col="12" md="6" class="pa-6 pa-md-16 pa-sm-6 pt-13 pb-1">

            <v-card class="pa-6 pa-md-16 pa-sm-6 pt-0 pt-md-0 pb-1"
                style="min-height: 80vh;width: 100%;max-width: 500px;margin: auto;margin-bottom: 0;border-radius: 15px;"
                variant="" :elevation="0">
                <p class="text-button" style="font-size: 25px !important;"> <span class="text-success"> Admin </span>
                    App
                </p>
                <v-tabs fixed-tabs v-model="tab" bg-color="transparent" style="width: 100%;">
                    <v-tab value="one">Login</v-tab>
                    <v-tab value="two">Signup</v-tab>
                </v-tabs>

                <v-tabs-window v-model="tab" class="mt-5">
                    <v-tabs-window-item value="one">
                        <div style="display: flex;justify-content: center;">
                            <!-- <v-img src="../assets/download.png"  width="100px" height="100px"></v-img> -->
                        </div>
                        <p>Please, login so you can access all applications features.</p>
                        <v-form ref="logForm" @submit.prevent="login">
                            <v-text-field :rules="emailrule" color="primary" :elevation="10" variant="outlined"
                                label="Email" v-model="email" class="mb-4 mt-4" placeholder="Example@gmail.com"
                                append-inner-icon="mdi-email"></v-text-field>
                            <v-text-field :rules="FormRule" color="primary" :elevation="10" variant="outlined"
                                label="Password" :type="Show ? 'text' : 'password'" v-model="password"
                                :append-inner-icon="Show ? 'mdi-eye' : 'mdi-eye-off-outline'"
                                @click:append-inner="ShowPassword"></v-text-field>
                                <p class="text-red mb-3" style="text-align: center;">{{ errorLogMessage }}</p>
                            <div style="display: flex;justify-content: center" class="mb-2">
                                <v-btn style="width: 200px;" :loading="loginLoading" type="submit"
                                    color="success">Login</v-btn>
                            </div>
                        </v-form>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="two">
                        <!-- <div style="display: flex;justify-content: center;"><v-img src="../assets/welcome_people_icon_176891.png"
                width="200px" height="200px"></v-img></div> -->

                        <p>Don't have an account? Sign up now
                        </p>
                        <v-form ref="signupForm" @submit.prevent="Signup">
                            <v-text-field :rules="FormRule" color="primary" :elevation="10" variant="outlined"
                                label="Name" v-model="Name" class="mb-1 mt-4" placeholder="Write A full name"
                                append-inner-icon="mdi-account"></v-text-field>
                            <v-text-field :rules="emailrule" color="primary" :elevation="10" variant="outlined"
                                label="Email" v-model="emailSignup" class="mb-1" placeholder="Example@gmail.com"
                                append-inner-icon="mdi-email"></v-text-field>
                            <v-text-field :rules="passwordsi" color="primary" :elevation="10" variant="outlined"
                                label="Password" type="password" v-model="passwordSignup" class="mb-1"
                                append-inner-icon="mdi-key" @click:append-inner="ShowPassword"></v-text-field>
                            <v-text-field :rules="passwordSIgnupRule" color="primary" :elevation="10" variant="outlined"
                                label="Confirm password" type="password" v-model="passwordConfirm" class=""
                                append-inner-icon="mdi-key"></v-text-field>
                                <p class="text-red mb-1">{{ errorSinup }}</p>
                            <div style="display: flex;justify-content: center" class="mb-2">
                                <v-btn style="width: 200px;" type="submit" :loading="signupLoading"
                                    color="success">Create Account</v-btn>
                            </div>
                        </v-form>
                    </v-tabs-window-item>
                </v-tabs-window>

            </v-card>
        </v-col>
        <v-col class="hidden-sm-and-down" md="6">
            <v-img src="../assets/—Pngtree—3d character modeling digital marketing_12995450.png"></v-img>
        </v-col>
    </v-row>

</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            errorLogMessage:"",
            apiurl: process.env.VUE_APP_API_URL,
            email: "",
            password: "",
            passwordSignup: "",
            emailSignup: "",
            Show: false,
            tab: "one",
            passwordConfirm: "",
            Name: "",
            errorSinup:"",
            loginLoading: false,
            signupLoading: false,
            FormRule: [(data) => {
                if (data) return true
                return "you must Fill this field"
            }],
              passwordsi: [(data) => {
                if (data && data.length > 8) return true
                 else if (!data) return "you must Fill this field"
                else if (data.length < 8) return "passwords must be large than 8 char"
            }],
            passwordSIgnupRule: [(data) => {
                if (data && data == this.passwordSignup) return true
                else if (!data) return "you must Fill this field"
                else if (data != this.passwordSignup) return "passwords not match"

            }],
            emailrule: [
                v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid '
            ],
        }
    },
    methods: {
        login: function () {
            this.$refs.logForm.validate()
                .then(async valid => {
                    if (valid.valid == true) {
                        this.loginLoading = true
                        try {
                            let response = await axios.post(`${this.apiurl}/auth/login`,
                                {
                                    email: this.email,
                                    password: this.password
                                }
                            )
                            localStorage.setItem("userId", response.data.user._id)
                            localStorage.setItem("username", response.data.user.username)
                            localStorage.setItem("token", response.data.token)
                            location.reload()
                        } catch (error) {
                             if(error.response.data.message=='password unvalid'){
                             this.errorLogMessage = 'كلمة المرور خاطئة'
                            }else{
                               this.errorLogMessage = 'هناك خطأ ما يرجى التأكد من الحساب و اعادة المحاولة'
                            }
                            this.email=""
                            this.password=""
                            this.loginLoading=false   
                        }


                    }
                })
        },
        Signup: function () {
            this.$refs.signupForm.validate()
                .then(async valid => {
                    if (valid.valid == true) {
                        this.signupLoading = true
                         try {
                            let response = await axios.post(`${this.apiurl}/auth/register`,
                                {
                                    email: this.emailSignup,
                                    password: this.passwordSignup,
                                    username: this.Name
                                }
                            )
                            console.log(response);
                            
                            localStorage.setItem("userId", response.data.body._id)
                            localStorage.setItem("username", response.data.body.username)
                            localStorage.setItem("token", response.data.token)
                            location.reload()
                        } catch (error) {
                              if(error.response.data.message == 'Email already in use'){
                                this.errorSinup="هذا الحساب مستخدم مسبقا, يرجى تسجيل الدخول"}
                            this.emailSignup=""  
                            this.passwordSignup=""
                             this.passwordConfirm=""
                            this.Name=""
                            this.signupLoading=false   
                            }
                        
                        }
                    
                })
        },
        ShowPassword: function () {
            this.Show = !this.Show
        }
    }
}
</script>

<style>
.pic {}
</style>