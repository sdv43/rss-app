<template>
    <transition appear name="button-float-appear">
        <div :class="['cmp-button-float-bookmark', state]">
            <transition mode="out-in" name="icon-change">
                <img
                    svg-inline
                    v-if="state === 'add'" key="add" class="icon"
                    src="@/assets/images/icons/bookmark_add_black_24dp.svg">
                <img
                    svg-inline
                    v-else key="remove" class="icon"
                    src="@/assets/images/icons/bookmark_remove_black_24dp.svg">
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    name: "ButtonFloatBookmark",
    props: {
        state: {
            type: String,
            default: "add",
        },
    },
};
</script>

<style lang="scss" scoped>
.button-float-appear {
    &-enter {
        opacity: 0;
        transform: scale(.6);
    }

    &-enter-to {
        opacity: 1;
        transform: scale(1);
    }
}

.cmp-button-float-bookmark {
    position: fixed;
    right: 1.5em;
    bottom: 1.5em;

    display: flex;
    border-radius: 3em;
    padding: 1.2em;
    width: 24px;
    height: 24px;

    background-color: $button-background-color-default;

    transition: background-color ease-out 200ms,
    opacity ease-in-out 100ms,
    transform ease-in-out 100ms;

    &.remove {
        background-color: crimson;
    }

    .icon {
        outline: none;
        fill: white;
        transition: opacity ease-in-out 100ms,
        transform ease-in-out 100ms;
    }

    .icon-change-leave,
    .icon-change-enter-to,
    {
        opacity: 1;
        transform: scale(1);
    }

    .icon-change-leave-to,
    .icon-change-enter,
    {
        opacity: 0;
        transform: scale(.3);
    }
}
</style>