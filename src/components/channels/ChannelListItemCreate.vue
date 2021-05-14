<template>
    <transition name="item-create">
        <div
            v-if="show"
            ref="backdrop"
            class="cmp-channel-list-item-create"
            @click="hideForm"
        >
            <div class="form">
                <div class="title">
                    Create a channel
                </div>
                <input v-model="model.name" class="input-name" placeholder="Name"/>
                <input v-model="model.rssUrl" class="input-address" placeholder="RSS address"/>
                <button class="button-create" @click="channelCreate">Create</button>
            </div>
        </div>
    </transition>
</template>

<script>
import ChannelDE from "@/data-entities/ChannelDE";

export default {
    name: "ChannelListItemCreate",
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            model: new ChannelDE(),
        };
    },
    methods: {
        hideForm(event) {
            if (this.$refs.backdrop === event.target) {
                this.$emit("hide");
            }
        },
        async channelCreate() {
            await this.$store.dispatch("channelCreate", this.model);
            this.$emit("hide");
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-channel-list-item-create {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(0, 0, 0, .3);

    .form {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        border-radius: 1rem 1rem 0 0;
        padding: 2rem;

        background-color: $background-color;

        .title {
            @extend .h3;
            margin-bottom: 1rem;
        }

        .input-name,
        .input-address {
            @extend .input-default;

            width: 100%;
            margin: 1rem 0 0;
        }

        .button-create {
            @extend .button-default;

            width: 100%;
            margin: 2rem 0 1rem;
        }
    }
}

.item-create {
    &-enter, &-leave-to {
        background-color: rgba(0, 0, 0, 0);

        .form {
            transform: translateY(21rem);
        }
    }

    &-enter-active, &-leave-active {
        transition: background-color ease-out .2s;

        .form {
            transition: transform ease-out .15s;
        }
    }

    &-enter-to, &-leave {
        background-color: rgba(0, 0, 0, .3);

        .form {
            transform: translateY(0rem);
        }
    }
}
</style>