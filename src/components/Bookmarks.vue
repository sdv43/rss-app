<template>
    <Page class="cmp-bookmarks">
        <div class="top-bar">
            <div class="title">
                Bookmarks
            </div>
        </div>
        <StoryList :stories="bookmarkGet" search=""/>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";
import StoryList from "@/components/stories/StoryList";
import {mapGetters} from "vuex";

export default {
    name: "Bookmarks",
    components: {StoryList, Page},
    computed: {
        ...mapGetters([
            "bookmarkGet",
        ]),
    },
};
</script>

<style lang="scss" scoped>
.cmp-bookmarks {
    .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3rem 2rem 3rem;
        height: 3em;

        .title {
            @extend .h2;
            flex-grow: 1;
        }
    }
}
</style>