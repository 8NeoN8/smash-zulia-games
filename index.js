import gamesInfo from './games.js'

let config = {
  locateFile: filename => `https://unpkg.com/sql.js/dist/${filename}`
}

const response = await fetch("https://8neon8.github.io/smash-zulia-games/testdb.db")
const arrayBuffer = await response.arrayBuffer();


initSqlJs(config).then(function(SQL){

  const db = new SQL.Database(new Uint8Array(arrayBuffer))

  const res = db.exec("SELECT * FROM test");
  console.log(res);

});


let setList = gamesInfo.setList
let showList = []

//testlink.setAttribute('href',setList[0].link)

let listContainer = document.getElementById('game-list')

let charFilter1 = document.getElementById('char-filter-one')
let charFilter2 = document.getElementById('char-filter-two')

let playerFilter1 = document.getElementById('player-filter-one')
let playerFilter2 = document.getElementById('player-filter-two')

let dateFilter = document.getElementById('date-filter')
let tournamentFilter = document.getElementById('tournament-filter')

let searchButton = document.getElementById('search-button')

let players = []
let characters = []
let tournaments = []
let dates = []

function getSetData(){
  players = []
  characters = []
  tournaments = []
  dates = []

  for (let i = 0; i < setList.length; i++) {
    
    players.push(setList[i].players[0].name)
    players.push(setList[i].players[1].name)
  
    tournaments.push(setList[i].tournament)
    
    dates.push(setList[i].date)
  
    for (let j = 0; j < setList[i].players.length; j++) {
      for (let k = 0; k < setList[i].players[j].char.length; k++) {
        characters.push(setList[i].players[j].char[k]) 
      }
    }
  }

  players = [...new Set(players)]
  characters = [...new Set(characters)]
  tournaments = [...new Set(tournaments)]
  dates = [...new Set(dates)]

}

getSetData()

function createOption(data){
  let option = document.createElement('option')
  option.setAttribute('value', data)
  option.innerText = data.toUpperCase()

  return option
}

function setDataFields(){
  for (let i = 0; i < characters.length; i++) {
    let charOption1 = createOption(characters[i])
    let charOption2 = createOption(characters[i])
    charFilter1.appendChild(charOption1)
    charFilter2.appendChild(charOption2)
  }

  for (let i = 0; i < players.length; i++) {
    let playerOption1 = createOption(players[i])
    let playerOption2 = createOption(players[i])
    playerFilter1.appendChild(playerOption1)
    playerFilter2.appendChild(playerOption2)
  }

  for (let i = 0; i < dates.length; i++) {
    let dateOption = createOption(dates[i])
    dateFilter.appendChild(dateOption)
    
  }

  for (let i = 0; i < tournaments.length; i++) {
    let tournamentOption = createOption(tournaments[i])
    tournamentFilter.appendChild(tournamentOption)
    
  }
}

function getOptionValue(option){
  return option.value ? option.value : null
}

function makeSearch(){

  let searchFilter = {}

  let isPlayerOne = getOptionValue(playerFilter1)
  let isPlayerTwo = getOptionValue(playerFilter2)

  let isCharacterOne = getOptionValue(charFilter1)
  let isCharacterTwo = getOptionValue(charFilter2)

  let isDate = getOptionValue(dateFilter)

  let isTournament = getOptionValue(tournamentFilter)
  
  if(isDate) searchFilter.date = isDate
  if(isTournament) searchFilter.tournament = isTournament

  if(!isCharacterOne && !isCharacterTwo && !isDate && !isPlayerOne && !isPlayerTwo && !isTournament){
    showList = setList
    createListItem(showList)
    return
  }
 
  let testingNewFilterIdea = setList
  
  if(isDate) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.date == isDate)
  
  if(isTournament) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.tournament == isTournament)
  
  if(isPlayerOne && !isCharacterOne) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.playerOne.name == isPlayerOne || x.playerTwo.name == isPlayerOne)
  
  if(isPlayerTwo && !isCharacterTwo) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.playerTwo.name == isPlayerTwo || x.playerOne.name == isPlayerTwo)
      
  if(isCharacterOne && !isPlayerOne) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.playerOne.char == isCharacterOne || x.playerTwo.char == isCharacterOne)

  if(isCharacterTwo && !isPlayerTwo) testingNewFilterIdea = testingNewFilterIdea.filter((x) => x.playerTwo.char == isCharacterTwo || x.playerOne.char == isCharacterTwo)

  if(isCharacterOne && isPlayerOne) testingNewFilterIdea = testingNewFilterIdea.filter((x) => (x.playerOne.name == isPlayerOne && x.playerOne.char == isCharacterOne) || (x.playerTwo.name == isPlayerOne && x.playerTwo.char == isCharacterOne))

  if(isCharacterTwo && isPlayerTwo) testingNewFilterIdea = testingNewFilterIdea.filter((x) => (x.playerTwo.name == isPlayerTwo && x.playerTwo.char == isCharacterTwo) || (x.playerOne.name == isPlayerTwo && x.playerOne.char == isCharacterTwo))

  showList = testingNewFilterIdea

  createListItem(showList)
}

function createListItem(itemList){

  let list = document.getElementById('game-list')
  list.innerText = ''

  for (let i = 0; i < itemList.length; i++) {
    let itemContainer = makeEl('li')
    addClasses(itemContainer, ['game-list-item'])
    itemContainer.setAttribute('id','game-list-item')

    let playerOneSection = makeEl('div')
    addClasses(playerOneSection,['player-one','item-section'])
    itemContainer.appendChild(playerOneSection)
    
    let playerOneName = makeEl('div')
    playerOneName.setAttribute('title',itemList[i].playerOne.name)
    addClasses(playerOneName, ['player-name'])
    playerOneName.innerText = (itemList[i].playerOne.name).toUpperCase()
    playerOneSection.appendChild(playerOneName)

    let playerOneCharImg = makeEl('img')
    //*convert al images to webp, name them exactly like character name to search the image 1:1
    playerOneCharImg.setAttribute('src','https://8neon8.github.io/smash-zulia-games/img/chara_0_mario_00.png')
    addClasses(playerOneCharImg, ['player-character'])

    if(itemList[i].setCount[0] > itemList[i].setCount[1]){
      addClasses(playerOneCharImg, ['winner-char'])
    }else addClasses(playerOneCharImg, ['loser-char'])

    playerOneSection.appendChild(playerOneCharImg)

    let setData = makeEl('div')
    addClasses(setData, ['set-data','item-section'])
    itemContainer.appendChild(setData)

    let setTournament = makeEl('div')
    addClasses(setTournament, ['set-tournament'])
    setTournament.setAttribute('title', itemList[i].tournament)
    setTournament.innerText = itemList[i].tournament
    setData.appendChild(setTournament)

    let setDate = makeEl('div')
    addClasses(setDate, ['set-date'])
    setDate.innerText = itemList[i].date
    setData.appendChild(setDate)

    let setResult = makeEl('div')
    addClasses(setResult, ['set-result'])
    let result1 = makeEl('span')
    result1.innerText = itemList[i].setCount[0]
    let result2 = makeEl('span')
    result2.innerText = itemList[i].setCount[1]

    setResult.appendChild(result1)
    setResult.appendChild(result2)

    if(itemList[i].setCount[0] > itemList[i].setCount[1]){
      result1.classList.remove('loser-count')
      addClasses(result1, ['winner-count'])
      result2.classList.remove('winner-count')
      addClasses(result2, ['loser-count'])
    }else{
      result2.classList.remove('loser-count')
      addClasses(result2, ['winner-count'])
      result1.classList.remove('winner-count')
      addClasses(result1, ['loser-count'])
    }
    
    setData.appendChild(setResult)

    let setLink = makeEl('a')
    addClasses(setLink, ['set-link'])
    setLink.setAttribute('href', itemList[i].link)
    setLink.setAttribute('target', '_blank')
    setLink.innerText = 'Link'
    setData.appendChild(setLink)

    let playerTwoSection = makeEl('div')
    addClasses(playerTwoSection,['player-two','item-section'])
    itemContainer.appendChild(playerTwoSection)
    
    let playerTwoName = makeEl('div')
    playerTwoName.setAttribute('title',itemList[i].playerTwo.name)
    addClasses(playerTwoName, ['player-name'])
    playerTwoName.innerText = (itemList[i].playerTwo.name).toUpperCase()
    playerTwoSection.appendChild(playerTwoName)

    let playerTwoCharImg = makeEl('img')
    //*convert al images to webp, name them exactly like character name to search the image 1:1
    playerTwoCharImg.setAttribute('src','/img/chara_0_mario_00.png')
    addClasses(playerTwoCharImg, ['player-character'])

    if(itemList[i].setCount[1] > itemList[i].setCount[0]){
      addClasses(playerTwoCharImg, ['winner-char'])
    }else addClasses(playerTwoCharImg, ['loser-char'])

    playerTwoSection.appendChild(playerTwoCharImg)

    list.appendChild(itemContainer)
  }
}

function makeEl(el){
  return document.createElement(el)
}

function addClasses(el, classes){
  for (let i = 0; i < classes.length; i++) {
    el.classList.add(classes[i])
  }
  
}

searchButton.addEventListener('click', () => {
  makeSearch()
})

setDataFields()