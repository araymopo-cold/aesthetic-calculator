/* ==========================================
   COSMIC CALCULATOR
========================================== */


/* ==========================================
   SPECIAL EQUATIONS

   10 + 8 = 18
   → Sino — IV of Spades

   2 + 2 = 4
   → Pag-Ibig — Ace Banzuelo
========================================== */

const songs = {

    "18": {
        title: "Sino",
        artist: "IV of Spades",
        audio: "music/sino.mp3",

        lyrics: [
            "Your authorized lyrics go here.",
            "",
            "Replace this text with lyrics",
            "you have permission to use."
        ]
    },


    "4": {
        title: "Pag-Ibig",
        artist: "Ace Banzuelo",
        audio: "music/pag-ibig.mp3",

        lyrics: [
            "Pero ’di ba sabi mo kung meron man nagpaparamdam",
            "Nilalayo ang sarili, ayaw matulad sa dati",

            "[Pre-Chorus]",

            "'Di ko alam ang dapat sabihin",
            "'Di ko alam ang dapat aminin",
            "’Di ko alam kung kailan, paano (Paano?)",
            "Nalimutang pag-ibig, meron bang pipili sa'kin?",

            "[Chorus]",

            "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
            "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
            "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
            "(Ha-ah) Meron ba? Meron ba? Oh-oh"
        ]
    }

};


/* ==========================================
   GET ELEMENTS
========================================== */

const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

const buttons = document.querySelectorAll(".buttons button");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const lyrics = document.getElementById("lyrics");
const audioPlayer = document.getElementById("audioPlayer");
const musicCard = document.getElementById("musicCard");

const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");


/* ==========================================
   CALCULATOR VARIABLES
========================================== */

let currentNumber = "";
let previousNumber = "";
let operation = null;
let justCalculated = false;


/* ==========================================
   BUTTON EVENTS
========================================== */

buttons.forEach(button => {

    button.addEventListener("click", function () {

        const value = this.dataset.value;
        const action = this.dataset.action;


        /* NUMBER / DECIMAL */

        if (value !== undefined) {

            if (
                !isNaN(value) ||
                value === "."
            ) {

                addNumber(value);

            }

            else if (
                ["+", "-", "*", "/", "%"].includes(value)
            ) {

                chooseOperation(value);

            }

        }


        /* ACTIONS */

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteNumber();
        }

        if (action === "equals") {
            calculate();
        }

    });

});


/* ==========================================
   ADD NUMBER
========================================== */

function addNumber(number) {

    /* Start new calculation after result */

    if (justCalculated) {

        currentNumber = "";
        previousNumber = "";
        operation = null;

        justCalculated = false;

    }


    /* Prevent multiple decimal points */

    if (
        number === "." &&
        currentNumber.includes(".")
    ) {

        return;

    }


    /* Prevent 0005 */

    if (
        currentNumber === "0" &&
        number !== "."
    ) {

        currentNumber = "";

    }


    currentNumber += number;

    updateDisplay();

}


/* ==========================================
   CHOOSE OPERATION
========================================== */

function chooseOperation(op) {

    if (
        currentNumber === "" &&
        previousNumber === ""
    ) {

        return;

    }


    /* Calculate existing equation first */

    if (
        previousNumber !== "" &&
        currentNumber !== ""
    ) {

        calculate();

    }


    if (currentNumber !== "") {

        previousNumber = currentNumber;
        currentNumber = "";

    }


    operation = op;
    justCalculated = false;

    updateDisplay();

}


/* ==========================================
   CALCULATE
========================================== */

function calculate() {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {

        return;

    }


    const first = parseFloat(previousNumber);
    const second = parseFloat(currentNumber);

    let result;


    switch (operation) {

        case "+":

            result = first + second;

            break;


        case "-":

            result = first - second;

            break;


        case "*":

            result = first * second;

            break;


        case "/":

            if (second === 0) {

                currentNumber = "ERROR";
                previousNumber = "";
                operation = null;

                updateDisplay();

                showNotification("Cannot divide by zero.");

                return;

            }

            result = first / second;

            break;


        case "%":

            result = first % second;

            break;


        default:

            return;

    }


    /* Fix floating point errors */

    result =
        Math.round(result * 100000000) /
        100000000;


    /* Save equation */

    const equation =
        `${previousNumber} ${displayOperation(operation)} ${currentNumber}`;


    /* Save result */

    currentNumber = String(result);

    previousNumber = equation;

    operation = null;

    justCalculated = true;


    updateDisplay();


    /* Check special song */

    playSpecialSong(String(result));

}


/* ==========================================
   SPECIAL SONG
========================================== */

function playSpecialSong(result) {

    const song = songs[result];


    /* No special song */

    if (!song) {

        showNotification(`Result: ${result}`);

        return;

    }


    /* SONG INFO */

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;


    /* LYRICS */

    lyrics.innerHTML = "";

    song.lyrics.forEach(line => {

        const p = document.createElement("p");

        if (
            line === "[Pre-Chorus]" ||
            line === "[Chorus]"
        ) {

            p.classList.add("lyrics-section");

        }

        p.textContent = line;

        lyrics.appendChild(p);

    });


    /* AUDIO */

    audioPlayer.src = song.audio;
    audioPlayer.load();


    /*
        Browsers may block autoplay.
        The audio controls will still work.
    */

    audioPlayer.play().catch(() => {

        showNotification("Press ▶ to play the song.");

    });


    /* MUSIC CARD EFFECT */

    musicCard.classList.add("active");

    setTimeout(() => {

        musicCard.classList.remove("active");

    }, 2500);


    /* NOTIFICATION */

    showNotification(
        `♫ ${song.title} unlocked!`
    );

}


/* ==========================================
   UPDATE DISPLAY
========================================== */

function updateDisplay() {

    currentDisplay.textContent =
        currentNumber || "0";

    previousDisplay.textContent =
        previousNumber;

}


/* ==========================================
   OPERATION SYMBOLS
========================================== */

function displayOperation(op) {

    const symbols = {

        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"

    };

    return symbols[op] || op;

}


/* ==========================================
   CLEAR
========================================== */

function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operation = null;
    justCalculated = false;

    updateDisplay();

}


/* ==========================================
   DELETE
========================================== */

function deleteNumber() {

    if (justCalculated) {

        clearCalculator();

        return;

    }


    currentNumber =
        currentNumber.slice(0, -1);

    updateDisplay();

}


/* ==========================================
   NOTIFICATION
========================================== */

let notificationTimer;

function showNotification(message) {

    notificationText.textContent =
        message;

    notification.classList.add("show");


    clearTimeout(notificationTimer);


    notificationTimer = setTimeout(() => {

        notification.classList.remove("show");

    }, 2200);

}


/* ==========================================
   KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown", event => {

    const key = event.key;


    /* NUMBERS */

    if (
        !isNaN(key) ||
        key === "."
    ) {

        addNumber(key);

    }


    /* OPERATORS */

    else if (
        ["+", "-", "*", "/", "%"].includes(key)
    ) {

        chooseOperation(key);

    }


    /* ENTER / EQUALS */

    else if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();

    }


    /* BACKSPACE */

    else if (
        key === "Backspace"
    ) {

        deleteNumber();

    }


    /* ESCAPE */

    else if (
        key === "Escape"
    ) {

        clearCalculator();

    }

});


/* ==========================================
   INITIAL DISPLAY
========================================== */

updateDisplay();

console.log("🌌 Cosmic Calculator loaded successfully!");
