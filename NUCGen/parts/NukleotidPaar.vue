<template>
    <div class="NukleotidPaar flex flex-col my-2 w-fit" :class="{ 'border-b-4 border-b-cyan-600 border-t-4 border-t-cyan-600' : withBorder == 'true' || withBorder == true }">
        <Nukleotid>{{ A }}</Nukleotid>
        <Nukleotid>{{ B }}</Nukleotid>
    </div>
</template>

<script>
import Nukleotid from './Nukleotid.vue';

export default {
    components: { Nukleotid },
    props: ["A", "B", "withBorder"]
}
</script>