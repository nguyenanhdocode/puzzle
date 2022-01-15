const BOARD_WIDTH = 560
const BOARD_HEIGHT = 560
var rows = 0
var cols = 0
var piece_width = 0
var piece_height = 0

var imageSrc = ''
var image = document.createElement('img')
var boardMatrix = []
var pieces = []

var container = document.getElementById('container')
var play = document.getElementById('play')
var board = document.getElementById('board')
var selectedIndex = []
var moved = 0


// Load image
var imagesDiv = document.getElementById('images')
var formTitle = document.getElementById('form-title')
var form = document.getElementById('form')
var sizeDiv = document.getElementById('size')
for (let i = 1; i <= 4; i++) {
    let img = document.createElement('img')
    img.src = `images/${i}.jpg`
    img.classList.add('images-item')
    imagesDiv.appendChild(img)
    img.onclick = function(e) {
        var src = e.target.getAttribute('src')
        imageSrc = src
        imagesDiv.style.display = 'none'
        formTitle.innerText = 'Choose board size to start'
        sizeDiv.style.display = 'flex'
    }
}


for (let i = 0; i < sizeDiv.childNodes.length; i++) {
    sizeDiv.childNodes[i].onclick = function(e) {
        var r = parseInt(e.target.getAttribute('r'))
        var c = parseInt(e.target.getAttribute('c'))
        rows = r
        cols = c
        selectedIndex = [rows - 1, cols - 2]
        piece_width = BOARD_WIDTH / cols
        piece_height = BOARD_HEIGHT / rows

        document.getElementById('img-preview').setAttribute('src', imageSrc)

        play.style.display = 'block'
        form.style.display = 'none'

        startGame()
    }
}


function startGame() {
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
        whitePiece.style.width = `${piece_width - 3}px`
        whitePiece.style.height = `${piece_height - 3}px`
        boardMatrix[rows - 1][cols - 1] = whitePiece
        boardMatrix[selectedIndex[0]][selectedIndex[1]].classList
        .add('selected')

        draw()
    }

    document.onkeydown = function(e) {
        /**
         * UP:      38
         * DOWN:    40
         * LEFT:    37
         * RIGHT:   39
         */
        var prevIndex = [selectedIndex[0], selectedIndex[1]]
        switch(e.which) {
            case 38: {
                moveFrame('UP')
                if (e.ctrlKey) {
                    swapPiece(prevIndex, selectedIndex)
                    draw()
                }
                break
            }
            case 40: {
                moveFrame('DOWN')
                if (e.ctrlKey) {
                    swapPiece(prevIndex, selectedIndex)
                    draw()
                }
                break
            }
            case 37: {
                moveFrame('LEFT')
                if (e.ctrlKey) {
                    swapPiece(prevIndex, selectedIndex)
                    draw()
                }
                break
            }
            case 39: {
                moveFrame('RIGHT')
                if (e.ctrlKey) {
                    swapPiece(prevIndex, selectedIndex)
                    draw()
                }
                break
            }
            default:
                break
        }
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
                canvas.width = piece_width
                canvas.height = piece_height
                var context = canvas.getContext('2d')
                context.drawImage(image, c * piece_width, r * piece_height, piece_width, piece_height, 0, 0, canvas.width, canvas.height)
                console.log(canvas)
                let img = document.createElement('img')
                img.src = canvas.toDataURL()
                img.style.width = `${piece_width -3}px`
                img.style.height = `${piece_height - 3}px`
                img.id = `${r}${c}`
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



function moveFrame(dir) {
    var prevPiece = boardMatrix[selectedIndex[0]][selectedIndex[1]]
    switch(dir) {
        case 'RIGHT': {
            if (selectedIndex[1] + 1 < cols) {
                selectedIndex[1] += 1
            }
            else {
                selectedIndex[1] = 0
            }
            break
        }
        case 'LEFT': {
            if (selectedIndex[1] - 1 >= 0) {
                selectedIndex[1] -= 1
            }
            else {
                selectedIndex[1] = cols - 1
            }
            break
        }
        case 'UP': {
            if (selectedIndex[0] - 1 >= 0) {
                selectedIndex[0] -= 1
            }
            else {
                selectedIndex[0] = rows - 1
            }
            break
        }
        case 'DOWN': {
            if (selectedIndex[0] + 1 < rows) {
                selectedIndex[0] += 1
            }
            else {
                selectedIndex[0] = 0
            }
            break
        }
        default:
            break
    }

    var nextPiece = boardMatrix[selectedIndex[0]][selectedIndex[1]]

    prevPiece.classList.remove('selected')
    nextPiece.classList.add('selected')
}


function swapPiece(from, to) {
    var movedPiece = boardMatrix[from[0]][from[1]]
    var whitePiece = boardMatrix[to[0]][to[1]]

    if (boardMatrix[to[0]][to[1]].id == 'white-piece') {

        var tmp = boardMatrix[from[0]][from[1]]
        boardMatrix[from[0]][from[1]] = boardMatrix[to[0]][to[1]]
        boardMatrix[to[0]][to[1]] = tmp
    
        movedPiece.classList.add('selected')
        whitePiece.classList.remove('selected')

        moved += 1

        document.getElementById('moved').innerText = `Move: ${moved}`
    }

}