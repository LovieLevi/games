from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Game settings
ROWS = 6
COLUMNS = 7
EMPTY = 0
PLAYER_1 = 1
PLAYER_2 = 2

# Initialize the game board
board = [[EMPTY for _ in range(COLUMNS)] for _ in range(ROWS)]
current_player = PLAYER_1
game_over = False  # Track if the game is over (win or draw)

# Function to check if the column is full
def is_valid_column(column):
    return board[0][column] == EMPTY

# Function to place the player's move in the board
def place_move(column, player):
    for row in range(ROWS - 1, -1, -1):
        if board[row][column] == EMPTY:
            board[row][column] = player
            return row, column
    return None

# Function to check for a winning condition (horizontally, vertically, diagonally)
def check_win(player):
    # Check horizontal
    for row in range(ROWS):
        for col in range(COLUMNS - 3):
            if all(board[row][col + i] == player for i in range(4)):
                return True

    # Check vertical
    for row in range(ROWS - 3):
        for col in range(COLUMNS):
            if all(board[row + i][col] == player for i in range(4)):
                return True

    # Check positively sloped diagonal
    for row in range(ROWS - 3):
        for col in range(COLUMNS - 3):
            if all(board[row + i][col + i] == player for i in range(4)):
                return True

    # Check negatively sloped diagonal
    for row in range(3, ROWS):
        for col in range(COLUMNS - 3):
            if all(board[row - i][col + i] == player for i in range(4)):
                return True

    return False

# Function to check if the board is full (draw condition)
def is_board_full():
    return all(board[0][col] != EMPTY for col in range(COLUMNS))

# Function to reset the game board
def reset_board():
    global board, current_player, game_over
    board = [[EMPTY for _ in range(COLUMNS)] for _ in range(ROWS)]
    game_over = False
    current_player = PLAYER_1

# POST endpoint to handle player moves
@app.route('/move', methods=['POST'])
def make_move():
    global current_player, game_over

    # If the game is already over, don't allow moves
    if game_over:
        return jsonify({'error': 'Game over!'}), 400

    # Get the column from the request
    data = request.get_json()
    column = data.get('column')

    if column is None or not (0 <= column < COLUMNS):
        return jsonify({'error': 'Invalid column'}), 400

    # Check if the column is valid (not full)
    if not is_valid_column(column):
        return jsonify({'error': 'Column is full'}), 400

    # Place the player's move
    row, col = place_move(column, current_player)
    
    # Check for a win condition
    if check_win(current_player):
        winner = current_player
        game_over = True  # Mark the game as over
        return jsonify({
            'message': f'Player {winner} wins!',
            'board': board,
            'game_over': True,
            'current_player': current_player
        })

    # Check for a draw condition
    if is_board_full():
        game_over = True  # Mark the game as over
        return jsonify({
            'message': 'The game is a draw!',
            'board': board,
            'game_over': True,
            'current_player': current_player
        })

    # Switch player
    current_player = PLAYER_1 if current_player == PLAYER_2 else PLAYER_2

    return jsonify({
        'message': '',
        'board': board,
        'game_over': False,
        'current_player': current_player
    })

# GET endpoint to get the current board state
@app.route('/board', methods=['GET'])
def get_board():
    return jsonify({'board': board, 'current_player': current_player})

# POST endpoint to reset the game
@app.route('/reset', methods=['POST'])
def reset_game():
    reset_board()
    return jsonify({'message': 'Game has been reset.', 'board': board})

if __name__ == '__main__':
    app.run(debug=True, port=5454)

