<template>
    <Page class="cmp-channels">
        <div class="top-bar">
            <div class="title">
                Channels
            </div>
            <div class="button-add-channel" @click="show = true">
                <img svg-inline class="icon" src="@/assets/images/icons/add_black_24dp.svg">
            </div>
        </div>
        <ChannelList :channels="channelGet"/>
        <ChannelListItemCreate :show="show" @hide="show = false"/>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";
import ChannelList from "@/components/channels/ChannelList";
import ChannelListItemCreate from "@/components/channels/ChannelListItemCreate";
import {mapGetters} from "vuex";

export default {
    name: "Channels",
    components: {ChannelListItemCreate, ChannelList, Page},
    data() {
        return {
            show: false,
        };
    },
    computed: {
        ...mapGetters([
            "channelGet",
        ]),
    },
};
</script>

<style lang="scss" scoped>
.cmp-channels {
    padding: 2rem;

    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0 3rem;

        .title {
            @extend .h2;
            flex-grow: 1;
        }

        .button-add-channel {
            display: flex;
            justify-content: center;
            align-items: center;

            border-radius: 3em;
            width: 3em;
            height: 3em;

            background-color: $input-background-color-default;

            .icon {
                fill: darken($input-background-color-default, 30%);
            }
        }
    }
}
</style>