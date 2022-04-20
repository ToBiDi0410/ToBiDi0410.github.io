import { YEARS } from "./database/v1/years.js";
import { WEEKS } from "./database/v1/weeks.js";

function lookup() {
    document.querySelector(".result").classList.add("hidden");
    document.querySelector(".error").classList.add("hidden");
    var text = document.querySelector(".in").value;

    try {
        var res = getResultFromDB(text);
        console.log(res);

        for (const [key, value] of Object.entries(res)) {
            var elem = document.querySelector(".data-" + key);
            if (elem) elem.innerText = value;
        }
        document.querySelector(".result").classList.remove("hidden");
    } catch (err) {
        console.log(err);
        document.querySelector(".error").classList.remove("hidden");
        document.querySelector(".errorInfo").innerText = err.toString();
    }
}

function getResultFromDB(serial) {
    console.log("Looking up: " + serial);

    if (serial.length != 12) throw new Error("INVALID-LENGTH")

    const manufactureChars = getCharactersByRange(1, 3, serial);
    const manufactureRes = manufactureChars;
    if (!manufactureRes) throw new Error("MANUFACTURE-LOCATION-FAIL");

    const yearChar = getCharacterByNumber(4, serial);
    const yearRes = YEARS[yearChar];
    if (!yearRes) throw new Error("MANUFACTURE-YEAR-FAIL");

    const weekChar = getCharacterByNumber(5, serial);
    const weekRes = WEEKS[weekChar];
    if (!weekRes) throw new Error("MANUFACTURE-WEEK-FAIL");

    const weekCalculatedRes = (yearRes.half - 1) * 26 + weekRes;

    const yearOne = yearRes.year.split("/")[0];
    const dateOne = new Date("01/01/" + yearOne);
    dateOne.setHours(weekCalculatedRes * 7 * 24);

    let finalDate = dateOne.toLocaleDateString();

    if (yearRes.year.split("/").length > 1) {
        const yearTwo = yearRes.year.split("/")[1];
        const dateTwo = new Date("01/01/" + yearTwo);
        dateOne.setHours(weekCalculatedRes * 7 * 24);
        finalDate += " or " + dateTwo.toLocaleDateString();
    }

    return {
        serial: serial,
        manloc: manufactureRes,
        manyear: yearOne,
        manweek: weekCalculatedRes,
        mandate: finalDate
    };
}

function getCharacterByNumber(number, str) {
    return str[number - 1];
}

function getCharactersByRange(start, end, str) {
    return str.substring(start - 1, end);
}

document.querySelector(".button").onclick = lookup;