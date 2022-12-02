<template>
    <div class="w-full h-full">
        <Nukleotid class="rendered" v-if="command == 'nuc' && values">{{ values.id }}</Nukleotid>
        <NukleotidPaar class="rendered" v-if="command == 'nucPair' && values" :A="values.A" :B="values.B" :withBorder="values.border"></NukleotidPaar>
        <NukleotidPaarStrang class="rendered" v-if="command == 'nucStange' && values" :A="values.SA" :B="values.SB" :withBorder="values.border"></NukleotidPaarStrang>
        <RNADoppelstrang class="rendered" v-if="command == 'rnaDS' && values" :fromDNA="values.isDNA" :withBorder="values.border">{{ values.seq }}</RNADoppelstrang>
        <DNADoppelstrang class="rendered" v-if="command == 'dnaDS' && values" :fromRNA="values.isRNA" :withBorder="values.border">{{ values.seq }}</DNADoppelstrang>
        <div v-if="!error" class="px-6 py-3 bg-slate-400 hover:bg-slate-300 rounded-full w-fit" @click="downloadContent">Download</div>

        <div v-if="error">
            <div class="text-red-500 text-xl font-bold">Something is wrong with this URL!</div>
            <div class="hover:opacity-100 opacity-0">({{ error }})</div>
        </div>
    </div>
</template>

<script>
import Nukleotid from './parts/Nukleotid.vue';
import DNADoppelstrang from './parts/DNADoppelstrang.vue';
import RNADoppelstrang from './parts/RNADoppelstrang.vue';
import NukleotidPaar from './parts/NukleotidPaar.vue';
import NukleotidPaarStrang from './parts/NukleotidPaarStrang.vue';

export default {
    data: () => ({ scommand: null, values: null, error: null, webEvents: false }),
    components: { DNADoppelstrang, RNADoppelstrang, NukleotidPaar, NukleotidPaarStrang, Nukleotid },
    created() {
        const urlParams = new URLSearchParams(this.window.location.search);
        this.webEvents = urlParams.has("useWebEvents");

        if(!urlParams.has("type")) return this.error = "NO_TYPE";
        this.command = urlParams.get("type");

        //Command validation
        let commandRequiresParameters = null;
        if(this.command == "nuc") commandRequiresParameters = ["id"];
        if(this.command == "nucPair") commandRequiresParameters = ["A", "B", "border"];
        if(this.command == "nucStange") commandRequiresParameters = ["SA", "SB", "border"];
        if(this.command == "rnaDS") commandRequiresParameters = ["isDNA", "seq", "border"];
        if(this.command == "dnaDS") commandRequiresParameters = ["isRNA", "seq", "border"];
        if(commandRequiresParameters == null) return this.error = "Invalid type/command";

        //Parameter validation
        const missingParameters = commandRequiresParameters.filter(a => !urlParams.has(a));
        if(missingParameters.length > 0 ) return this.error = "Missing Parameters: " + missingParameters.join(",");

        this.values = {};
        for(const parameter of commandRequiresParameters) {
            this.values[parameter] = urlParams.get(parameter);
        }

        //Other
        if(this.webEvents) setTimeout(this.generateWebEvent, 1);
    },
    mounted() {
        if(this.error && this.webEvents) {
            var event = new CustomEvent('imageError', { detail: this.error });
            window.parent.document.dispatchEvent(event);
        }
    },
    methods: {
         async downloadContent() {
            const a = document.createElement('a');
            a.setAttribute('download', 'my-image.png');
            a.setAttribute('href', await this.getImageURL());
            a.click();
            canvas.remove();
        },

        async getImageURL() {
            const toCapture = document.querySelector(".rendered");
            const canvas = await html2canvas(toCapture, { letterRendering: 1, allowTaint : true, logging: true, useCORS: true, backgroundColor:null });
            canvas.style.display = 'block';
            document.body.appendChild(canvas);
            
            const imageURL = canvas.toDataURL("image/png");
            return imageURL;
        },

        async generateWebEvent() {
            const url = await this.getImageURL();
            var event = new CustomEvent('imageGenerated', { detail: url });
            window.parent.document.dispatchEvent(event);
        }
    }
}
</script>