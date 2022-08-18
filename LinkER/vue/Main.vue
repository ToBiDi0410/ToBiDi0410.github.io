<template>
    <div class="w-screen h-fit min-h-screen flex flex-row justify-center align-middle items-center bg-black md:p-4 xl:text-xs">
        <div class="bg-white/5 text-white px-4 py-8 text-base w-screen h-fit md:max-w-full lg:w-auto md:h-auto md:rounded-lg" style="font: dotted;">
            <div class="flex flex-col justify-center items-center align-middle w-full h-fit" v-if="configLoaded === true && config != undefined">
                <div class="title text-4xl p-2 font-gothic">
                    {{ config.name }}
                </div>
                <Detail icon="verified" style="color: rgb(132 204 22 / 1) !important;" :noColor="true" v-if="config.verified">Verified</Detail>
                <Detail icon="fast_rewind" style="color: rgb(235 45 229) !important;" :noColor="true" v-if="config.earlyUser">Early User</Detail>

                <div class="image w-fit h-fit p-2">
                    <img class="h-32 w-32 border-none bg-white rounded-full" :src="config.pic">
                </div>

                <div class="p-2 details text-left w-full">
                    <Detail icon="location_on" v-if="config.additions.living">{{ config.additions.living }}</Detail>
                    <Detail icon="cake" v-if="config.additions.born">{{ new Date(config.additions.born).toLocaleDateString() }} ({{ window.getAge(new Date(config.additions.born)) }} y/o)</Detail>
                    <Detail icon="sports_football" v-if="config.additions.hobbies">{{ config.additions.hobbies.join(", ") }}</Detail>
                    <Detail icon="school" v-if="config.additions.study">{{ config.additions.study }}</Detail>
                </div>

                <div class="description p-2" style="max-width: 600px;" v-if="config.desc">
                    {{ config.desc }}
                </div>

                <div class="p-2"  v-if="config.links">
                    Visit me here:
                </div>

                <div class="flex-grow w-full" style="min-width: 300px;" v-if="config.links">
                    <Account v-for="link in config.links" :key="link.name" :plattform="link.pt" :name="link.nm" :values="link.vl"></Account>
                </div>

                <div class="p-1 text-xs font-semibold invisible lg:visible text-center">
                    Press STRG while clicking to open the link in a new Tab
                </div>
                
                <div class="p-1 text-xs font-semibold text-gray-500 text-center">
                    Created with ❤️ by Tobias
                </div>
            </div>

            <div v-if="configLoaded !== undefined && configLoaded !== true">
                <div class="font-bold text-red-600">Oh no!</div>
                <div>Please check the URL is spelled correctly</div>
            </div>

            <div v-if="configLoaded === undefined">
                <div class="font-bold text-sky-600 animate-spin">X</div>
            </div>
        </div>
    </div>
</template>

<script>
import Account from './Account.vue';
import Detail from './Detail.vue';

export default {
    data: () => ({ config: null, configLoaded: undefined }),
    components: { Account, Detail },
    mounted() {
        let params = new URLSearchParams(window.location.search);
        if(params.has("configBlob")) {
            console.log("[CFG] Config blob found");
            try {
                const jsonString = atob(params.get("configBlob"));
                const config = JSON.parse(jsonString);
                this.config = config;
                this.configLoaded = true;
                console.log("[CFG] Config loaded:", this.config.v || "UNKNOWN VERSION");
            } catch (err) {
                console.error(err);
                this.configLoaded = err;
            }
        } else {
            this.configLoaded = "NO_BLOB";
        }
    }
}
</script>