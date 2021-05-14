import Vue from "vue";
import VueRouter from "vue-router";
import SignIn from "@/components/SignIn";
import Stories from "@/components/Stories";
import Story from "@/components/Story";
import Profile from "@/components/Profile";
import Channels from "@/components/Channels";
import Bookmarks from "@/components/Bookmarks";
import Main from "@/components/Main";

Vue.use(VueRouter);

export default new VueRouter({
    mode: "history",
    routes: [
        {name: "main", path: "/", component: Main, props: {bottomBarDisable: true}},
        {name: "sign-in", path: "/sign-in", component: SignIn, props: {bottomBarDisable: true}},
        {name: "stories", path: "/stories/:channel", component: Stories, props: {defaultChannel: "Latest"}},
        {name: "story", path: "/story/:title", component: Story, props: {bottomBarDisable: true}},
        {name: "profile", path: "/profile", component: Profile, props: {bottomBarDisable: true}},
        {name: "channels", path: "/channels", component: Channels},
        {name: "bookmarks", path: "/bookmarks", component: Bookmarks},
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
});