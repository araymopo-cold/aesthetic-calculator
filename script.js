/* ==========================================
   COSMIC CALCULATOR
========================================== */


/*
    SPECIAL EQUATIONS

    10 + 8 = 18
    → Sino — IV of Spades

    2 + 2 = 4
    → Na Para Bang — Mariah Deborah
*/

const songs = {

    "18": {
        title: "Sino",
        artist: "IV of Spades",

        /*
            Put your authorized audio file here.
            Example:

            music/sino.mp3
        */
        audio: "music/sino.mp3",

        /*
            Put your authorized lyrics here.
        */
        lyrics: [
            "Your authorized lyrics go here.",
            "",
            "Replace this text with lyrics",
            "you have permission to use."
        ]
    },

  "4": { title: "Pag-Ibig",  
      artist: "Ace Banzuelo", 
      audio: "music/pag-ibig.mp3", 
        lyrics: [ "Pero ’di ba sabi mo kung meron man nagpaparamdam",
         "Nilalayo ang sarili, ayaw matulad sa dati", "[Pre-Chorus]",
         "'Di ko alam ang dapat sabihin",
         "'Di ko alam ang dapat aminin", 
         "’Di ko alam kung kailan,
         paano (Paano?)",
         "Nalimutang pag-ibig,
         meron bang pipili sa'kin?",
      "[Chorus]", "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
      "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
                 "(Ha-ah) Meron ba? Meron ba? Meron bang pipili sa'kin?",
                 "(Ha-ah) Meron ba? Meron ba? Oh-oh" ] },

};


/* ==========================================
   ELEMENTS
========================================== */

const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const buttons =
    document.querySelectorAll("button");

const songTitle =
    document.getElementById("songTitle");

const artistName =
    document.getElementById("artistName");

const lyrics =
    document.getElementById("lyrics");

const audioPlayer =
    document.getElementById("audioPlayer");

const musicCard =
    document.getElementById("musicCard");

const notification =
    document.getElementById("notification");

const notificationText =
    document.getElementById("notificationText");


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

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;


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

    if (justCalculated) {
        currentNumber = "";
        previousNumber = "";
        operation = null;

        justCalculated = false;
    }


    if (
        number === "." &&
        currentNumber.includes(".")
    ) {
        return;
    }


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

    if (currentNumber === "" && previousNumber === "") {
        return;
    }


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


    /* Remove ugly decimal floating errors */

    result = Math.round(result * 100000000) / 100000000;


    const equation =
        `${previousNumber} ${displayOperation(operation)} ${currentNumber}`;


    currentNumber = String(result);

    previousNumber = equation;

    operation = null;

    justCalculated = true;


    updateDisplay();


    /*
        Check if this result unlocks
        a special song.
    */

    playSpecialSong(String(result));

}


/* ==========================================
   SPECIAL SONG
========================================== */

function playSpecialSong(result) {

    const song = songs[result];


    if (!song) {

        showNotification(
            `Result: ${result}`
        );

        return;
    }


    songTitle.textContent =
        song.title;

    artistName.textContent =
        song.artist;


    /* LYRICS */

    lyrics.innerHTML = "";


    song.lyrics.forEach(line => {

        const p =
            document.createElement("p");

        p.textContent = line;

        lyrics.appendChild(p);

    });


    /* AUDIO */

    audioPlayer.src =
        song.audio;

    audioPlayer.load();


    /*
        Browsers can block autoplay
        in some situations.

        Because this happens after a
        calculator button click, it
        will normally be allowed.
    */

    audioPlayer.play()
        .catch(() => {

            showNotification(
                "Press ▶ to play the song"
            );

        });


    /* CARD EFFECT */

    musicCard.classList.add("active");


    setTimeout(() => {

        musicCard.classList.remove("active");

    }, 2500);


    showNotification(
        `♫ ${song.title} unlocked!`
    );

}


/* ==========================================
   DISPLAY
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


    notificationTimer =
        setTimeout(() => {

            notification.classList.remove("show");

        }, 2200);

}


/* ==========================================
   KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown", event => {

    const key = event.key;


    if (
        !isNaN(key) ||
        key === "."
    ) {

        addNumber(key);

    }


    else if (
        ["+", "-", "*", "/", "%"].includes(key)
    ) {

        chooseOperation(key);

    }


    else if (
        key === "Enter" ||
        key === "="
    ) {

        event.preventDefault();

        calculate();

    }


    else if (key === "Backspace") {

        deleteNumber();

    }


    else if (key === "Escape") {

        clearCalculator();

    }

});
