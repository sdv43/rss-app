import Vue from "vue";
import App from "./App.vue";
import store from "./vuex";
import router from "./vue-router";

Vue.config.productionTip = false;

(async function () {
    const storage = window.localStorage;

    new Vue({
        store: await store(),
        router: router,
        render: h => h(App),
        beforeMount() {
            let token = storage.getItem("token");

            if (!token) {
                const url = new URL(location.href);
                token = url.searchParams.get("token");
            }

            if (token) {
                storage.setItem("token", token);
                this.$store.commit("settingsTokenSet", token);
                this.$store.dispatch("init");
            } else if (this.$route.name === "main") {
                this.$store.state.ready = true;
            } else {
                this.$router.push({name: "sign-in"});
                this.$store.state.ready = true;
            }
        },
    }).$mount("#app");

    if ("serviceWorker" in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/service-worker.js", {scope: "/"});
        });
    }
})();

