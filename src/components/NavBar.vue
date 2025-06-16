<template>
  <v-layout>
    <v-app-bar color="transparent" :elevation="0" style="backdrop-filter: blur(4px);">
      <v-app-bar-title>
        <v-avatar size="60"><v-img src="../assets/manager_icon_129392.png"></v-img></v-avatar>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div style="display: flex;">
        <v-icon @click="$router.push('/')" style="font-size: 33px;cursor: pointer;" class="mr-6 RouteIcon1"
          :color="router == '/' ? 'primary' : ''">mdi-home-outline</v-icon>
        <v-icon @click="$router.push('/history')" style="font-size: 33px;cursor: pointer;" class="mr-6 RouteIcon2"
          :color="router == '/history' ? 'red' : ''">mdi-calendar-month</v-icon>
        <v-icon @click="$router.push('/cash')" style="font-size: 33px;cursor: pointer;" class="mr-6 RouteIcon3"
          :color="router == '/cash' ? 'success' : ''">mdi-cash</v-icon>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="logoutDialog=true" icon>
         <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
  </v-layout>
  <v-dialog  v-model="logoutDialog" style="width: 300px;">
    <v-card >
      <v-card-title>هل أنت متأكد من تسجيل الخروج؟</v-card-title>
      <v-card-actions>
        <v-btn class="text-red" @click="logout">نعم</v-btn><v-btn class="text-orange" @click="logoutDialog=false">لا, إلغاء</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      logoutDialog: false
    }
  },
  computed: {
    router() {
      return this.$route.path
    }
  },
  created: function () {
    console.log(this.router);
  },
  methods:{
    logout: function(){
       localStorage.clear();
       location.reload()
    }
  }
}
</script>

<style>
.RouteIcon1:hover {
  color: rgb(83, 83, 255)
}

.RouteIcon2:hover {
  color: rgb(179, 68, 68)
}

.RouteIcon3:hover {
  color: green
}
</style>