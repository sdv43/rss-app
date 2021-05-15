<template>
    <Page class="cmp-profile">
        <div class="white-section">
            <div class="top-bar">
                <img svg-inline class="icon" src="@/assets/images/icons/arrow_back_black_24dp.svg"
                     @click="$router.back()"/>
            </div>
            <img :src="userGet.photoUrl" class="photo"/>
            <div class="user-name">
                {{ userGet.name }}
            </div>
            <div class="auth-description">
                You are signed in with {{ userGet.provider }}
            </div>
        </div>
        <div class="menu">
            <div class="item" @click="signOut">
                <img svg-inline class="icon" src="@/assets/images/icons/logout_black_24dp.svg"/>
                <div class="label">Sign out</div>
            </div>
        </div>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";
import {mapGetters} from "vuex";

export default {
    name: "Profile",
    components: {Page},
    computed: {
        ...mapGetters([
            "userGet",
        ]),
    },
    methods: {
        signOut() {
            // todo
            const storage = window.localStorage;

            storage.removeItem("token");
            this.$router.push({name: "sign-in"});
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-profile {
    display: flex;
    flex-direction: column;

    .white-section {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 2rem;
    }

    .top-bar {
        display: flex;
        padding: 0 0 2em 0;

        .icon {
            fill: $top-bar-icon-color;
        }
    }

    .photo {
        margin: 0 auto 2em;
        border-radius: 4em;
        width: 8em;
        height: 8em;

    }

    .user-name {
        @extend .h2;
        text-align: center;
    }

    .menu {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        padding: 2em;
        margin: auto 0;

        .item {
            display: flex;
            align-items: center;

            margin-bottom: 1px;
            padding: 1em;

            background-color: white;

            &:first-of-type {
                border-radius: .5em .5em 0 0;
            }

            &:last-of-type {
                border-radius: 0 0 .5em .5em;
            }

            .icon {
                margin-right: 1em;
                fill: #327feb;
            }

            .label {
                font-size: .9em;
            }
        }
    }

    .auth-description {
        @extend .text;
        margin: 2rem 0 0;

        font-size: .9em;
        text-align: center;
        line-height: 1.5;
        color: $color-second;
    }

    .button-sign-out {
        margin-top: auto;
    }
}
</style>