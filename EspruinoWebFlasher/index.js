const availableVersions = ["2v17", "2v16", "2v15", "2v14", "2v13", "2v12", "2v11", "2v10", "2v09", "2v08", "2v07", "2v06", "2v05"];

const manifestTemplate = {
    "name": "Espruino",
    "version": "%V%",
    "funding_url": "https://esphome.io/guides/supporters.html",
    "new_install_prompt_erase": true,
    "builds": [{
            "chipFamily": "ESP32",
            "parts": [
                { "path": "https://www.espruino.com/binaries/espruino_%V%_esp32.bin", "offset": 0 }
            ]
        },
        {
            "chipFamily": "ESP8266",
            "parts": [
                { "path": "https://www.espruino.com/binaries/espruino_%V%_esp8266_%SUBV%.bin", "offset": 0 }
            ]
        }
    ]
};

var keyHistory = [];
(function() {
    for (const version of availableVersions) {
        document.querySelector("#versions").innerHTML += '<option value="' + version + '">' + version + '</option>';
    }

    document.querySelector("#versions").addEventListener("change", (event) => syncManifest());
    document.querySelector("#esp8266_4m").addEventListener("click", (event) => syncManifest());
    syncManifest();

    document.addEventListener("keydown", (event) => {
        keyHistory.push(event.key);
        if (keyHistory.join("").includes("logo")) {
            document.querySelector("#logo").classList.toggle("hidden");
            keyHistory = [];
        }
    })
})();

function syncManifest() {
    var value = document.querySelector("#versions").value;
    var replacedVersion = JSON.stringify(manifestTemplate);
    replacedVersion = replacedVersion.replaceAll("%V%", value);
    replacedVersion = replacedVersion.replace("%SUBV%", document.querySelector("#esp8266_4m").checked ? '4mb_combined_4096' : 'combined_512');
    document.querySelector("#esp-button").setAttribute("manifest", stringToDataURL(replacedVersion));
}

function stringToDataURL(text) {
    return "data:text/plain;base64," + btoa(text);
}
