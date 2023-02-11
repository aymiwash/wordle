let letter = document.querySelector("form")
let currentGuess = []
let wordOfTheDay = "https://words.dev-apis.com/word-of-the-day"


async function whatIsTheWordToday(){
    let promise = await fetch(wordOfTheDay)
    let processedResponse = await promise.json()
    wordOfTheDay = processedResponse.word
} //va chercher le mot du jour sur l'API

whatIsTheWordToday()

function isLetter(character) {
    return /^[a-zA-Z]$/.test(character);
} //vérifie si input est UNE SEULE lettre de l'alphabet

function init() {
    letter.addEventListener("click", function (event) {
        console.log(event.target.value)
        letter = event.target.value
        // console.log(letter)
    }
    )
} //récupère la lettre dans l'input
init()



function nextLetter(currentInput) {
if(isLetter(letter) && currentInput.length === 1) {
    document.querySelector(".first.n2").focus()
    currentGuess.push(letter)
    
}
}

function isTheGuessGood(myActualGuess){
    if( currentGuess.length === 5 && currentGuess.join("") === wordOfTheDay){
        alert("You Win ! The word was", wordOfTheDay.toUpperCase())
    }
}//vérifie si le mot est juste, si oui, affiche "You Win">