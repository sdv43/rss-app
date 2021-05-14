<template>
    <Page class="cmp-main">
        <div class="icon">
            <img alt="RSS App" src="/icon-308.png"/>
            <div class="point point-1"></div>
            <div class="point point-2"></div>
            <div class="point point-3"></div>
            <div class="point point-4"></div>
            <div class="point point-5"></div>
            <div class="point point-6"></div>
            <div class="point point-7"></div>
            <div class="point point-8"></div>
        </div>
        <div class="app-name">
            <div>RSS App</div>
        </div>
        <div class="buttons">
            <router-link :to="{name: 'sign-in'}" class="button-try-it">Try it</router-link>
        </div>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";

export default {
    name: "Main",
    components: {Page},
};
</script>

<style lang="scss" scoped>
.cmp-main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding: 2em;

    .icon {
        position: relative;
        padding: 5em 0 3em;
        width: 100%;

        text-align: center;

        img {
            width: 50%;
        }

        .point {
            position: absolute;
            display: inline-block;
            border-radius: 50%;

            transition: top ease-out 10s, left ease-out 10s;

            &-1, &-2, &-3, &-4 {
                width: 1em;
                height: 1em;
            }

            &-5, &-6 {
                width: .5em;
                height: .5em;
            }

            &-7, &-8 {
                width: .25em;
                height: .25em;
            }

            &-1 {
                left: 5%;
                top: 40%;
                background-color: coral;
            }

            &-2 {
                left: 15%;
                top: 80%;
                background-color: gold;
            }

            &-3 {
                left: 90%;
                top: 5%;
                background-color: crimson;
            }

            &-4 {
                left: 95%;
                top: 90%;
                background-color: #327feb;
            }

            &-5 {
                left: 80%;
                top: 60%;
                background-color: steelblue;
            }

            &-6 {
                left: 35%;
                top: 5%;
                background-color: #327feb;
            }

            &-7 {
                left: 15%;
                top: 140%;
                background-color: #327feb;
            }

            &-8 {
                left: 75%;
                top: 120%;
                background-color: crimson;
            }
        }
    }

    .app-name {
        @extend .h1;
        margin-top: 1em;
    }

    .buttons {
        margin-top: auto;
        width: 100%;

        .button-try-it {
            @extend .button-default;
            width: 100%;
        }
    }
}
</style>