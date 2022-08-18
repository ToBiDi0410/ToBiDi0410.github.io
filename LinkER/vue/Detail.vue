<template>
    <div class="detail flex flex-row text-base">
        <div class="icon pr-2"><span class="material-symbols-outlined text-base">{{ icon }}</span></div>
        <div class="text" :class="noColor ? '' : 'multiblue italic'"><slot></slot></div>
    </div>
</template>

<script>
export default {
    props: ["icon", "noColor"]
}
</script>