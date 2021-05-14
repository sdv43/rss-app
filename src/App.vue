<template>
    <div id="app">
        <transition v-if="$store.state.ready" appear mode="out-in" name="fade">
            <router-view/>
        </transition>
        <BottomBar/>
    </div>
</template>

<script>
import BottomBar from "./components/containers/BottomBar";

export default {
    name: "App",
    components: {BottomBar},
};
</script>

<style lang="scss">
#app {
    flex-grow: 1;
    width: 100%;
}

.fade-enter-active {
    transition: opacity 100ms ease-in;
}

.fade-leave-active {
    transition: opacity 50ms ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-leave,
.fade-enter-to {
    opacity: 1;
}
</style>
