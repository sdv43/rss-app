<template>
    <div class="cmp-channel-list-item">
        <router-link
            :style="{'background-image': `url(${channel.photo})`}"
            :to="{name: 'stories', params: {channel: channel.name}}"
            class="bg">
            <div class="channel">
                <span class="name">{{ channel.name }}</span>
                <!--                <span class="counter">{{ channel.count }}</span>-->
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: "ChannelListItem",
    props: {
        channel: Object,
    },
};
</script>

<style lang="scss" scoped>
.cmp-channel-list-item {
    margin: 2rem 0;

    .bg {
        display: block;

        overflow: hidden;
        border-radius: .5em;
        padding-top: 5em;

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;

        .channel {
            display: flex;
            justify-content: space-between;
            align-items: center;

            padding: .6em 1em;
            background-color: transparentize($color, .3);
            line-height: 1;

            .name {
                color: white;
            }
        }
    }
}
</style>