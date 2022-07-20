<template>
    <div class="app main h-screen w-screen overflow-auto bg-white text-black text-base flex flex-col justify-between">
        <div class="header bg-gray-50 shadow-lg text-black">
            <div class="text-2xl text-center px-2 py-5">{{ getTrans("STATS") }} on <b>{{ serverName }}</b></div>
        </div>

        <div class="font-bold text-right" v-if="DBR">
            <a @click="DBR.toggleWorld(); reload()">{{ getTrans("WORLD") }}: {{ DBR.world }} (*click*)</a>
            &nbsp;
            <a>{{ getTrans("TIME") }}: {{ (DBR.maxage || 0) / 60 }} {{ getTrans("MINUTES_SHORT") }}</a>
        </div>

        <div v-if="!transloaded">
            Loading Translations...
        </div>

        <div v-if="!DBR || !noreload">
            Loading Data...
        </div>

        <div class="pagecontent flex-grow overflow-y-auto overflow-x-hidden flex flex-col align-middle items-center p-8 whitespace-pre-wrap" v-if="DBR && noreload">
            <PLAYERSEC :data="this"></PLAYERSEC>
            <BLOCKINTSEC :data="this"></BLOCKINTSEC>
            <MOVEMENTSEC :data="this"></MOVEMENTSEC>
    	    <ENTITYDAMAGEDEALTSEC :data="this"></ENTITYDAMAGEDEALTSEC>
            <ENTITYDAMAGETAKENSEC :data="this"></ENTITYDAMAGETAKENSEC>
        </div>

        <div class="tabbar bg-gray-200 border-t-2 text-center text-sm p-2 text-black">
            <div class="font-bold">@MCStat 2022</div>
            <div class="text-xs text-gray-500">
                <a>{{ getTrans("LEARN_MORE_AT") }}:&nbsp;</a>
                <a class="font-bold" href="https://www.mcstat.de">mcstat.de (NOT WORKING)</a>
            </div> 
        </div>
    </div>
</template>

<style>
    * {
        box-sizing: border-box;
    }
</style>

<script>
import DBReader from './shared/DBReader.vue';
import Translations from './shared/Translations.vue';
import Box from './shared/Box.vue';
import EmbedText from './shared/EmbedText.vue';

import PLAYERSEC from './sections/player.vue';
import BLOCKINTSEC from './sections/blockInteractions.vue';
import MOVEMENTSEC from './sections/movement.vue';
import ENTITYDAMAGEDEALTSEC from './sections/entityDamageDealt.vue';
import ENTITYDAMAGETAKENSEC from './sections/entityDamageTaken.vue';

export default {
    name: "App",
    components: { Box, EmbedText, PLAYERSEC, BLOCKINTSEC, MOVEMENTSEC, ENTITYDAMAGEDEALTSEC, ENTITYDAMAGETAKENSEC },
    data: () => ({ transloaded: false, TAB: "TRAVELING", SQL: null, DBR: null, getTrans: Translations.get, player: "7bdb8815-02f7-4817-8fae-2b9225b7a598", serverName: "Testserver", noreload: true }),
    async created() {
        await Translations.load();
        this.transloaded = true;
        this.SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/${file}` });
        const dbFetch = await fetch("./test.db");
        const dbBuffer = await dbFetch.arrayBuffer();
        const dbUint = new Uint8Array(dbBuffer);
        this.DB = new this.SQL.Database(dbUint);
        this.DBR = new DBReader.DBReader(this.DB);
    },
    methods: {
        reload() {
            console.log("RELOADING...");
            this.noreload = false;
            setTimeout(() => { 
                this.noreload = true;
                console.log("RELOADED!");
            }, 100);
        }
    }
}
</script>