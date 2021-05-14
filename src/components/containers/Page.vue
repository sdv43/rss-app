<template>
    <div class="cmp-page">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "Page",
};
</script>

<style lang="scss" scoped>
.cmp-page {
    box-sizing: border-box;
    min-height: 100%;
}
</style>