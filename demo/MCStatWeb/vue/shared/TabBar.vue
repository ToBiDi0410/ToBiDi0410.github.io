<template>
     <div class="tabbar flex flex-row justify-around px-2 py-1 bg-slate-500 font-bold text-black text-center">
            <div class="flex-grow basis-0" v-for="tab in tabs" :key="tab" :class="ctab == tab ? 'border-b-4 border-sky-500' : ''" @click="this.$emit('update:ctab', tab);">{{tab}}</div>
        </div>
</template>

<script>
export default {
    name: "TabBar",
    props: ["ctab", "tabs"],
    mounted() {
        this.$emit("update:ctab", this.tabs[1]);
    }
}
</script>