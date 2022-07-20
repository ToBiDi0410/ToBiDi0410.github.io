<script>
let map;
let failed = false;

export default {
    async load() {
        try {
            const res = await fetch("/translations.json");
            const jsonRes = await res.json();
            map = jsonRes;

            for(const [key, value] of Object.entries(map)) {
                let following = value.slice(value.indexOf("${"), value.length);
                let between = following.slice(2, following.indexOf("}"));
                if(between) {
                    console.log("[TRANS] Replaced '" + between + "' in '" + key + "'");
                    map[key] = value.replace("${" + between + "}", this.get(between));
                }
            }

            console.log("[TRANS] Loaded Translations", map);
        } catch (err) {
            console.warn("[TRANS] Cannot load Translations", err);
            window.alert("[TRANS] Failed to load translations:\n" + err.toString());
            failed = true;
        }

    },
    get(ident) {
        if(failed) return ident + " (RAW)";
        if(!map) return "###";
        const val = map[ident];
        if(val != undefined) return val;
        return ident + " (UNK)";
    }
}
</script>