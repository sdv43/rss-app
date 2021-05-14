import ChannelDE from "../data-entities/ChannelDE";
import UserDE from "../data-entities/UserDE";
import StoryDE from "../data-entities/StoryDE";

export default class Api {
    #token;

    constructor(token) {
        this.#token = token;
    }

    async query(method, params) {
        const url = new URL("/api.php", location.origin);
        let data;

        if (method.includes(".get")) {
            url.searchParams.append("method", method);
            url.searchParams.append("params[token]", this.#token);
        } else {
            data = new FormData();

            data.append("method", method);
            data.append("params[token]", this.#token);

            for (let key in params) {
                data.append(`params[${key}]`, params[key]);
            }
        }

        const response = await fetch(url.toString(), {
            method: method.includes(".get") ? "GET" : "POST",
            mode: "same-origin",
            credentials: "omit",
            body: data,
        });

        const responseData = await response.json();

        if (responseData.error) {
            throw new Error(`Api error: ${responseData.error}`);
        }

        // todo check errors

        return responseData;
    }

    async storyGet() {
        const result = await this.query("story.get");

        return result.map(s => {
            const story = new StoryDE();

            story.id = s.id;
            story.title = s.title;
            story.photo = s.photo;
            story.channel = s.channel;
            story.category = s.category;
            story.text = s.description;
            story.link = s.link;
            story.datetime = s.pubDate;
            story.author = s.author;

            return story;
        });
    }

    async bookmarkGet() {
        const result = await this.query("bookmark.get");

        return result.map(b => {
            const bookmark = new StoryDE();

            bookmark.id = b.id;
            bookmark.title = b.title;
            bookmark.photo = b.photo;
            bookmark.channel = b.channel_id;
            bookmark.category = b.category;
            bookmark.text = b.description;
            bookmark.link = b.link;
            bookmark.datetime = b.pubDate;
            bookmark.author = b.author;

            return bookmark;
        });
    }

    async bookmarkCreate(story) {
        const result = await this.query("bookmark.create", {
            id: story.id,
            title: story.title,
            link: story.link,
            description: story.text,
            author: story.author,
            pubDate: story.datetime,
            category: story.category,
            channel_id: story.channel.id,
            photo: story.photo,
        });

        const bookmark = new StoryDE();

        bookmark.id = result.id;
        bookmark.title = result.title;
        bookmark.photo = result.photo;
        bookmark.channel = result.channel_id;
        bookmark.category = result.category.split(",");
        bookmark.text = result.description;
        bookmark.link = result.link;
        bookmark.datetime = result.pubDate;
        bookmark.author = result.author;

        return bookmark;
    }

    async bookmarkDelete(bookmark) {
        await this.query("bookmark.delete", {
            id: bookmark.id,
        });

        // todo check result

        return bookmark;
    }

    async channelGet() {
        const result = await this.query("channel.get");

        return result.map(c => {
            const channel = new ChannelDE();

            channel.id = c.id;
            channel.name = c.name;
            channel.photo = c.logo_url;
            channel.rssUrl = c.rss_url;
            channel.count = 0;

            return channel;
        });
    }

    async channelCreate(channel) {
        const result = await this.query("channel.create", {
            name: channel.name,
            rss_url: channel.rssUrl,
        });

        const ch = new ChannelDE();

        ch.id = result.id;
        ch.name = result.name;
        ch.photo = result.logo_url;
        ch.rssUrl = result.rss_url;
        ch.count = 0;

        return ch;
    }

    channelDelete() {
    }

    async userGet() {
        const result = await this.query("user.get");
        const user = new UserDE();

        user.id = result.id;
        user.name = result.name;
        user.photoUrl = result.photoUrl;
        user.provider = result.provider;

        return user;
    }
}