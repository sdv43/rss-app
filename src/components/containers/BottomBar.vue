<template>
    <div :class="{'cmp-bottom-bar': true, 'hide': (hide && !disable) || disable}">
        <div
            v-for="item in items"
            :key="item.label"
            :class="{
                'item': true,
                'active': isActive(item),
            }"
            @click="itemClick(item)"
        >
            <span class="icon" v-html="item.icon"></span>
            <div class="label">{{ item.label }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BottomBar",
    data() {
        return {
            itemSelected: undefined,
            items: [
                {
                    label: "Home",
                    icon: require(`!!raw-loader?esModule=false!@/assets/images/icons/home_black_24dp.svg`),
                    route: {name: "stories", params: {channel: "Latest"}},
                    default: true,
                },
                {
                    label: "Channels",
                    icon: require(`!!raw-loader?esModule=false!@/assets/images/icons/view_stream_black_24dp.svg`),
                    route: {name: "channels"},
                },
                {
                    label: "Bookmarks",
                    icon: require(`!!raw-loader?esModule=false!@/assets/images/icons/bookmarks_black_24dp.svg`),
                    route: {name: "bookmarks"},
                },
            ],
            disable: false,
            hide: false,
        };
    },
    methods: {
        isActive(item) {
            return this.itemSelected
                ? this.itemSelected.label === item.label
                : false;
        },
        itemClick(item) {
            this.itemSelected = item;

            // todo
            if (item.label === "Home" && this.$store.state.storiesLastSelectedChannel) {
                item.route.params.channel = this.$store.state.storiesLastSelectedChannel.name;
            }

            this.$router.push(item.route);
        },
        itemCheck(route) {
            this.itemSelected = this.items.find(item => item.route.name === route.name);
        },
    },
    beforeMount() {
        this.disable = !!this.$route.matched.find(route => route.props.default?.bottomBarDisable);
        this.itemCheck(this.$route);

        this.$router.beforeEach((to, from, next) => {
            this.disable = !!to.matched.find(route => route.props.default?.bottomBarDisable);
            this.itemCheck(to);
            next();
        });
    },
    mounted() {
        let lastScrollY = window.scrollY;

        window.addEventListener("scroll", () => {
            if (window.scrollY < 200) {
                this.hide = false;
            } else {
                let scrollDown = lastScrollY < window.scrollY;
                let scrollSize = Math.abs(lastScrollY - window.scrollY);

                if (scrollDown) {
                    this.hide = true;
                } else if (scrollSize > 3) { // scroll up
                    this.hide = false;
                }
            }

            lastScrollY = window.scrollY;
        });
    },
};
</script>

<style lang="scss" scoped>
.cmp-bottom-bar {
    z-index: 1;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 1em;

    background-color: white;

    transform: translateY(0);
    transition: transform cubic-bezier(0, 0, 0.1, 1) 300ms;

    &.hide {
        transform: translateY(calc(3em + 24px));
    }

    .item {
        display: flex;
        align-items: center;

        margin-right: 1em;
        border-radius: 1.5em;
        padding: .5em 1em;
        background-color: white;

        transition: background-color ease-out 300ms;

        &:last-of-type {
            margin-right: 0;
        }

        &.active {
            background-color: aliceblue;

            .icon::v-deep {
                svg {
                    fill: $button-background-color-default;
                }
            }

            .label {
                color: $button-background-color-default;
                font-size: .8em;
            }
        }

        .icon::v-deep {
            display: flex;

            svg {
                fill: darken($input-background-color-default, 20%);

                transition: fill ease-out 300ms;
            }
        }

        .label {
            margin-left: .5em;

            font-size: 0;
            color: white;

            transition: color cubic-bezier(0.59, 0.01, 1, 0.11) 250ms, font-size ease-out 250ms;
        }
    }
}
</style>