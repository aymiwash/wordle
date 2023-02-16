let letter = ""
let currentGuess = ["s", "l", "u", "n", "g"]
let wordOfTheDayAPI = "https://words.dev-apis.com/word-of-the-day"
let validWordOrNot = "https://words.dev-apis.com/validate-word"
let wordOfTheDay = ""

//va chercher le mot du jour sur l'API
function whatIsTheWordToday() {
    let promise = fetch(wordOfTheDayAPI)
    promise.then(function (response) {
        let processingPromise = response.text();
        return processingPromise;
    })
        .then(function (processedResponse) {
            wordOfTheDay = JSON.parse(processedResponse).word
            console.log(wordOfTheDay)
            return wordOfTheDay
        })
}

whatIsTheWordToday()

//vérifie si input est UNE SEULE lettre de l'alphabet
function isLetter(character) {
    return /^[a-zA-Z]$/.test(character);
}


//vérifie si le mot fait 5 lettres et s'il existe
async function doesWordExist(wordOfFiveChar) {
    console.log("exist")
    if (currentGuess.length === 5) {
        let promise = await fetch(validWordOrNot, {
            method: "POST",
            body: JSON.stringify({ "word": wordOfFiveChar })
        })
        let processedResponse = await promise.json()
        // console.log(processedResponse.validWord)
        return processedResponse.validWord
    }
}


//vérifie si le mot est juste, si oui, affiche "You Win">
function isTheGuessGood(myActualGuess) {
    if (myActualGuess.join("") === wordOfTheDay) {
        console.log("caca")
        alert("You Win ! The word was", wordOfTheDay.toUpperCase())

    }

}

isTheGuessGood(currentGuess)


//récupère la lettre tapée
function init() {
    document.addEventListener("keydown", function (event) {
        letter = event.key
        if (isLetter(letter)) {
            currentGuess.push(letter)
        }
        return letter
    }
    )
}

init()