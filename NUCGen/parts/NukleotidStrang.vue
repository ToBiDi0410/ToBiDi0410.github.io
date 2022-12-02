<template>
    <div class="NukleotidStrang">
        <Nukleotid v-for="letter of letters" :key="letter" :topAligned="topAligned">{{ letter }}</Nukleotid>
    </div>
</template>

<script>
import Nukleotid from './Nukleotid.vue';

export default {
    components: { Nukleotid },
    props: ["topAligned"],
    data: () => ({ letters: null, rawText: null }),
    created() {
        try {
            this.rawText = this.$slots.default()[0].children;
            this.letters = this.rawText.split("");
        } catch (err) {
            this.slotValue = "ERR";
            console.warn("[NUCLEOTIDE-ARRAY] Failed to determine letters:", "\n", this.$slots, "\n", err);
        }
    }
}
</script>