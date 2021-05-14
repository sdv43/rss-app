<template>
    <div class="cmp-channel-list">
        <ChannelListItem
            v-for="channel in channels"
            :key="channel.id"
            :channel="channel"
        />
    </div>
</template>

<script>
import ChannelListItem from "@/components/channels/ChannelListItem";

export default {
    name: "ChannelList",
    components: {ChannelListItem},
    props: {
        channels: Array,
    },
};
</script>

<style lang="scss" scoped>
.cmp-channel-list {
    margin: 2rem 0;
}
</style>