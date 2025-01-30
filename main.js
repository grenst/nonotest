document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style')
  style.textContent = `
  h1 {
    font-size: 3em;
    margin: 6px;
    text-shadow: 0 0 10px rgba(50, 255, 50, 0.5), 0 0 5px rgba(100, 255, 100, 0.5);
  }
  .wrapper {
    position: relative;
    margin: 30px auto;
    max-width: 650px;
    width: 95%;
    min-height: 400px;
    border-radius: 20px;
    background: radial-gradient(#222922, #000500);
    box-shadow: 0 0 10px rgba(50,255,50,0.5);
    padding: 20px;
  }
  .overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    background-image: linear-gradient(transparent 0%, rgba(10,16,10,0.6) 50%);
    background-size: 1000px 2px;
    z-index: 10;
    box-shadow: inset 0 0 40px #000000;
  }
  .content {
    position: relative;
    z-index: 2;
  }
  .hsContainer {
    width: 100%;
    height: 180px;
    overflow: hidden;
    border: 1px solid rgba(50,255,50,0.5);
    border-radius: 8px;
    position: relative;
    margin-top: 10px;
    box-sizing: border-box;
  }
  .hsList {
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .hsList li {
    padding: 4px;
    font-size: 1.6em;
    color: #fff;
    text-shadow: 0 0 10px rgba(50, 255, 50, 0.5), 0 0 5px rgba(100, 255, 100, 0.5);
    display: flex;
    align-items: center;
    gap: 30px;
  }
  @media (max-width: 500px) {
    .wrapper {
      width: 95%;
      margin: 10px auto;
    }
    button { 
      font-size: 14px;
      padding: 0; 
      margin: 4px;
    }
    h1 { 
      font-size: 28px; 
      margin: 6px; 
    }
    #timerDisplay { 
      font-size: 16px; 
    }
    .diff__container {
      flex-direction: column;
    }
    .diff__btn {
      font-size: 1em;
      padding: 0;
    }
    .highscore-container li {
      font-size: 1em;
    }
  }
  `
  document.head.appendChild(style)

  const wrapper = document.createElement('div')
  wrapper.classList.add('wrapper')
  document.body.appendChild(wrapper)

  const overlay = document.createElement('div')
  overlay.classList.add('overlay')
  wrapper.appendChild(overlay)

  const content = document.createElement('div')
  content.classList.add('content')
  wrapper.appendChild(content)

  function calcClues(arr) {
      const o = arr.reduce((res, val) => {
          if (val === 1) res.count++
          else if (res.count > 0) {
              res.result.push(res.count)
              res.count = 0
          }
          return res
      }, { count: 0, result: [] })
      if (o.count > 0) o.result.push(o.count)
      return o.result.length ? o.result : [0]
  }

  const puzzleData = {
      easy: [
          { name: "Easy 1", puzzle: [[0,1,1,0,0],[1,1,0,1,1],[0,1,1,1,0],[1,1,0,1,1],[0,1,1,0,0]] },
          { name: "Easy 2", puzzle: [[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1],[0,1,0,1,0],[1,0,1,0,1]] },
          { name: "Easy 3", puzzle: [[1,1,0,0,1],[0,1,1,1,0],[1,0,1,0,1],[1,1,1,0,1],[0,0,1,1,1]] },
          { name: "Easy 4", puzzle: [[0,0,1,0,1],[1,1,1,1,0],[1,0,1,1,1],[0,1,0,0,1],[1,1,1,0,0]] },
          { name: "Easy 5", puzzle: [[1,1,1,1,1],[0,0,0,0,0],[1,0,1,0,1],[0,1,0,1,0],[1,1,0,0,1]] }
      ],
      medium: [
          { name: "Medium 1", image: "img/med1.png", puzzle: [[0,0,0,0,1,0,1,1,0,0],[1,1,0,1,1,0,0,0,0,1],[1,0,0,0,0,1,1,0,0,0],[0,1,1,0,1,0,0,1,1,0],[1,1,1,1,0,1,0,0,0,0],[0,0,1,1,1,1,0,0,1,0],[1,0,1,0,1,0,0,0,1,0],[1,0,0,1,0,1,0,0,0,1],[0,1,1,1,1,0,0,1,1,0],[0,0,0,1,1,0,1,0,0,0]] },
          { name: "Medium 2", image: "img/med2.png", puzzle: [[1,0,0,0,0,0,0,0,0,1],[0,1,0,0,0,0,0,0,1,0],[0,0,1,0,0,0,0,1,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,0,0,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,1,0,0,0,0,1,0,0],[0,1,0,0,0,0,0,0,1,0],[1,0,0,0,0,0,0,0,0,1]] },
          { name: "Medium 3", image: "img/med3.png", puzzle: [[1,1,0,0,1,1,1,0,1,0],[0,0,0,1,0,1,0,1,1,1],[1,0,1,1,0,1,0,0,0,1],[0,1,0,0,1,0,1,1,0,0],[1,1,1,1,0,0,1,0,1,0],[0,0,1,1,1,0,0,1,1,1],[1,0,0,0,1,1,0,1,0,0],[0,1,1,0,0,1,1,1,0,1],[1,0,0,1,0,0,1,0,0,1],[1,1,1,0,1,0,0,1,1,0]] },
          { name: "Medium 4", image: "img/med4.png", puzzle: [[0,0,1,1,1,0,0,1,1,0],[1,1,0,0,0,1,1,1,0,0],[0,1,0,1,0,0,0,1,0,1],[1,0,0,0,1,1,0,0,0,1],[1,1,1,1,0,0,1,0,0,0],[0,1,0,1,1,0,1,1,1,0],[1,0,1,0,0,1,0,1,0,0],[0,0,0,1,1,1,0,0,1,1],[1,1,0,0,1,0,0,0,1,0],[0,0,1,0,1,1,1,1,0,1]] },
          { name: "Medium 5", image: "img/med5.png", puzzle: [[1,0,1,1,1,0,0,1,0,0],[0,1,0,0,0,1,1,0,1,0],[1,1,0,0,1,0,0,1,1,1],[1,0,1,1,0,0,1,0,0,1],[0,1,1,0,1,1,0,0,1,0],[0,0,1,1,1,0,1,1,0,1],[1,0,0,0,0,1,0,1,0,0],[0,1,0,1,1,0,0,1,1,1],[1,1,1,0,0,1,1,0,1,0],[0,1,0,0,1,1,1,0,0,0]] }
      ],
      hard: [
          { name: "Hard 1", image: "img/hard1.png", puzzle: [[0,0,1,1,0,0,0,1,0,0,1,0,1,1,0],[1,1,0,0,1,0,1,0,0,1,0,1,0,0,1],[0,0,0,0,1,1,0,1,1,0,1,0,0,0,1],[1,1,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,1,0,0,1,1,1,0,0,1,0,0,0,1],[1,0,1,1,1,0,1,0,0,1,0,1,1,1,1],[0,1,0,0,0,0,0,0,1,0,0,1,0,1,0],[1,1,0,1,0,1,0,1,0,0,0,1,0,1,0],[0,0,1,1,1,0,0,1,0,1,1,0,1,0,0],[1,0,0,0,1,1,1,0,0,0,0,0,1,1,0],[1,0,1,0,1,0,0,0,1,1,1,0,0,0,1],[0,1,0,0,0,1,1,1,0,1,0,0,1,0,1],[1,1,1,1,0,0,1,0,1,0,0,1,0,0,0],[0,1,0,0,1,0,0,1,1,0,0,0,1,0,0],[1,1,0,1,0,1,1,0,0,0,1,0,0,1,0]] },
          { name: "Hard 2", image: "img/hard2.png", puzzle: [[1,0,0,1,1,0,1,1,0,1,0,0,0,1,0],[1,1,1,0,1,1,0,0,1,0,0,1,0,1,1],[0,1,0,1,0,0,1,0,0,1,1,1,0,0,0],[0,0,1,1,1,1,0,1,0,1,1,0,1,1,0],[1,1,0,0,0,1,0,1,0,1,0,0,0,1,0],[0,1,0,1,0,1,1,1,1,0,0,0,1,0,0],[1,1,1,0,1,0,0,0,1,1,1,0,0,1,0],[1,0,1,0,1,0,0,1,0,0,0,1,0,1,1],[0,0,0,1,1,0,1,0,1,0,1,1,1,0,0],[1,1,0,0,0,1,1,1,0,0,1,0,0,1,1],[0,0,1,1,0,1,0,1,1,1,0,1,0,0,1],[0,1,0,0,1,1,0,0,1,0,1,1,1,1,0],[1,1,1,1,0,0,1,0,0,1,0,0,0,1,0],[0,0,1,0,1,1,0,1,0,0,1,1,0,0,1],[1,0,0,0,0,0,1,1,1,0,1,0,1,0,0]] },
          { name: "Hard 3", image: "img/hard3.png", puzzle: [[1,1,0,1,1,1,0,0,0,1,1,0,1,0,0],[0,0,1,1,0,0,1,1,1,0,0,1,1,1,1],[1,0,1,0,1,1,0,0,1,0,0,0,0,0,1],[0,1,1,0,0,1,1,1,0,1,1,0,1,1,0],[0,1,0,1,1,0,0,1,1,1,0,0,0,1,0],[1,1,0,0,0,1,1,0,0,0,1,0,1,0,1],[0,0,1,0,0,1,0,0,1,1,1,0,1,1,0],[1,0,0,1,1,1,0,1,0,0,0,0,0,0,1],[1,1,1,1,0,0,1,1,1,0,0,0,0,1,0],[0,1,0,0,1,0,1,0,0,1,1,0,1,0,0],[1,0,1,1,0,0,0,1,1,1,0,1,0,0,1],[0,0,1,0,1,1,1,0,0,0,1,1,0,1,0],[1,1,0,1,0,1,0,0,0,1,0,0,1,1,1],[1,1,1,0,1,0,1,0,1,1,1,0,0,1,0],[0,0,1,0,0,0,1,1,0,0,0,1,1,0,0]] },
          { name: "Hard 4", image: "img/hard4.png", puzzle: [[0,1,1,1,0,1,0,1,0,0,1,0,0,1,1],[1,0,0,0,1,0,1,0,1,1,0,1,1,0,0],[0,1,0,1,0,0,0,1,0,1,0,0,0,1,1],[1,1,1,0,1,1,0,1,1,0,0,0,1,0,0],[1,0,1,1,0,0,1,0,0,0,1,1,0,0,1],[1,1,1,1,0,1,1,1,0,0,0,1,0,1,1],[0,0,0,0,1,0,0,1,1,1,0,1,0,0,0],[1,0,0,1,1,0,1,0,0,0,1,1,1,1,0],[0,1,1,0,0,1,1,1,0,1,0,1,0,1,1],[1,0,1,1,1,0,1,0,1,0,0,0,1,0,0],[0,1,0,0,1,0,0,0,0,1,1,1,0,1,0],[0,1,1,1,1,0,0,1,1,0,1,0,0,0,0],[1,1,0,0,0,0,0,1,0,1,0,1,1,0,1],[0,1,1,0,1,1,1,0,1,0,0,0,0,0,1],[1,0,0,0,1,0,0,1,1,1,1,0,0,1,0]] },
          { name: "Hard 5", image: "img/hard5.png", puzzle: [[1,1,1,1,0,1,1,1,1,0,1,0,1,1,0],[0,0,1,0,1,0,0,0,1,1,0,1,1,0,1],[1,0,0,1,1,1,0,0,1,0,0,0,1,1,0],[1,1,0,0,1,0,1,1,0,1,1,1,0,0,1],[0,0,1,1,1,1,0,1,0,0,1,1,1,0,0],[1,0,1,0,0,0,1,1,1,0,1,0,0,1,1],[0,1,1,1,0,1,0,0,0,1,0,1,1,0,0],[1,1,0,1,1,1,0,1,1,0,1,0,0,1,0],[1,0,0,0,0,0,1,0,0,1,1,1,1,0,1],[0,0,1,1,1,0,0,0,0,0,0,0,1,1,1],[0,1,0,1,1,1,1,1,0,1,0,0,0,1,0],[1,1,1,0,1,1,0,0,1,1,1,1,0,0,1],[0,0,0,1,0,0,1,0,0,1,0,0,1,1,1],[1,0,1,0,0,1,0,0,1,1,0,1,0,1,0],[0,1,0,1,1,0,1,0,0,0,1,0,1,0,1]] }
      ]
  }

  let mainContainer
  let container
  let msg
  let grid
  let levelSol
  let currentPuzzleName = ""
  let currentPuzzleImg = ""
  let rows
  let cols
  let firstClickTime
  let intervalId = null
  let timerRunning = false
  let cellStates = []
  let currentLevel = ""
  let soundsOn = true
  let solutionUsed = false

  let audio = new Audio("sounds/test.mp3")
  function playSound() {
      if (soundsOn) audio.play()
  }
  function pad(n) {
      return n > 9 ? ("" + n) : ("0" + n)
  }
  function formatTime(s) {
      const m = Math.floor(s / 60)
      const r = s % 60
      return pad(m) + ":" + pad(r)
  }
  function updateTimer(s) {
      const t = document.getElementById('timerDisplay')
      if (t) t.textContent = formatTime(s)
  }

  function buildMiniGrid(finalState) {
      const rCount = finalState.length
      const cCount = finalState[0].length
      const totalSize = 40
      const container = document.createElement('div')
      container.style.width = totalSize + 'px'
      container.style.height = totalSize + 'px'
      container.style.position = 'relative'

      const cellW = totalSize / cCount
      const cellH = totalSize / rCount

      for (let r = 0; r < rCount; r++) {
          for (let c = 0; c < cCount; c++) {
              const val = finalState[r][c]
              const cell = document.createElement('div')
              cell.style.position = 'absolute'
              cell.style.left = (c * cellW) + 'px'
              cell.style.top = (r * cellH) + 'px'
              cell.style.width = cellW + 'px'
              cell.style.height = cellH + 'px'
              if (val === 1) {
                  cell.style.backgroundColor = 'black'
              } else if (val === 2) {
                  cell.style.backgroundColor = 'white'
                  cell.style.display = 'flex'
                  cell.style.alignItems = 'center'
                  cell.style.justifyContent = 'center'
                  cell.textContent = 'X'
                  cell.style.color = 'red'
                  cell.style.fontSize = '8px'
              } else {
                  cell.style.backgroundColor = 'white'
              }
              container.appendChild(cell)
          }
      }
      return container
  }

  function saveScore(puzzleName, puzzleImg, difficulty, time, finalState) {
      let arr = JSON.parse(localStorage.getItem("highScores") || "[]")
      arr = arr.filter(item => item && item.time && typeof item.time === "string" && item.time.includes(":"))

      if (arr.length === 5) {
          arr.pop()
      }
      const newEntry = {
          puzzleName,
          image: puzzleImg,
          difficulty,
          time,
          finalState
      }
      arr.unshift(newEntry)
      localStorage.setItem("highScores", JSON.stringify(arr))
  }

  function startInfiniteScrolling(ulElement) {
      let offset = 0
      let lastFrameTime = 0
      const speed = 20

      function animate(timestamp) {
          if (!lastFrameTime) lastFrameTime = timestamp
          const delta = (timestamp - lastFrameTime) / 1000
          lastFrameTime = timestamp

          offset -= speed * delta
          ulElement.style.top = offset + 'px'

          const firstLi = ulElement.firstElementChild
          if (firstLi) {
              const liHeight = firstLi.getBoundingClientRect().height
              if (-offset > liHeight) {
                  ulElement.removeChild(firstLi)
                  ulElement.appendChild(firstLi)
                  offset += liHeight
              }
          }
          requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
  }

  function renderHighScores(parent) {
      let arr = JSON.parse(localStorage.getItem("highScores") || "[]")
      if (!arr.length) return

      const sorted = arr.slice().sort((a, b) => {
          const [ma, sa] = a.time.split(":")
          const [mb, sb] = b.time.split(":")
          const secA = Number(ma) * 60 + Number(sa)
          const secB = Number(mb) * 60 + Number(sb)
          return secA - secB
      })

      const hsContainer = document.createElement('div')
      hsContainer.classList.add('hsContainer')
      parent.appendChild(hsContainer)

      const ul = document.createElement('ul')
      ul.classList.add('hsList')
      hsContainer.appendChild(ul)

      sorted.forEach(item => {
          const li = document.createElement('li')

          const mini = buildMiniGrid(item.finalState)
          li.appendChild(mini)

          const textSpan = document.createElement('span')
          textSpan.textContent = ` ${item.difficulty} - ${item.time}`
          li.appendChild(textSpan)

          ul.appendChild(li)
      })

      startInfiniteScrolling(ul)
  }

  function saveGame() {
      const elapsed = timerRunning ? Math.floor((Date.now() - firstClickTime) / 1000) : 0
      const st = {
          lvl: currentLevel,
          pImg: currentPuzzleImg,
          sol: levelSol,
          cs: cellStates,
          t: elapsed,
          sUsed: solutionUsed
      }
      localStorage.setItem("nonogramState", JSON.stringify(st))
  }

  function loadGame() {
      const raw = localStorage.getItem("nonogramState")
      if (!raw) return
      const st = JSON.parse(raw)
      if (!st) return

      currentLevel = st.lvl
      levelSol = st.sol
      currentPuzzleImg = st.pImg
      cellStates = st.cs
      solutionUsed = !!st.sUsed

      createPuzzle(levelSol, st.lvl, true)
      const elapsed = st.t
      firstClickTime = Date.now() - elapsed * 1000
      intervalId = setInterval(() => {
          const e = Math.floor((Date.now() - firstClickTime) / 1000)
          updateTimer(e)
      }, 1000)
      timerRunning = true
  }

  function createStartScreen() {
    mainContainer = document.createElement('div')
    mainContainer.style.display = 'flex'
    mainContainer.style.flexDirection = 'column'
    mainContainer.style.alignItems = 'center'
    content.appendChild(mainContainer)

    const game = document.createElement('h1')
    game.textContent = 'nonograms'
    mainContainer.appendChild(game)

    const title = document.createElement('h3')
    title.textContent = 'Choose level:'
    mainContainer.appendChild(title)

    const levelButtonsContainer = document.createElement('div')
    levelButtonsContainer.classList.add('diff__container')
    levelButtonsContainer.style.display = 'flex'
    levelButtonsContainer.style.gap = '10px'
    levelButtonsContainer.style.marginBottom = '10px'
    mainContainer.appendChild(levelButtonsContainer)

    const levels = ['easy', 'medium', 'hard']
    levels.forEach(l => {
        const b = document.createElement('button')
        b.classList.add('diff__btn')
        b.textContent = l
        b.style.margin = '0'
        b.addEventListener('click', () => startGame(l))
        levelButtonsContainer.appendChild(b)
    })

    const btnRnd = document.createElement('button')
    btnRnd.classList.add('diff__btn')
    btnRnd.textContent = 'random'
    btnRnd.style.margin = '0'
    btnRnd.addEventListener('click', () => {
        content.removeChild(mainContainer)
        randomPuzzle()
    })
    levelButtonsContainer.appendChild(btnRnd)

    const btnLoad = document.createElement('button')
    btnLoad.textContent = 'Continue last game'
    btnLoad.style.marginTop = '10px'
    btnLoad.addEventListener('click', () => {
        content.removeChild(mainContainer)
        loadGame()
    })
    mainContainer.appendChild(btnLoad)

    renderHighScores(mainContainer)
}


  function stopTimer() {
      clearInterval(intervalId)
      intervalId = null
      timerRunning = false
  }

  function randomPuzzle() {
      const allLvls = Object.keys(puzzleData)
      const rndLvl = allLvls[Math.floor(Math.random() * allLvls.length)]
      const arr = puzzleData[rndLvl]
      const obj = arr[Math.floor(Math.random() * arr.length)]
      levelSol = obj.puzzle
      currentPuzzleName = obj.name
      currentPuzzleImg = obj.image
      createPuzzle(levelSol, rndLvl)
  }

  function startGame(l) {
      content.removeChild(mainContainer)
      const arr = puzzleData[l]
      const obj = arr[Math.floor(Math.random() * arr.length)]
      levelSol = obj.puzzle
      currentPuzzleName = obj.name
      currentPuzzleImg = obj.image
      createPuzzle(levelSol, l)
  }

  function resetGame() {
      cellStates = []
      for (let r = 0; r < rows; r++) {
          cellStates[r] = []
          for (let c = 0; c < cols; c++) {
              cellStates[r][c] = 0
          }
      }
      const cs = grid.querySelectorAll('[data-row]')
      cs.forEach(el => {
          el.style.backgroundColor = '#fff'
          el.textContent = ''
      })
      msg.textContent = ''
      stopTimer()
  }

  function fillSolution() {
      for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
              const el = grid.querySelector('[data-row="'+r+'"][data-col="'+c+'"]')
              if (levelSol[r][c] === 1) {
                  el.style.backgroundColor = 'black'
                  el.textContent = ''
                  cellStates[r][c] = 1
              } else {
                  el.style.backgroundColor = '#fff'
                  el.textContent = ''
                  cellStates[r][c] = 0
              }
          }
      }
      msg.textContent = ''
      solutionUsed = true
  }

  function checkWin() {
      let w = true
      for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
              if (levelSol[r][c] === 1) {
                  if (cellStates[r][c] !== 1) w = false
              } else {
                  if (cellStates[r][c] === 1) w = false
              }
          }
      }
      if (w) {
          const currentTime = document.getElementById('timerDisplay').textContent
          stopTimer()
          if (solutionUsed) {
              msg.textContent = 'Great! BUT You have used the SOLUTION help'
              return
          }
          msg.textContent = 'Great! You have solved the nonogram in ' + currentTime
          soundController.playSound('win')

          const finalState = JSON.parse(JSON.stringify(cellStates))
          saveScore(currentPuzzleName, currentPuzzleImg, currentLevel, currentTime, finalState)
      }
  }

  class SoundController {
      constructor() {
          this.sounds = {
              black: new Audio('sounds/black.mp3'),
              x: new Audio('sounds/x.mp3'),
              win: new Audio('sounds/win.mp3')
          }
      }
      playSound(type) {
          if (this.sounds[type] && soundsOn) {
              this.sounds[type].currentTime = 0
              this.sounds[type].play()
          }
      }
  }

  const soundController = new SoundController()

  function createPuzzle(sol, level, fromLoad = false) {
      currentLevel = level

      container = document.createElement('div')
      container.style.display = 'flex'
      container.style.flexDirection = 'column'
      container.style.alignItems = 'center'
      content.appendChild(container)  // помещаем в .content

      msg = document.createElement('div')
      msg.style.margin = '20px'
      msg.style.fontSize = '1.2em'
      msg.style.color = 'green'
      container.appendChild(msg)

      const topBar = document.createElement('div')
      topBar.style.marginBottom = '10px'
      topBar.style.display = 'flex'
      topBar.style.gap = '10px'
      container.appendChild(topBar)

      const tDisp = document.createElement('div')
      // tDisp.style.margin = '10px' 
      tDisp.id = 'timerDisplay'
      tDisp.textContent = '00:00'
      topBar.appendChild(tDisp)

      const bSound = document.createElement('button')
      bSound.textContent = 'Sound on'
      bSound.addEventListener('click', () => {
          soundsOn = !soundsOn
          bSound.textContent = soundsOn ? 'Sound on' : 'Sound off'
      })
      topBar.appendChild(bSound)

      const bSave = document.createElement('button')
      bSave.textContent = 'Save game'
      bSave.addEventListener('click', () => {
          saveGame()
          playSound()
      })
      topBar.appendChild(bSave)

      const bSol = document.createElement('button')
      bSol.textContent = 'Solution'
      bSol.addEventListener('click', () => {
          fillSolution()
          playSound()
      })
      topBar.appendChild(bSol)

      rows = sol.length
      cols = sol[0].length

      const clLeft = []
      for (let r = 0; r < rows; r++) {
          clLeft.push(calcClues(sol[r]))
      }
      const clTop = []
      for (let c = 0; c < cols; c++) {
          const temp = []
          for (let r = 0; r < rows; r++) {
              temp.push(sol[r][c])
          }
          clTop.push(calcClues(temp))
      }

      const mt = Math.max(...clTop.map(a => a.length))
      const ml = Math.max(...clLeft.map(a => a.length))
      const totalCols = ml + cols

      const topWrap = document.createElement('div')
      topWrap.style.display = 'grid'
      topWrap.style.gridTemplateColumns = `repeat(${totalCols}, 30px)`
      topWrap.style.gridTemplateRows = `repeat(${mt}, 30px)`
      container.appendChild(topWrap)

      for (let row = 0; row < mt; row++) {
          for (let col = 0; col < totalCols; col++) {
              const ce = document.createElement('div')
              ce.style.width = '30px'
              ce.style.height = '30px'
              ce.style.display = 'flex'
              ce.style.alignItems = 'center'
              ce.style.justifyContent = 'center'
              ce.style.border = '1px solid #ddd'

              if (col < ml) {
                  ce.textContent = ''
              } else {
                  const i = col - ml
                  const arr = clTop[i]
                  const idx = arr.length - 1 - ((mt - 1) - row)
                  ce.textContent = (idx >= 0 && idx < arr.length) ? arr[idx] : ''
              }

              if ((col + 1) % 5 === 0 || col === ml - 1) {
                  ce.style.borderRightWidth = '3px'
              }
              if (row === mt - 1) {
                  ce.style.borderBottomWidth = '3px'
              }
              topWrap.appendChild(ce)
          }
      }

      const rowWrap = document.createElement('div')
      rowWrap.style.display = 'flex'
      container.appendChild(rowWrap)

      const leftWrap = document.createElement('div')
      leftWrap.style.display = 'grid'
      leftWrap.style.gridTemplateColumns = `repeat(${ml}, 30px)`
      leftWrap.style.gridTemplateRows = `repeat(${rows}, 30px)`
      rowWrap.appendChild(leftWrap)

      for (let rr = 0; rr < rows; rr++) {
          for (let cc = 0; cc < ml; cc++) {
              const ce = document.createElement('div')
              ce.style.width = '30px'
              ce.style.height = '30px'
              ce.style.display = 'flex'
              ce.style.alignItems = 'center'
              ce.style.justifyContent = 'center'
              ce.style.border = '1px solid #ddd'

              const arr = clLeft[rr]
              const i = arr.length - 1 - ((ml - 1) - cc)
              ce.textContent = (i >= 0 && i < arr.length) ? arr[i] : ''

              if ((rr + 1) % 5 === 0 || rr === rows - 1) {
                  ce.style.borderBottomWidth = '3px'
              }
              if ((cc + 1) % 5 === 0 || cc === ml - 1) {
                  ce.style.borderRightWidth = '3px'
              }
              leftWrap.appendChild(ce)
          }
      }

      grid = document.createElement('div')
      grid.style.display = 'grid'
      grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`
      grid.style.gridTemplateRows = `repeat(${rows}, 30px)`
      grid.style.border = '1px solid #000'
      rowWrap.appendChild(grid)

      if (!fromLoad) {
          cellStates = []
          for (let i = 0; i < rows; i++) {
              cellStates[i] = []
              for (let j = 0; j < cols; j++) {
                  cellStates[i][j] = 0
              }
          }
      }

      for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
              const ce = document.createElement('div')
              ce.style.width = '30px'
              ce.style.height = '30px'
              ce.style.border = '1px solid #ccc'
              ce.style.fontSize = '1.2em'
              ce.style.color = '#22aa22'
              ce.style.fontWeight = 'bold'
              ce.style.display = 'flex'
              ce.style.alignItems = 'center'
              ce.style.justifyContent = 'center'
              ce.style.cursor = 'pointer'
              ce.dataset.row = r
              ce.dataset.col = c

              if ((r + 1) % 5 === 0 || r === rows - 1) {
                  ce.style.borderBottomWidth = '3px'
              }
              if ((c + 1) % 5 === 0 || c === cols - 1) {
                  ce.style.borderRightWidth = '3px'
              }

              if (cellStates[r][c] === 1) {
                  ce.style.backgroundColor = 'black'
              } else if (cellStates[r][c] === 2) {
                  ce.style.backgroundColor = '#fff'
                  ce.textContent = 'x'
              } else {
                  ce.style.backgroundColor = '#fff'
                  ce.textContent = ''
              }

              ce.addEventListener('mousedown', e => {
                  if (!timerRunning) {
                      firstClickTime = Date.now()
                      intervalId = setInterval(() => {
                          const elapsed = Math.floor((Date.now() - firstClickTime) / 1000)
                          updateTimer(elapsed)
                      }, 1000)
                      timerRunning = true
                  }

                  if (e.button === 0) {
                      if (cellStates[r][c] === 1) {
                          cellStates[r][c] = 0
                          ce.style.backgroundColor = '#fff'
                          ce.textContent = ''
                          playSound()
                      } else {
                          cellStates[r][c] = 1
                          ce.style.backgroundColor = 'black'
                          ce.textContent = ''
                          soundController.playSound('black')
                      }
                      checkWin()
                  } else if (e.button === 2) {
                      e.preventDefault()
                      if (cellStates[r][c] === 2) {
                          cellStates[r][c] = 0
                          ce.style.backgroundColor = '#fff'
                          ce.textContent = ''
                          playSound()
                      } else {
                          cellStates[r][c] = 2
                          ce.style.backgroundColor = '#fff'
                          ce.textContent = 'X'
                          soundController.playSound('x')
                      }
                  }
              })
              ce.addEventListener('contextmenu', e => e.preventDefault())
              grid.appendChild(ce)
          }
      }

      const btnRow = document.createElement('div')
      btnRow.style.display = 'flex'
      btnRow.style.gap = '10px'
      btnRow.style.marginTop = '20px'
      container.appendChild(btnRow)

      const resetBtn = document.createElement('button')
      resetBtn.textContent = 'Reset'
      resetBtn.addEventListener('click', () => {
          resetGame()
          playSound()
      })
      btnRow.appendChild(resetBtn)

      const mainBtn = document.createElement('button')
      mainBtn.textContent = 'Main menu'
      mainBtn.addEventListener('click', () => {
          solutionUsed = false
          stopTimer()
          firstClickTime = 0
          updateTimer(0)
          content.removeChild(container)
          createStartScreen()
      })
      btnRow.appendChild(mainBtn)
  }

  // Старт
  createStartScreen()
})
