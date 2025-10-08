let helpDialog = document.getElementById('help-dialog')
let openDialog = document.getElementById('help-button')
let closeDialog = document.getElementById('close-dialog')

let searchButton = document.getElementById('search-button')

let playerList = []
let setList = []
let charList = ['mario','dk','link','samus','dsamus','yoshi','kirby','fox','pikachu','luigi','ness','cf','jigglypuff','peach','daisy','bowser','ics','sheik','zelda','drmario','pichu','falco','marth','lucina','yink','ganondorf','mewtwo','roy','chrom','gnw','mk','pit','dpit','zss','wario','snake','ike','pt','ddk','lucas','sonic','ddd','olimar','lucario','rob','tink','wolf','villager','megaman','wiifit','rosalina','lmac','greninja','mfighter','mgunner','msword','palutena','pac-man','robin','shulk','jr','duckhunt','ryu','ken','cloud','corrin','bayonetta','inkling','ridley','simon','ritcher','kkrool','isabelle','incineroar','plant','joker','hero','bnk','terry','byleth','minmin','steve','sephiroth','pythra','kazuya','sora']
let tournamentList = []

let char1Filter = document.getElementById('char-filter-one')
let player1Filter = document.getElementById('player-filter-one')
let char2Filter = document.getElementById('char-filter-two')
let player2Filter = document.getElementById('player-filter-two')
let dateFilter = document.getElementById('date-filter')
let tournamentFilter = document.getElementById('tournament-filter')

openDialog.addEventListener('click', () => {
  helpDialog.classList.remove('hidden')
})

closeDialog.addEventListener('click', () => {
  helpDialog.classList.add('hidden')
})

searchButton.addEventListener('click', () => {
  db_searchSets()
})

db_getPlayerList()
db_getTournaments()
charSuggestions()

function getOptionValue(option){
  return option.value ? option.value : null
}

function charSuggestions(){
  for (let i = 0; i < charList.length; i++) {
    let option = document.createElement('option')
    option.value = charList[i]
    option.innerText = charList[i].toUpperCase()
    char1Filter.appendChild(option)
  }
  for (let i = 0; i < charList.length; i++) {
    let option = document.createElement('option')
    option.value = charList[i]
    option.innerText = charList[i].toUpperCase()
    char2Filter.appendChild(option)
  }
}

function playerSuggestions(){
  for (let i = 0; i < playerList.length; i++) {
    let option = document.createElement('option')
    option.value = playerList[i][0]
    option.innerText = playerList[i][1]
    option.innerText = option.innerText.toUpperCase()
    player1Filter.appendChild(option)
  }
  for (let i = 0; i < playerList.length; i++) {
    let option = document.createElement('option')
    option.value = playerList[i][0]
    option.innerText = playerList[i][1]
    option.innerText = option.innerText.toUpperCase()
    player2Filter.appendChild(option)
  }
}

function tourneySuggestions(){
  for (let i = 0; i < tournamentList.length; i++) {
    let option = document.createElement('option')
    option.value = tournamentList[i].id
    option.innerText = tournamentList[i].name.toUpperCase()
    tournamentFilter.appendChild(option)
  }
}

async function testDB(){
  const db = await getDB()

  let str1 = "SELECT name FROM sqlite_master WHERE type='table';" //"SELECT name FROM sqlite_master WHERE type='table';"
  let res1 = db.exec(str1)
  console.log(res1);
  
  let str2 = "SELECT * FROM players;" //"SELECT name FROM sqlite_master WHERE type='table';"
  let res2 = db.exec(str2)
  console.log(res2);
}

async function getDB(){
  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  
  const db = new SQL.Database(new Uint8Array(await getDBFile()))

  return db
}

async function getDBFile(){
  let response = await fetch("https://8neon8.github.io/smash-zulia-games/testdb.db") //*https://8neon8.github.io/smash-zulia-games
  let arrayBuffer = await response.arrayBuffer();
  return arrayBuffer
}

async function db_getPlayerList(){
  const db = await getDB()

  let str = "SELECT * FROM players;"
  let res = db.exec(str)

  let values = null
  let columns = null
  let objectifiedData = null

  if(res.length > 0){
    res = res[0]
    columns = res.columns
    values = res.values

    objectifiedData = values.map(row => {
      const obj = {}
      columns.forEach((colName, index) => {
        obj[colName] = row[index]
      });
      return obj
    })
    playerList = objectifiedData
    playerSuggestions()
    return
  }
}

async function db_getTournaments(){
  const db = await getDB()
  let str = 'SELECT * FROM tournaments'
  let res = db.exec(str)
  
  let values = null
  let columns = null 
  let objectifiedData = null
  
  if(res.length > 0){
    res = res[0]
    columns = res.columns
    values = res.values
    
    objectifiedData = values.map(row => {
      const obj = {}
      columns.forEach((colName, index) => {
        obj[colName] = row[index]
      });
      return obj
    })

    tournamentList = objectifiedData
    tourneySuggestions()
    return
  }
}

async function db_searchSets(){
  let isPlayerOne = getOptionValue(player1Filter)
  let isPlayerTwo = getOptionValue(player2Filter)
  let isCharacterOne = getOptionValue(char1Filter)
  let isCharacterTwo = getOptionValue(char2Filter)
  let isDate = getOptionValue(dateFilter)
  let isTournament = getOptionValue(tournamentFilter)
  
  const db = await getDB()
  let str = 'SELECT * FROM sets WHERE '

  if(isDate){

    let isTourney = tournamentList.findAll(tourney => tourney.date = isDate)
    console.log(isTourney);
    if(isTourney.length == 0) return
    if(isTourney.length == 1) str += `tournament = ${isTourney[0].id} AND `
    //*make it so if there is more than 1 tournament on the same day it searches for all tournaments
    //else str += `tournament IN (${isTourney[0].id} AND `
  }

  if(isPlayerOne && !isPlayerTwo) str += `playerOne = ${isPlayerOne} OR playerTwo = ${isPlayerOne} AND `

  if(isPlayerTwo && !isPlayerOne) str += `playerTwo = ${isPlayerTwo} OR playerOne = ${isPlayerTwo} AND `

  if(isPlayerOne && isPlayerTwo) str += `playerOne = ${isPlayerOne} OR playerTwo = ${isPlayerOne} AND playerTwo = ${isPlayerTwo} OR playerOne = ${isPlayerTwo}`

  if(isCharacterOne && !isCharacterTwo) str += `charOne = '${isCharacterOne}' OR charTwo = '${isCharacterOne}' AND `

  if(isCharacterTwo && !isCharacterOne) str += `charTwo = '${isCharacterTwo}' OR charOne = '${isCharacterTwo}' AND `

  if(isCharacterOne && isCharacterTwo) str += `charOne = '${isCharacterOne}' OR charTwo = '${isCharacterOne}' AND charTwo = '${isCharacterTwo}' OR charOne = '${isCharacterTwo}' AND `

  if(isTournament && !isDate) str += `tournament = '${isTournament}' AND `

  if(str[str.length-1] == ' ' && str[str.length-2] != 'E' && str[str.length-2] != 'D') str = str.slice(0, -2)

  if(str[str.length-1] == ' ' && str[str.length-2] === 'E') str = str.replaceAll(' WHERE ', '')
  
  if(str[str.length-1] == ' ' && str[str.length-2] === 'D') str = str.slice(0,-4)

  let res = db.exec(str)

  let values = null
  let columns = null
  let objectifiedData = null

  if(res.length > 0){
    res = res[0]
    columns = res.columns
    values = res.values

    objectifiedData = values.map(row => {
      const obj = {}
      columns.forEach((colName, index) => {
        obj[colName] = row[index]
      });
      return obj
    })
    setList = objectifiedData
    //createListItem(setList)

    setList.forEach(set => {
      set.playerOne = playerList.find(player => player.id == set.playerOne)
      set.playerTwo = playerList.find(player => player.id == set.playerTwo)

      set.tournament = tournamentList.find(tournament => tournament.id == set.tournament)
    });

    createListItem(setList)
    return
  }
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
    playerOneCharImg.setAttribute('src',`https://8neon8.github.io/smash-zulia-games/img/${itemList[i].charOne}.webp`)
    addClasses(playerOneCharImg, ['player-character'])

    if(itemList[i].ScoreOne > itemList[i].scoreTwo){
      addClasses(playerOneCharImg, ['winner-char'])
    }else addClasses(playerOneCharImg, ['loser-char'])

    playerOneSection.appendChild(playerOneCharImg)

    let setData = makeEl('div')
    addClasses(setData, ['set-data','item-section'])
    itemContainer.appendChild(setData)

    let setTournament = makeEl('div')
    addClasses(setTournament, ['set-tournament'])
    setTournament.setAttribute('title', itemList[i].tournament.name)
    setTournament.innerText = itemList[i].tournament.name.toUpperCase()
    setData.appendChild(setTournament)

    let setDate = makeEl('div')
    addClasses(setDate, ['set-date'])
    setDate.innerText = itemList[i].tournament.date
    setData.appendChild(setDate)

    let setResult = makeEl('div')
    addClasses(setResult, ['set-result'])
    let result1 = makeEl('span')
    result1.innerText = itemList[i].scoreOne
    let result2 = makeEl('span')
    result2.innerText = itemList[i].scoreTwo

    setResult.appendChild(result1)
    setResult.appendChild(result2)

    if(itemList[i].scoreOne > itemList[i].scoreTwo){
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
    playerTwoCharImg.setAttribute('src',`https://8neon8.github.io/smash-zulia-games/img/${itemList[i].charTwo}.webp`)
    addClasses(playerTwoCharImg, ['player-character'])

    if(itemList[i].scoreTwo > itemList[i].scoreOne){
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