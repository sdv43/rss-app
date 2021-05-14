<template>
    <Page class="cmp-sign-in">
        <img alt="RSS App" class="app-icon" src="/icon-308.png"/>
        <div class="welcome">
            Welcome to RSS App!
        </div>
        <div>
            Sign In with:
        </div>
        <div class="socials">
            <a class="social" href="/auth.php?social=Google">
                <img class="icon" src="@/assets/images/icons/google_32px.png">
                <span>Google</span>
            </a>
            <a class="social" href="/auth.php?social=GitHub">
                <img class="icon" src="@/assets/images/icons/github_32px.png">
                <span>GitHub</span>
            </a>
<!--            <a class="social" href="/auth.php?social=Vkontakte">-->
<!--                <img class="icon" src="@/assets/images/icons/vk_32px.png">-->
<!--                <span>VK</span>-->
<!--            </a>-->
        </div>
        <div class="text">
            If you do not have an account, it will be created during the first authorization.
        </div>
    </Page>
</template>

<script>
import Page from "@/components/containers/Page";

export default {
    name: "SignIn",
    components: {Page},
};
</script>

<style lang="scss" scoped>
.cmp-sign-in {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding: 2rem;

    .app-icon {
        margin: 2rem auto 0;
        height: auto;
        width: 8rem;
    }

    .welcome {
        @extend .h3;
        margin: 2rem 0 4rem;
        text-align: center;
    }

    .text {
        margin: auto 0 0;
        font-size: 0.9em;
        text-align: center;
        color: $color-second;
    }

    .socials {
        width: 100%;

        .social {
            box-sizing: border-box;

            display: flex;
            justify-content: center;
            align-items: center;

            margin: .6rem 0;
            border: 1px solid $input-background-color-default;
            border-radius: .5em;
            padding: .9em 1.2em;
            width: 100%;

            font-size: 1rem;
            line-height: 1;

            background-color: white;
            color: $color;

            .icon {
                height: auto;
                width: 16px;
                margin-right: .6em;
            }
        }
    }
}
</style>