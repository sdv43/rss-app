<template>
    <div class="cmp-story-list-item">
        <div class="story-info">
            <div v-if="story.channel" class="channel">{{ story.channel.name.toLowerCase() }}</div>
            <div class="datetime">{{ datetime }}</div>
        </div>
        <div class="story">
            <div v-if="story.photo && story.photo !== 'null'" :style="{'background-image': `url(${story.photo})`}"
                 class="preview"></div>
            <div class="title">
                <router-link :to="{name: 'story', params: {title: story.title}}">
                    <div class="text">
                        {{ story.title }}
                    </div>
                </router-link>
                <div class="categories">
                    <div v-for="category in categories" :key="category" class="category">
                        {{ category }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StoryListItem",
    props: {
        story: Object,
    },
    computed: {
        categories() {
            let categories = this.story.category.slice(0, 2);

            categories = categories.map(c => {
                return c.length < 7 ? c : c.substr(0, 5).trimEnd() + "...";
            });

            return categories;
        },
        datetime() {
            const now = new Date();
            const diff = now.getTime() / 1000 - this.story.datetime;

            if (diff < 60 * 60) {
                return Math.ceil(diff / 60) + " min";
            } else if (diff < 24 * 60 * 60) {
                return Math.ceil(diff / (60 * 60)) + " h";
            } else if (diff < 2 * 24 * 60 * 60) {
                return "yesterday";
            } else {
                return "long ago";
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.cmp-story-list-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    margin: 2rem;

    .story-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        margin-bottom: .5rem;
        width: 100%;

        color: $color-second;
        font-size: .9em;

        .channel {
            font-variant: small-caps;
        }

        .datetime {
            margin-left: auto;
        }
    }

    .story {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        width: 100%;

        .preview {
            margin-right: 1.5em;
            border-radius: .5em;
            min-width: 7em;
            flex-basis: 7em;
            height: 6em;

            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        .title {
            flex-grow: 1;

            .text {
                margin-bottom: .35em;
                max-height: 3 * 1.4em;

                overflow: hidden;

                color: black;
                word-break: break-word;
            }

            .categories {
                display: flex;
                flex-wrap: wrap;

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
        }
    }
}
</style>