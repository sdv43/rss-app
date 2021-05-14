<template>
    <Page class="cmp-story">
        <div class="top-bar">
            <img svg-inline class="icon" src="@/assets/images/icons/arrow_back_black_24dp.svg" @click="$router.back()"/>
            <a :href="story.link" class="open-story" target="_blank">
                <img svg-inline class="icon" src="@/assets/images/icons/open_in_new_black_24dp.svg">
            </a>
        </div>
        <div class="title">
            {{ story.title }}
        </div>
        <div class="info">
            <div v-if="story.author" class="author">By {{ story.author }}</div>
            <div>{{ (new Date(story.datetime * 1000)).toLocaleString() }}</div>
        </div>
        <div v-if="categories.length" class="categories">
            <div v-for="category in categories" :key="category" class="category">
                {{ category }}
            </div>
        </div>
        <div class="text" v-html="story.text"></div>
        <ButtonFloatBookmark
            :state="buttonBookmark"
            @click.native="saveOrDeleteBookmark"/>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";
import ButtonFloatBookmark from "@/components/elements/ButtonFloatBookmark";

export default {
    name: "Story",
    components: {ButtonFloatBookmark, Page},
    data() {
        return {
            story: undefined,
        };
    },
    computed: {
        categories() {
            let categories = this.story.category.slice(0, 5);

            categories = categories.map(c => {
                return c.length < 12 ? c : c.substr(0, 12).trimEnd() + "...";
            });

            return categories;
        },
        buttonBookmark() {
            return this.$store.getters.storyIsSaved(this.story) ? "remove" : "add";
        },
    },
    beforeMount() {
        this.story = this.$store.getters.storyGetByTitle(this.$route.params.title);
    },
    methods: {
        async saveOrDeleteBookmark() {
            await this.$store.dispatch(
                this.buttonBookmark === "add" ? "bookmarkCreate" : "bookmarkDelete",
                this.buttonBookmark === "add" ? this.story : this.$store.getters.bookmarkGetByStory(this.story),
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-story {
    padding: 2rem;

    .top-bar {
        display: flex;
        padding: 0 0 2em 0;

        .icon {
            fill: $top-bar-icon-color;
        }

        .open-story {
            margin-left: auto;
        }
    }

    .title {
        @extend .h1;
        line-height: 1.4;
    }

    .info {
        display: flex;
        margin-top: 2rem;

        color: $color-second;

        .author {
            margin-right: .5em;
        }
    }

    .categories {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2rem;

        .category {
            margin: 0 .5em .5em 0;
            border: 1px solid lighten($button-background-color-default, 20%);
            border-radius: .25em;
            padding: .25em .5em;

            background-color: lighten($button-background-color-default, 40%);
            color: $button-background-color-default;

            white-space: nowrap;
            font-size: .8em;
        }
    }

    .image {
        margin-top: 2rem;
        border-radius: .5em;
        width: 100%;
        height: 10em;

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .text::v-deep {
        margin-top: 2rem;
        word-break: break-word;
        line-height: 1.5;
        color: $color;

        img {
            max-width: 100%;
        }
    }
}
</style>