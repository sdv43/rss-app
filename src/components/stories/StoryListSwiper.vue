<template>
    <div ref="container" class="swiper-container">
        <div class="swiper-wrapper">
            <div
                v-for="channel in channels"
                :key="channel.id"
                class="swiper-slide"
            >
                <StoryList :search="search" :stories="storyGetByChannelLocal(channel)"/>
            </div>
        </div>
    </div>
</template>

<script>
import {Swiper} from "swiper";
import StoryList from "@/components/stories/StoryList";
import {mapGetters} from "vuex";

export default {
    name: "StoryListSwiper",
    components: {StoryList},
    props: {
        value: Object,
        channels: Array,
        search: String,
    },
    data() {
        return {
            swiper: undefined,
        };
    },
    computed: {
        ...mapGetters([
            "storyGet",
            "storyGetByChannel",
        ]),
    },
    watch: {
        value(val) {
            const index = this.channels.findIndex(channel => channel.id === val.id);
            this.swiper.slideTo(index);
            this.$router.push({name: "stories", params: {channel: val.name}});
        },
    },
    mounted() {
        this.swiper = new Swiper(
            this.$refs.container,
            {
                initialSlide: this.channels.findIndex(ch => ch.id === this.value.id),
                on: {
                    slideChange: swiper => {
                        this.$emit("input", this.channels[swiper.activeIndex]);
                    },
                },
            },
        );
    },
    methods: {
        storyGetByChannelLocal(channel) {
            if (channel.id === 0) {
                return this.storyGet;
            }

            return this.storyGetByChannel(channel);
        },
    },
};
</script>

<style lang="scss" src="swiper/swiper.scss"></style>
