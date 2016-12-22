import Vue from 'vue';
import VueResource from 'vue-resource';
import VueProgressBar from 'vue-progressbar';
import VueResourceProgressBarInterceptor from './../src/vue-resource-progressbar-interceptor';
window.Vue = Vue;

Vue.use(VueResource);
Vue.use(VueProgressBar);
Vue.use(VueResourceProgressBarInterceptor);

new Vue({
  template: `
    <div>
      <vue-progress-bar></vue-progress-bar>
      <div>
        <button @click="request()">Make request</button>
        <button @click="longRequest()">Make long request (5 sec)</button>
        <button @click="superLongRequest()">Make super long request (10 sec)</button>
      </div>
      <div v-if="loading">
        Loading...
      </div>
    </div>
  `,

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    request() {
      this.loading = true;
      this.$http.get('https://httpbin.org/ip').finally(this.finish);
    },

    longRequest() {
      this.loading = true;
      this.$http.get('https://httpbin.org/delay/5').finally(this.finish);
    },

    superLongRequest() {
      this.loading = true;
      this.$http.get('https://httpbin.org/delay/10').finally(this.finish);
    },

    finish() {
      this.loading = false;
    },
  },

}).$mount('#app');
