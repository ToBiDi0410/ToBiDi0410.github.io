<template>
    <div>
        <div class="text-sky-700 hover:underline hover:text-sky-500" @click="shown = !shown;">{{ !shown ? '+ ' + data.getTrans('SHOW_MORE') : '- ' + data.getTrans('SHOW_LESS') }}</div>
        <div v-if="shown">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data: () => ({ shown: false })
}
</script>