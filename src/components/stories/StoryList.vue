<template>
    <div class="cmp-story-list">
        <div v-if="storiesLocal.length">
            <StoryListItem
                v-for="story in storiesLocal"
                :key="story.id"
                :story="story"
            />
        </div>
        <div v-else class="no-stories">
            <div v-if="search.length" class="text">No results!</div>
            <div v-else class="text">No stories yet!</div>
        </div>
    </div>
</template>

<script>
import StoryListItem from "@/components/stories/StoryListItem";

export default {
    name: "StoryList",
    components: {StoryListItem},
    props: {
        stories: Array,
        search: String,
    },
    computed: {
        storiesLocal() {
            return this.stories.filter(s => s.title.includes(this.search));
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-story-list {
    .no-stories {
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
    }
}
</style>