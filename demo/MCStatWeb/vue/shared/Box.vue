<template>
    <div class="Box bg-gray-50 shadow-2xl rounded p-8 m-2 w-full">
        <div class="w-full text-2xl font-bold pb-2" v-if="title">{{ title }}</div>
        <slot></slot>
    </div>
</template>

<style scoped>
    .Box {
        border: 0.2px solid rgba(0, 0, 0, 0.082);
    }
</style>

<script>
export default {
    name: "Box",
    props: ["title"]
}
</script>