<template>
    <Box :title="data.getTrans('PLAYER')" class="text-center">
        <img class="left-0 right-0 mx-auto" :src="'https://crafatar.com/renders/body/' + data.player">
        <div>{{ data.getTrans("NAME") }}:</div>
        <EmbedText>Tobias_Dickes</EmbedText>
        <div>{{ data.getTrans("UUID") }}:</div>
        <EmbedText>{{ data.player }}</EmbedText>
    </Box>
</template>

<script>
import Box from '../shared/Box.vue';
import EmbedText from '../shared/EmbedText.vue';

export default {
    props: ["data"],
    components: { Box, EmbedText }
}
</script>