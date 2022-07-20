<script>
class DBReader {
    db;
    maxage = 60 * 60 * 24 * 365 * 100;
    world = "world";

    constructor(db) {
        this.db = db;
    }

    async getBuildData() {
        const entries = this.getResultArray("SELECT * FROM build WHERE TIME > " + (Date.now() - this.maxage * 1000));
        const WORLDS = {};

        for (const entry of entries) {
            let count = entry[1];
            const material = entry[2];
            const type = entry[3];
            const world = entry[4];
            if (!WORLDS[world]) WORLDS[world] = {};
            if(!WORLDS[world][material]) WORLDS[world][material] = {};

            if (WORLDS[world][material][type]) count += WORLDS[world][material][type];
            WORLDS[world][material][type] = count;
        }

        return WORLDS;
    }

    async getWorldBuildData() {
        return (await this.getBuildData())[this.world];
    }

    async getTravelData() {
        const entries = this.getResultArray("SELECT * FROM travel WHERE TIME > " + (Date.now() - this.maxage * 1000));
        const WORLDS = {};

        for (const entry of entries) {
            let distance = entry[1];
            const type = entry[2];
            const world = entry[3];
            if (!WORLDS[world]) WORLDS[world] = {};
            if (WORLDS[world][type]) distance += WORLDS[world][type];
            WORLDS[world][type] = distance;
        }
        
        return WORLDS;
    }

    async getWorldTravelData() {
        return (await this.getTravelData())[this.world];
    }

    async getEntityDamageGivenData() {
        const entries = this.getResultArray("SELECT * FROM entityDamage WHERE TIME > " + (Date.now() - this.maxage * 1000));
        const WORLDS = {};

        for (const entry of entries) {
            let damage = entry[1];
            const entity = entry[2];
            const world = entry[3];
            if (!WORLDS[world]) WORLDS[world] = {};
            if (!WORLDS[world][entity]) WORLDS[world][entity] = 0;
            WORLDS[world][entity] += damage;
        }

        return WORLDS;    
    }

    async getWorldEntityDamageGivenData() {
        return (await this.getEntityDamageGivenData())[this.world];
    }

    async getEntityDamageRecievedData() {
        const entries = this.getResultArray("SELECT * FROM entityDamageTaken WHERE TIME > " + (Date.now() - this.maxage * 1000));
        const WORLDS = {};

        for (const entry of entries) {
            let damage = entry[1];
            const entity = entry[2];
            const world = entry[3];
            if (!WORLDS[world]) WORLDS[world] = {};
            if (!WORLDS[world][entity]) WORLDS[world][entity] = 0;
            WORLDS[world][entity] += damage;
        }
        return WORLDS;    
    }

    async getWorldEntityDamageRecievedData() {
        return (await this.getEntityDamageRecievedData())[this.world];
    }

    async getEntityKills() {
        const entries = this.getResultArray("SELECT * FROM entityKills WHERE TIME > " + (Date.now() - this.maxage * 1000));
        const WORLDS = {};

        for (const entry of entries) {
            let count = entry[1];
            const entity = entry[2];
            const world = entry[3];
            if (!WORLDS[world]) WORLDS[world] = {};
            if (!WORLDS[world][entity]) WORLDS[world][entity] = 0;
            WORLDS[world][entity] += count;
        }
        return WORLDS;    
    }

    async getWorldEntityKills() {
        return (await this.getEntityKills())[this.world];
    }

    toggleWorld() {
        if(this.world == "world") this.world = "world_nether";
        else if(this.world == "world_nether") this.world = "world_end";
        else if(this.world == "world_end") this.world = "world";
        else this.world = "world";
    }

    getResultArray(sql) {
        const array = new Array();
        const stmt = this.db.prepare(sql);
        while (stmt.step()) {
            array.push(stmt.get());
        }
        stmt.free();
        return array;
    }
}

export default {
    DBReader
}
</script>