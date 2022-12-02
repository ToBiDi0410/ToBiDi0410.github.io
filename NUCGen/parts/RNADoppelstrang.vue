<template>
    <div class="RNADoppelstrang w-fit">
        <NukleotidPaarStrang :A="ray1" :B="ray2" v-if="ray1 && ray2" :withBorder="withBorder"></NukleotidPaarStrang>
    </div>
</template>

<script>
import NukleotidPaarStrang from './NukleotidPaarStrang.vue';

export default {
    props: ["fromDNA", "withBorder"],
    components: { NukleotidPaarStrang },
    data: () => ({ ray1: null, ray2: null }),
    created() {
        try {
            this.ray1 = this.$slots.default()[0].children;
            this.ray1 = this.ray1.replaceAll("T", this.fromDNA ? "U" : "E");
            this.ray2 = this.generateComplementaryString(this.ray1);

            console.debug("[RNA] Determined rays:", "\n", this.ray1, "\n", this.ray2);
        } catch (err) {
            this.slotValue = "ERR";
            console.warn("[RNA] Failed to determine rays:", "\n", this.$slots, "\n", err);
        }
    },
    methods: {
        generateComplementaryString(str) {
            let newStr = "";
            for(const letter of str.split("")) {
                if(letter == "A") newStr += "U"
                else if(letter == "U") newStr += "A"
                else if(letter == "C") newStr += "G"
                else if(letter == "G") newStr += "C"
                else newStr += "E";
            }
            return newStr;
        }
    }
}
</script>