let letter = ""
let currentGuess = ["c", "a", "n", "n", "y"]
let wordOfTheDay = "https://words.dev-apis.com/word-of-the-day"
let validWordOrNot = "https://words.dev-apis.com/validate-word"

//va chercher le mot du jour sur l'API
async function whatIsTheWordToday() {
    console.log("api word")
    let promise = await fetch(wordOfTheDay)
    let processedResponse = await promise.json()
    wordOfTheDay = processedResponse.word
}

//vérifie si input est UNE SEULE lettre de l'alphabet
function isLetter(character) {
    return /^[a-zA-Z]$/.test(character);
}

//récupère la lettre tapée
function init() {
    console.log("init")
    whatIsTheWordToday()
    document.addEventListener("keydown", function (event) {
        letter = event.key
        if (isLetter(letter)) {
            currentGuess.push(letter)
        }
        return letter
    }
    )
    console.log(wordOfTheDay)
}

init()

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
    console.log(myActualGuess)
    console.log(wordOfTheDay)
    if (myActualGuess.join("") === wordOfTheDay) {
        alert("You Win ! The word was", wordOfTheDay.toUpperCase())
    }
}

isTheGuessGood(currentGuess)