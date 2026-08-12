const socket = io()

const chess = new Chess()
const boardElement = document.querySelector('.chessBoard')

let draggedPiece = null
let sourceSquare = null
let playerRole = null

const pieceMap = {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚'
}

const getPieceUnicode = type => pieceMap[type.toLowerCase()] || ''

const renderBoard = () => {
    const board = chess.board()
    boardElement.innerHTML = ''
    board.forEach((row, rowIndex) => {  
        row.forEach((piece, colIndex) => {
            const squareElement = document.createElement('div')
            const isLight = (rowIndex + colIndex) % 2 === 0
            squareElement.classList.add('square', isLight ? 'light' : 'dark')
            squareElement.dataset.row = rowIndex
            squareElement.dataset.col = colIndex    

            squareElement.addEventListener('dragover', (e) => e.preventDefault())

            squareElement.addEventListener('drop', (e) => {
                e.preventDefault()
                if (draggedPiece && sourceSquare) {
                    const targetSquare = { row: parseInt(squareElement.dataset.row), col: parseInt(squareElement.dataset.col) }
                    const move = {
                        from: `${String.fromCharCode(97 + sourceSquare.col)}${8 - sourceSquare.row}`,
                        to: `${String.fromCharCode(97 + targetSquare.col)}${8 - targetSquare.row}`,
                        promotion: 'q'
                    }
                    socket.emit('move', move)
                    // optimistic local move for immediate UI update
                    chess.move({ from: move.from, to: move.to, promotion: 'q' })
                    renderBoard()
                }
            })

            if (piece) {
                const pieceElement = document.createElement('div')
                pieceElement.classList.add('piece')
                pieceElement.textContent = getPieceUnicode(piece.type)
                pieceElement.draggable = true

                // ensure piece text contrasts with square background
                pieceElement.style.color = isLight ? '#111827' : '#f8fafc'

                // subtle background to indicate piece color (white vs black)
                if (piece.color === 'w') {
                    pieceElement.style.background = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)'
                } else {
                    pieceElement.style.background = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.6)'
                }

                pieceElement.addEventListener('dragstart', (e) => {
                    draggedPiece = pieceElement
                    sourceSquare = { row: rowIndex, col: colIndex }
                    try { e.dataTransfer.setData('text/plain', '') } catch (err) { /* some browsers restrict setData on dragstart */ }
                })
                pieceElement.addEventListener('dragend', () => {
                    draggedPiece = null
                    sourceSquare = null
                })
                squareElement.appendChild(pieceElement)
            }

            boardElement.appendChild(squareElement)
        })
    })
}

renderBoard()

const handleMove = (move) => {
    try {
        // try to apply move locally; if invalid, request boardState from server
        const result = chess.move(move)
        if (result) renderBoard()
        else console.warn('Client: invalid move received', move)
    } catch (err) {
        console.error('Error applying move:', err)
    }
}

socket.on('move', (move) => {
    handleMove(move)
})

socket.on('boardState', (fen) => {
    try {
        chess.load(fen)
        renderBoard()
    } catch (err) {
        console.error('Invalid FEN from server:', fen)
    }
})

socket.on('playerRole', (role) => {
    // server sends 'W' or 'B'
    playerRole = role === 'W' ? 'w' : 'b'
})

socket.on('invalidMove', (msg) => {
    console.warn('Move rejected:', msg)
    // request authoritative board state
    socket.emit('requestBoard')
})