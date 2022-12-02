<template>
    <div class="Nukleotid relative w-64 p-1 overflow-hidden inline-block" :class="{ 'align-top' : topAligned }">
        <img :src="imgURL('cytosin.png')" class="w-full max-h-full" v-if="this.nucleotide == 'CYTOSIN'">
        <img :src="imgURL('guanin.png')" class="w-full max-h-full" v-if="this.nucleotide == 'GUANIN'">
        <img :src="imgURL('adenin.png')" class="w-full max-h-full" v-if="this.nucleotide == 'ADENIN'">
        <img :src="imgURL('thymin.png')" class="w-full" stlye="height: 5rem" v-if="this.nucleotide == 'THYMIN'">
        <img :src="imgURL('uracil.png')" class="w-full" stlye="height: 5rem" v-if="this.nucleotide == 'URACIL'">
        <div v-if="this.nucleotide == 'ERR'" class="break-all w-full h-full">
            <a>INV: {{ slotValue }}</a>
            <img :src="imgURL('uracil.png')" class="w-full opacity-0">
        </div>

        <div class="absolute left-0 top-0 right-0 bottom-0 m-auto w-fit h-fit text-stone-100 text-4xl">{{ slotValue }}</div>
    </div>
</template>

<script>
export default {
    props: ["topAligned"],
    data: () => ({ slotValue: null, nucleotide: null }),
    created() {
        try {
            this.slotValue = this.$slots.default()[0].children;
            if(this.slotValue == "C") this.nucleotide = "CYTOSIN";
            else if(this.slotValue == "G") this.nucleotide = "GUANIN";
            else if(this.slotValue == "A") this.nucleotide = "ADENIN";
            else if(this.slotValue == "T") this.nucleotide = "THYMIN";
            else if(this.slotValue == "U") this.nucleotide = "URACIL";
            else this.nucleotide = "ERR";

        } catch (err) {
            this.nucleotide = "ERR";
            console.warn("[NUCLEOTIDE] Failed to determine type:", "\n", this.$slots, "\n", err);
        }
    },
    methods: {
        imgURL(name) {
            const newURL = new URL('./nukleotidImages/' + name, this.document.location);
            return newURL.href;
        }
    }
}
</script>