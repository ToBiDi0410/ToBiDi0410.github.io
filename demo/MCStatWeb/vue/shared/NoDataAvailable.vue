<template>
    <div class="NoDataAvailable w-full rounded bg-red-600/70 p-2 text-sm font-bold">
        {{ data.getTrans("NO_DATA_AVAILABLE") }}
    </div>
</template>

<script>
export default {
    props: ["data"]
}
</script>