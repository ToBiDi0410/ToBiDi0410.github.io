<template>
    <div class="DNADoppelstrang w-fit">
        <NukleotidPaarStrang :A="ray1" :B="ray2" v-if="ray1 && ray2" :withBorder="withBorder"></NukleotidPaarStrang>
    </div>
</template>

<script>
import NukleotidPaarStrang from './NukleotidPaarStrang.vue';

export default {
    props: ["fromRNA", "withBorder"],
    components: { NukleotidPaarStrang },
    data: () => ({ ray1: null, ray2: null }),
    created() {
        try {
            this.ray1 = this.$slots.default()[0].children;
            this.ray1 = this.ray1.replaceAll("U", this.fromRNA ? "T" : "E");
            this.ray2 = this.generateComplementaryString(this.ray1);

            console.debug("[DNA] Determined rays:", "\n", this.ray1, "\n", this.ray2);
        } catch (err) {
            this.slotValue = "ERR";
            console.warn("[DNA] Failed to determine rays:", "\n", this.$slots, "\n", err);
        }
    },
    methods: {
        generateComplementaryString(str) {
            let newStr = "";
            for(const letter of str.split("")) {
                if(letter == "A") newStr += "T"
                else if(letter == "T") newStr += "A"
                else if(letter == "C") newStr += "G"
                else if(letter == "G") newStr += "C"
                else newStr += "E";
            }
            return newStr;
        }
    }
}
</script>