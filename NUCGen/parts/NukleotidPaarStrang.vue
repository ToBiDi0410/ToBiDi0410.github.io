<template>
    <div class="NukleotidPaarStrang flex flex-row flex-wrape overflow-hidden w-fit">
        <NukleotidPaar v-for="pair of pairs" :key="pair" :A="pair[0]" :B="pair[1]" :withBorder="withBorder"></NukleotidPaar>
    </div>
</template>

<script>
import NukleotidPaar from './NukleotidPaar.vue';

export default {
    components: { NukleotidPaar },
    props: ["A", "B", "withBorder"],
    data: () => ({ pairs: null }),
    created() {
        try {
            const pairCache = [];
            const AParts = this.A.split("");
            const BParts = this.B.split("");

            for(let i=0; i< Math.max(AParts.length, BParts.length); i++) {
                pairCache.push([AParts[i] || 'E', BParts[i] || 'E']);
            }

            this.pairs = pairCache;
            //console.debug("[NUKLEOTID-PAIR-RAY] Determined pairs:", "\n", this.pairs.map(a => a[0]).join(""), "\n", this.pairs.map(a => a[1]).join(""), "\n", this.pairs);
            console.debug("[NUKLEOTID-PAIR-RAY] Determined pairs:", this.pairs.map(a => a[0] + a[1]).join("|"));
        } catch (err) {
            this.nucleotide = "ERR";
            console.warn("[NUKLEOTID-PAIR-RAY] Failed to determine pairs:", "\n", this.$slots, "\n", err);
        }
    }
}
</script>