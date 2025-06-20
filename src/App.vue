<template>
  <NavBar v-if="router !='/Auth'"/>  
  <v-app>
    <div v-if="router !='/Auth'" style="display: flex;justify-content: space-between;" class="px-4 px-md-8 py-16 pb-2 mt-6">
      <v-chip>
        <h2> {{ time }} </h2>
      </v-chip>
      <v-chip>
        <h2> {{ date }} </h2>
      </v-chip>
    </div>
    <v-main>
      
      <router-view  style="width: 96%"/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  components: { NavBar },
  created: function () {

    setInterval(() => {
      let t = new Date();
      this.time = t.toLocaleTimeString();
      this.date = t.toLocaleDateString();
      
    }, 1000);
  },
  data() {
    return {
      date: "",
      time: "",
    }
  },
  computed:{
    router(){
      return this.$route.path
    }
  }
}
</script>