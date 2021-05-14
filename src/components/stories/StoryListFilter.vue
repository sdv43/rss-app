<template>
    <div class="cmp-story-list-filter">
        <div class="tabs">
            <div
                v-for="channel in channels"
                :key="channel.id"
                :ref="`tab`"
                :class="{'tab': true, 'active': isActive(channel)}"
                @click="$emit('input', channel)"
            >
                {{ channel.name }}
            </div>
        </div>
        <div class="point-field">
            <div
                ref="point"
                :class="{'point':true, 'swipe': swipe}"
                :style="{'transform': `translateX(${this.pointPosition}px)`,}"
                @animationend="swipe = false"
            ></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StoryListFilter",
    props: {
        value: Object,
        channels: Array,
    },
    data() {
        return {
            swipe: false,
            pointPosition: 0,
        };
    },
    watch: {
        value(val) {
            const index = this.channels.findIndex(channel => channel.id === val.id);
            this.movePointToTab(this.$refs.tab[index]);
        },
    },
    mounted() {
        const index = this.channels.findIndex(channel => channel.id === this.value.id);
        this.movePointToTab(this.$refs.tab[index]);
    },
    methods: {
        isActive(channel) {
            return this.value.id === channel.id;
        },
        movePointToTab(tab) {
            this.swipe = true;

            const pointOffsetLeft = this.$refs.point.offsetLeft;
            const tabOffsetLeft = tab.offsetLeft;

            this.pointPosition = tabOffsetLeft - pointOffsetLeft;

            const containerMiddle = this.$el.clientWidth / 2;
            const tabMiddle = tabOffsetLeft - this.$el.offsetLeft + tab.clientWidth / 2;
            const tabStart = tabOffsetLeft - this.$el.offsetLeft - this.$el.scrollLeft;
            const tabEnd = tabOffsetLeft - this.$el.offsetLeft + tab.clientWidth - this.$el.scrollLeft;

            const scrollValue = tabMiddle - containerMiddle - this.$el.scrollLeft;

            if (tabStart < 0 || tabEnd > this.$el.clientWidth) {
                this.$el.scrollBy({left: scrollValue});
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-story-list-filter {
    z-index: 2;
    position: sticky;
    top: 0;
    margin: 2em 0 0;
    padding: .5em 0 .5em;

    overflow: auto;
    scroll-behavior: smooth;

    background-color: $background-color;

    &::-webkit-scrollbar {
        display: none;
    }

    .tabs {
        display: flex;
        padding: 0 2rem;

        .tab {
            margin-right: .5em;
            padding: .5em 1.5em .5em 0;

            line-height: 1;
            color: $color-second;

            transition: color ease-in-out 300ms;

            &.active {
                color: $color;
            }

            &:last-of-type {
                padding-right: 2rem;
            }
        }
    }


    .point-field {
        .point {
            margin-left: 2rem;
            border-radius: 2.5px;
            width: 1em;
            height: 5px;

            background-color: #327feb;

            transition: transform ease-in-out 300ms;

            &.swipe {
                animation-name: swipe;
                animation-duration: 300ms;
                animation-timing-function: ease-in-out;
            }
        }
    }
}

@keyframes swipe {
    0% {
        width: 1em;
    }

    50% {
        width: 2em;
    }

    100% {
        width: 1em;
    }
}
</style>