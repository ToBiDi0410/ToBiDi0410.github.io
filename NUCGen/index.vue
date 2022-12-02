<template>
    <div class="w-full h-full flex flex-col align-middle justify-center items-center lg:p-2">
            <div class="bg-base-300 rounded px-8 py-4 max-h-screen max-w-screen h-fit w-full lg:max-w-2xl relative overflow-auto" @input="inputChange">
                <div class="flex flex-col justify-center align-middle items-center">

                <div class="text-2xl font-bold">DNA/RNA Bild Generator</div>
                <div class="text-sm font-bold" @click="handleThemeChange">Hier klicken um Farbmodus zu wechseln</div>

                <div class="py-2">
                    <select class="select select-info w-full max-w-xs" v-model="type">
                        <option disabled selected value="default">Bild-Typ</option>
                        <option value="nuc">Nukleotid</option>
                        <option value="nucPair">Nukleotidenpaar</option>
                        <option value="nucS">Nukleotidenpaar-Strang</option>
                        <option value="DNA">DNA-Doppelstrang</option>
                        <option value="RNA">RNA-Doppelstrang</option>
                    </select>
                </div>

                <div class="divider">Einstellungen</div>

                <div class="py-2 text-center">
                    <div v-if="type == 'default'" class="max-w-lg">
                        Wähle einfach den Typ aus den du generieren willst, gib die benötigten Daten ein und zeige dir das entsprechende Bild <a class="text-red-600">LIVE</a> an
                    </div>

                    <div v-if="type == 'nuc'" class="w-full">
                        <select class="select select-warning w-full max-w-xs" v-model="nuc_TYPE">
                            <option value="A">Adenin</option>
                            <option value="T">Thymin</option>
                            <option value="C">Cytosin</option>
                            <option value="G">Guanin</option>
                            <option value="U">Uracil</option>
                        </select>
                        <iframe v-if="generate" :src="'./generator.html?useWebEvents&type=nuc&id=' + nuc_TYPE" allowtransparency="true" class="opacity-0 absolute top-0 left-0 pointer-events-none"></iframe>
                    </div>

                    <div v-if="type == 'nucPair'" class="w-full">
                        <select class="select select-warning w-full max-w-xs mb-2" v-model="nucPair_A">
                            <option value="A">Adenin</option>
                            <option value="T">Thymin</option>
                            <option value="C">Cytosin</option>
                            <option value="G">Guanin</option>
                            <option value="U">Uracil</option>
                        </select>

                        <select class="select select-warning w-full max-w-xs" v-model="nucPair_B">
                            <option value="A">Adenin</option>
                            <option value="T">Thymin</option>
                            <option value="C">Cytosin</option>
                            <option value="G">Guanin</option>
                            <option value="U">Uracil</option>
                        </select>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Rahmen aktivieren</span> 
                                <input type="checkbox" checked="checked" class="checkbox" v-model="general_withBorder"/>
                            </label>
                        </div>

                        <iframe v-if="generate" :src="'./generator.html?useWebEvents&type=nucPair&border=' + general_withBorder + '&A=' + nucPair_A + '&B=' + nucPair_B" allowtransparency="true" class="opacity-0 absolute top-0 left-0 pointer-events-none" height=1920 width=1080></iframe>
                    </div>

                    <div v-if="type == 'nucS'" class="w-full">
                        <input type="text" placeholder="Sequenz auf Strang A" class="input input-bordered input-secondary w-full max-w-xs" v-model="nucS_A"/>
                        <input type="text" placeholder="Sequenz auf Strang B" class="input input-bordered input-secondary w-full max-w-xs" v-model="nucS_B"/>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Rahmen aktivieren</span> 
                                <input type="checkbox" checked="checked" class="checkbox" v-model="general_withBorder"/>
                            </label>
                        </div>
                        <iframe v-if="generate" :src="'./generator.html?useWebEvents&type=nucStange&border=' + general_withBorder + '&SA=' + nucS_A + '&SB=' + nucS_B" allowtransparency="true" class="opacity-0 absolute top-0 left-0 pointer-events-none"></iframe>
                    </div>

                    <div v-if="type == 'RNA'" class="w-full">
                        <input type="text" placeholder="Sequenz auf Strang A" class="input input-bordered input-secondary w-full max-w-xs" v-model="RNA_A"/>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Rahmen aktivieren</span> 
                                <input type="checkbox" checked="checked" class="checkbox" v-model="general_withBorder"/>
                            </label>
                        </div>
                        <iframe v-if="generate" :src="'./generator.html?useWebEvents&type=rnaDS&isDNA=true&border=' + general_withBorder + '&seq=' + RNA_A" allowtransparency="true" class="opacity-0 absolute top-0 left-0 pointer-events-none"></iframe>
                    </div>

                    <div v-if="type == 'DNA'" class="w-full">
                        <input type="text" placeholder="Sequenz auf Strang A" class="input input-bordered input-secondary w-full max-w-xs" v-model="DNA_A"/>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Rahmen aktivieren</span> 
                                <input type="checkbox" checked="checked" class="checkbox" v-model="general_withBorder"/>
                            </label>
                        </div>
                        <iframe v-if="generate" :src="'./generator.html?useWebEvents&type=dnaDS&isRNA=true&border=' + general_withBorder + '&seq=' + DNA_A" allowtransparency="true" class="opacity-0 absolute top-0 left-0 pointer-events-none"></iframe>
                    </div>
                </div>

                <div class="py-2" v-if="!generate && wasChanged">
                    <button class="btn btn-primary" @click="handleGenerate">Generieren</button>
                </div>

                <div class="divider">Vorschau</div>

                <div class="py-2 h-1/2 overflow-hidden" v-if="previewSrc">
                    <img :src="previewSrc" class="p-2 max-w-full max-h-64 h-full w-auto object-contain">
                </div>

                <div class="py-2 text-center" v-if="previewSrc">
                    <div class="btn btn-info w-full max-w-xs" @click="handleDownload">Download</div>
                </div>

                <div class="py-2" v-if="generate && loading">
                    <button class="btn bg-base-100 loading text-base-content">loading</button>
                </div>

                <div class="py-2" v-if="generate && !loading">
                    <button class="btn bg-base-100 loading text-base-content">loading (HTML)</button>
                </div>

                <div class="py-2" v-if="error">
                    <div class="text-red-500">Beim Generieren des Bildes ist ein Fehler aufgetreten:</div>
                    <div class="text-sm">{{ error }}</div>
                </div>

                <div class="divider">Sonstiges</div>
                <div class="text-xs font-semibold">Bilder von: <a class="link link-secondary" href="https://www.softr.io/tools/svg-shape-generator">https://www.softr.io/tools/svg-shape-generator</a></div>

                </div>

            </div>
        </div>
</template>

<script>
export default {
    data: () => ({ type: "default", previewSrc: null, nuc_TYPE: "A", nucPair_A: "A", nucPair_B: "T", nucS_A: "ATTA", nucS_B: "TAAT", RNA_A: "CGAU", DNA_A: "ACGT", error: null, general_withBorder: true, loading: false, generate: false, wasChanged: false }),
    created() {
        window.document.addEventListener('imageGenerated', this.handlePreview, false);
        window.document.addEventListener('imageLoading', this.handlePreviewLoad, false);
        window.document.addEventListener('imageError', this.handlePreviewError, false);
    },
    methods: {
        handlePreview(e) {
            console.debug("[IMAGE] Recieved generated image");
            this.previewSrc = e.detail;
            this.loading = false;
            this.error = null;
            this.generate = false;
            this.wasChanged = false;
        },

        handlePreviewError(e) {
            console.error("[IMAGE] Failed to generate: " + e.detail);
            this.previewSrc = null;
            this.loading = false;
            this.error = e.detail;
            this.generate = false;
        },

        handlePreviewLoad(e) {
            console.log("[IMAGE] Image is generating...");
            this.previewSrc = null;
            this.loading = true;
            this.error = null;
        },

        handleDownload() {
            const link = document.createElement("a");
            link.href = this.previewSrc;
            link.download = "image.png";
            link.click();
        },

        handleGenerate() {
            this.previewSrc = null;
            this.generate = true;
        },

        inputChange() {
            console.debug("[MAIN] Meta updated");
            this.wasChanged = true;
        },

        handleThemeChange() {
            const current = document.querySelector("html").getAttribute("data-theme");
            if(current == "dark") document.querySelector("html").setAttribute("data-theme", "halloween");
            else if(current == "halloween") document.querySelector("html").setAttribute("data-theme", "light");
            else document.querySelector("html").setAttribute("data-theme", "dark");
        }
    }
}
</script>