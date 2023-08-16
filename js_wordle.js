var wordOfTheDayAPI = "https://words.dev-apis.com/word-of-the-day"
const validWordOrNot = "https://words.dev-apis.com/validate-word"
const maxAttempt = 6

let wordOfTheDay = ""

let letter = ""
let currentGuess = []
let rightLetters = ["", "", "", "", ""]


let currentIndex = 0
let lines = []
let datas = [{ value: [] }]
/**{value :[ "a", "b", "c", "d", "e"],
 * exist :true,
 * win : false}
 */

function getFocused() {
    console.log("blabla")
    document.getElementsByClassName("keypress").focus()
}

//va chercher le mot du jour sur l'API
function whatIsTheWordToday() {
    let promise = fetch(wordOfTheDayAPI)
    return promise
        .then(function (response) {
            let processingPromise = response.text();
            return processingPromise;
        })
        .then(function (processedResponse) {
            let todayWord = JSON.parse(processedResponse).word
            return todayWord
        })
}

//ajoute la lettre sur le HTML
function displayLetter(line) {
    for (let i = 0; i < currentGuess.length; i++) {
        lines[currentIndex].querySelector(`.letter-${i + 1}`).classList.remove("predict_good_letter")
        line.querySelector(`.letter-${i + 1}`).innerText = ""
        line.querySelector(`.letter-${i + 1}`).innerText = currentGuess[i]
    }
}

//vérifie si input est UNE SEULE lettre de l'alphabet
function isLetter(character) {
    return /^[a-zA-Z]$/.test(character);
}

//vérifie si le mot fait 5 lettres et s'il existe
async function doesWordExist(wordOfFiveChar) {
    if (wordOfFiveChar.length !== wordOfTheDay.length) return false
    // pour passer ici, il faut qu'il passe toute les étapes au dessus
    let promise = await fetch(validWordOrNot, {
        method: "POST",
        body: JSON.stringify({ "word": wordOfFiveChar })
    })
    let processedResponse = await promise.json()
    return processedResponse.validWord
}

//Vérifie si les lettres sont contenues dans le mot du jour
function updateLetterColor(line) {
    let wordList = wordOfTheDay.split("")
    // update the current line 
    for (let i = 0; i < wordOfTheDay.length; i++) {
        // check le mot et son vrai index
        if (wordOfTheDay[i] === currentGuess[i]) {
            wordList.splice(i, 1, "")
            line.querySelector(`.letter-${i + 1}`).classList.add("good_placed_letter")
            rightLetters.splice(i, 1, wordOfTheDay[i])
        }
    }
    for (let i = 0; i < wordOfTheDay.length; i++) {
        const letterInWordList = wordList.find(element => element === currentGuess[i])
        if (letterInWordList !== undefined) {
            let foundSameLetter = wordList.indexOf(letterInWordList)
            wordList.splice(foundSameLetter, 1, "")
            line.querySelector(`.letter-${i + 1}`).classList.add("good_letter")
        }
        if (letterInWordList === undefined && wordOfTheDay[i] !== currentGuess[i]) {
            line.querySelector(`.letter-${i + 1}`).classList.add("wrong_letter")
        }
    }
};

//vérifie si le mot est juste, si oui, affiche "You Win">
function isTheGuessGood(myActualGuess) {
    console.log("today word is:", wordOfTheDay)
    if (myActualGuess === wordOfTheDay) {
        document.body.innerHTML += "<div><p class =\"win\">You win ! The word was \"" + wordOfTheDay + "\". Come back tomorrow and try to find the new word again !</p></div>"
        return true
    } else
        return false
}

function init() {
    // 4 Le jeu a tout pour démarrer correctement 
    // // data #1
    // const datas = []
    // datas[1].value.push("c") 
    // currentIndexLine = 1
    // [1, 2, 3, 4, 5]
    // allLines[currentIndexLine]

    lines = Array.from(document.querySelectorAll('.word'))
    document.addEventListener("keydown", async function (event) {
        letter = event.key
        // Si le  caractère est une lettre et tant qu'on a pas 5 caractères
        if (isLetter(letter) && currentGuess.length < wordOfTheDay.length) {
            currentGuess.push(letter)
            displayLetter(lines[currentIndex])
            // datas[currentIndex].value.push(letter)
        }
        //touche Retour efface un caractère
        if (letter === "Backspace") {
            currentGuess.pop()
            for (let i = currentGuess.length; i >= 0; i--) {
                if (currentGuess[i] === undefined) {
                    lines[currentIndex].querySelector(`.letter-${i + 1}`).innerText = ""
                    if (rightLetters[i] === undefined) {
                        lines[currentIndex].querySelector(`.letter-${i + 1}`).innerText = ""
                    } else
                        lines[currentIndex].querySelector(`.letter-${i + 1}`).innerText = rightLetters[i]
                    lines[currentIndex].querySelector(`.letter-${i + 1}`).classList.add("predict_good_letter")
                }
            }
        }
        //Vérifie le mot quand on appuie Entrer
        if (letter === "Enter" && currentGuess.length === wordOfTheDay.length) {
            let exist = await doesWordExist(currentGuess.join(""))
            if (exist) {
                updateLetterColor(lines[currentIndex])
                const goodWord = isTheGuessGood(currentGuess.join(""))
                for (let i = 0; i < wordOfTheDay.length; i++) {
                    if (currentIndex < wordOfTheDay.length) {
                        lines[currentIndex + 1].querySelector(`.letter-${i + 1}`).innerText = rightLetters[i];
                        lines[currentIndex + 1].querySelector(`.letter-${i + 1}`).classList.add("predict_good_letter")
                    }
                }
                if (!goodWord) {
                    currentGuess = []
                    currentIndex++
                    if (currentIndex === maxAttempt) {
                        document.body.innerHTML += "<div><p class = \"lose\">You lose ! The word was \"" + wordOfTheDay + "\"</p></div>"
                    }
                }

            } else {
                let myWrongWord = Array.from(lines[currentIndex].querySelectorAll(`.letter`))
                for (let i = 0; i < myWrongWord.length; i++) {
                    lines[currentIndex].querySelector(`.letter-${i + 1}`).classList.add("word_error")
                }
                setTimeout(() => {
                    for (let i = 0; i < myWrongWord.length; i++) {
                        lines[currentIndex].querySelector(`.letter-${i + 1}`).classList.remove("word_error")
                    }
                }, 400)
            }
            // console.log('voiciladta', datas)
        }
    })
}

// 1 va chercher le mot ....

whatIsTheWordToday().then((word) => {
    // 2 le mot est trouvé, assigne la à wordOfTheDay
    wordOfTheDay = word
    document.querySelector(".loading").classList.add("disappear")
    document.querySelector(".opacity").classList.remove("opacity")
    document.querySelector(".game").classList.remove("opacity")
    // 3 démarre mon jeu
    init()
})