import Vue from "vue";
import Vuex from "vuex";
import Api from "./api/Api";

Vue.use(Vuex);

export default async function () {
    let api = null;

    return new Vuex.Store({
        state: {
            ready: false,
            user: null,
            channels: [],
            bookmarks: [],
            stories: [],
            storiesLastSelectedChannel: null,
            settings: {
                token: null,
            },
        },
        mutations: {
            userSet(state, user) {
                state.user = user;
            },
            channelsSet(state, channels) {
                state.channels = channels;
            },
            bookmarksSet(state, bookmarks) {
                state.bookmarks = bookmarks.map(bookmark => {
                    bookmark.channel = state.channels.find(channel => channel.id == bookmark.channel);

                    return bookmark;
                });
            },
            storiesSet(state, stories) {
                state.stories = stories.map(story => {
                    story.channel = state.channels.find(channel => channel.id == story.channel);

                    return story;
                });
            },
            channelsAdd(state, channel) {
                state.channels.push(channel);
            },
            bookmarkAdd(state, bookmark) {
                bookmark.channel = state.channels.find(channel => channel.id == bookmark.channel);

                state.bookmarks.push(bookmark);
            },
            bookmarkDelete(state, bookmark) {
                const index = state.bookmarks.findIndex(b => b.id === bookmark.id);

                if (index > -1) {
                    state.bookmarks.splice(index, 1);
                }
            },
            settingsTokenSet(state, token) {
                state.settings.token = token;
            },
        },
        getters: {
            /**
             * @returns {ChannelDE[]}
             */
            channelGet(state) {
                return state.channels;
            },
            /**
             * @returns {StoryDE[]}
             */
            bookmarkGet(state) {
                return state.bookmarks;
            },
            bookmarkGetByStory(state) {
                return story => {
                    return state.bookmarks.find(b => b.id === story.id);
                };
            },
            /**
             * @returns {StoryDE[]}
             */
            storyGet(state) {
                return state.stories;
            },
            storyGetByChannel(state, getters) {
                return channel => {
                    return getters.storyGet.filter(story => {
                        return story.channel.id == channel.id;
                    });
                };
            },
            storyGetByTitle(state, getters) {
                return title => {
                    return getters.storyGet.find(story => story.title === title);
                };
            },
            storyIsSaved(state, getters) {
                return story => {
                    return !!getters.bookmarkGet.find(b => b.id === story.id);
                };
            },
            /**
             * @returns {UserDE|null}
             */
            userGet(state) {
                return state.user;
            },
            userIsSessionExpired(state) {
                return !state.user?.sessionExpired;
            },
            settingsTokenGet(state) {
                return state.settings.token;
            },
        },
        actions: {
            async init(ctx) {
                api = new Api(ctx.getters.settingsTokenGet);

                ctx.commit("userSet", await api.userGet());
                ctx.commit("channelsSet", await api.channelGet());
                ctx.commit("storiesSet", await api.storyGet());
                ctx.commit("bookmarksSet", await api.bookmarkGet());

                ctx.state.ready = true;
            },
            async channelCreate(ctx, channel) {
                ctx.commit("channelsAdd", await api.channelCreate(channel));
            },
            async bookmarkCreate(ctx, story) {
                ctx.commit("bookmarkAdd", await api.bookmarkCreate(story));
            },
            async bookmarkDelete(ctx, bookmark) {
                ctx.commit("bookmarkDelete", await api.bookmarkDelete(bookmark));
            },
        },
    });
}
