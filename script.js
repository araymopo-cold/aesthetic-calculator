```js
/* ==========================================
   COSMIC CALCULATOR
========================================== */


/*
    SPECIAL EQUATIONS

    10 + 8 = 18
    → Sino — IV of Spades

    2 + 2 = 4
    → Pag-Ibig — Ace Banzuelo
*/


const songs = {

    "18": {
        title: "Sino",
        artist: "IV of Spades",

        /*
            Put your authorized audio file here.
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

    /*
        If a calculation was just completed
        and the user types a number, start
        a new calculation.
    */

    if (justCalculated) {

        currentNumber = "";
        previousNumber = "";
        operation = null;

        justCalculated = false;

    }


    /*
        Prevent multiple decimal points.
    */

    if (
        number === "." &&
        currentNumber.includes(".")
    ) {

        return;

    }


    /*
        Prevent numbers such as 0005.
    */

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

    /*
        Do nothing if there is no number.
    */

    if (
        currentNumber === "" &&
        previousNumber === ""
    ) {

        return;

    }


    /*
        If there is already an equation,
        calculate it first.
    */

    if (
        previousNumber !== "" &&
        currentNumber !== ""
    ) {

        calculate();

    }


    /*
        Store the current number as
        the first number.
    */

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

    /*
        Make sure we have everything needed.
    */

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operation === null
    ) {

        return;

    }


    const first =
        parseFloat(previousNumber);

    const second =
        parseFloat(currentNumber);

    let result;


    /* ======================================
       MATHEMATICAL OPERATIONS
    ====================================== */

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

            /*
                Prevent division by zero.
            */

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


    /*
        Remove ugly floating-point errors.

        Example:
        0.1 + 0.2

        becomes:
        0.3
    */

    result =
        Math.round(result * 100000000) /
        100000000;


    /*
        Save the equation for the
        previous display.
    */

    const equation =
        `${previousNumber} ${displayOperation(operation)} ${currentNumber}`;


    /*
        Store result.
    */

    currentNumber =
        String(result);

    previousNumber =
        equation;

    operation = null;

    justCalculated = true;


    updateDisplay();


    /*
        Check if this result unlocks
        a special song.
    */

    playSpecialSong(
        String(result)
    );

}


/* ==========================================
   SPECIAL SONG
========================================== */

function playSpecialSong(result) {

    const song =
        songs[result];


    /*
        No special song for this result.
    */

    if (!song) {

        showNotification(
            `Result: ${result}`
        );

        return;

    }


    /* ======================================
       SONG INFORMATION
    ====================================== */

    songTitle.textContent =
        song.title;

    artistName.textContent =
        song.artist;


    /* ======================================
       LYRICS
    ====================================== */

    lyrics.innerHTML = "";


    song.lyrics.forEach(line => {

        const p =
            document.createElement("p");


        /*
            Special formatting for
            [Pre-Chorus] and [Chorus].
        */

        if (
            line === "[Pre-Chorus]" ||
            line === "[Chorus]"
        ) {

            p.classList.add(
                "lyrics-section"
            );

        }


        p.textContent = line;

        lyrics.appendChild(p);

    });


    /* ======================================
       AUDIO
    ====================================== */

    audioPlayer.src =
        song.audio;

    audioPlayer.load();


    /*
        Try to automatically play.
    */

    audioPlayer.play()
        .catch(() => {

            showNotification(
                "Press ▶ to play the song"
            );

        });


    /* ======================================
       MUSIC CARD EFFECT
    ====================================== */

    musicCard.classList.add(
        "active"
    );


    setTimeout(() => {

        musicCard.classList.remove(
            "active"
        );

    }, 2500);


    /* ======================================
       NOTIFICATION
    ====================================== */

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

    /*
        If the user deletes after a
        calculation, clear everything.
    */

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


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

        }, 2200);

}


/* ==========================================
   KEYBOARD SUPPORT
========================================== */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        /* NUMBER / DECIMAL */

        if (
            !isNaN(key) ||
            key === "."
        ) {

            addNumber(key);

        }


        /* OPERATORS */

        else if (
            ["+", "-", "*", "/", "%"]
                .includes(key)
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
```
