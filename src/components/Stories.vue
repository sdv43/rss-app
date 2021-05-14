<template>
    <Page class="cmp-stories">
        <div class="user">
            <div class="hi">
                Hi, {{ userName }}!
            </div>
            <router-link :to="{name: 'profile'}">
                <img :alt="userName" :src="userGet.photoUrl" class="photo"/>
            </router-link>
        </div>
        <div v-if="channelGet.length">
            <div class="search">
                <input v-model="search" class="input-search" placeholder="Search something"/>
                <img svg-inline class="icon" src="@/assets/images/icons/search_black_24dp.svg">
            </div>
            <StoryListFilter v-model="channelSelected" :channels="channelGetLocal"/>
            <StoryListSwiper v-model="channelSelected" :channels="channelGetLocal" :search="search"/>
        </div>
        <div v-else class="no-channels">
            <div class="text">
                You don't have any RSS feeds yet!
            </div>
            <div>
                <router-link :to="{name: 'channels'}" class="button-create-channel">Create a channel</router-link>
            </div>
        </div>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";
import {mapGetters} from "vuex";
import StoryListFilter from "@/components/stories/StoryListFilter";
import ChannelDE from "@/data-entities/ChannelDE";
import StoryListSwiper from "@/components/stories/StoryListSwiper";

export default {
    name: "Stories",
    components: {StoryListSwiper, StoryListFilter, Page},
    data() {
        return {
            search: "",
        };
    },
    computed: {
        ...mapGetters([
            "storyGet",
            "channelGet",
            "userGet",
        ]),
        channelSelected: {
            get() {
                return this.$store.state.storiesLastSelectedChannel;
            },
            set(val) {
                this.$store.state.storiesLastSelectedChannel = val;
            },
        },
        channelGetLocal() {
            const latest = new ChannelDE();

            latest.id = 0;
            latest.name = "Latest";

            return [latest, ...this.channelGet];
        },
        userName() {
            const to = this.userGet.name.indexOf(" ");
            return this.userGet.name.substring(0, to);
        },
    },
    beforeMount() {
        this.channelSelected = this.channelGetLocal.find(ch => ch.name === this.$route.params.channel) ?? this.channelGetLocal[0];
    },
};
</script>

<style lang="scss" scoped>
.cmp-stories {

    .user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3rem 2rem;

        .hi {
            @extend .h2;
            flex-grow: 1;
        }

        .photo {
            border-radius: 50%;
            height: 3em;
            width: 3em;
        }
    }

    .search {
        position: relative;
        display: flex;
        margin: 0 2rem;

        .input-search {
            @extend .input-default;

            flex-grow: 1;
            padding-left: calc(2rem + 22px);

            &:focus + .icon {
                fill: darken($top-bar-icon-color, 20%);
            }
        }

        .icon {
            position: absolute;
            top: calc(1.4rem - 10px);
            left: 1rem;
            fill: $top-bar-icon-color;
        }
    }

    .no-channels {
        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 2rem;
        font-size: 0.9em;
        line-height: 1.5;

        .text {
            margin: 2rem 0 0;
            text-align: center;
            color: $color-second;
        }

        .button-create-channel {
            color: $link-color;
        }
    }
}
</style>