const BOARD_WIDTH = 560
const BOARD_HEIGHT = 560
var rows = 3
var cols = 3
const PIECE_WIDTH = BOARD_WIDTH / cols
const PIECE_HEIGHT = BOARD_HEIGHT / rows

var imageSrc = 'images/1.jpg'
var image
var boardMatrix = []
var pieces = []

var rootElement
var board


layoutInitialize()

startGame()


function layoutInitialize() {
    rootElement = document.getElementById('root')

    var playPage = document.createElement('div')
    playPage.id = 'play'

    rootElement.appendChild(playPage)
    
    var title = document.createElement('h1')
    title.id = 'title'
    title.innerText = 'Puzzle'
    playPage.appendChild(title)

    board = document.createElement('div')
    board.id = 'board'
    playPage.appendChild(board)

}

function startGame() {
    image = document.createElement('img')
    image.src = imageSrc

    
    image.onload = function() {
        pieces = shuffle(createPieces())
        var i = 0
        for (let r = 0; r < rows; r++) {
            let row = []
            for (let c = 0; c < cols; c++) {
                row.push(pieces[i])
                i += 1
            }
            boardMatrix.push(row)
        }

        var whitePiece = document.createElement('div')
        whitePiece.id = 'white-piece'
        whitePiece.classList.add('piece')
        whitePiece.style.display = 'inline-block'
        whitePiece.style.width = `${PIECE_WIDTH}px`
        whitePiece.style.height = `${PIECE_HEIGHT}px`
        boardMatrix[rows - 1][cols - 1] = whitePiece

        draw()
    }

}


// Tạo các mảnh ghép từ ảnh lớn
function createPieces() {
    var pieces = []
    var count = 1
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            if (count <= (rows * cols - 1)){
                var canvas = document.createElement('canvas')
                canvas.width = PIECE_WIDTH
                canvas.height = PIECE_HEIGHT
                var context = canvas.getContext('2d')
                context.drawImage(image, c * PIECE_WIDTH, r * PIECE_HEIGHT, PIECE_WIDTH, PIECE_HEIGHT, 0, 0, canvas.width, canvas.height)
                
                var img = document.createElement('img')
                img.src = canvas.toDataURL()
                img.classList.add(...['piece',])
                pieces.push(img)
            }

            count += 1
        }
    }

    
    return pieces

}


// Xáo trộn mảng
function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}


function draw() {
    board.innerHTML = ''
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            board.appendChild(boardMatrix[r][c])
        }
    }
}