import { useState, useEffect } from "react";
import "./4Row.scss";

const BOARD_API_URL = "https://games.lovie.dev/api/board";
const MOVE_API_URL = "https://games.lovie.dev/api/move";
const RESET_API_URL = "https://games.lovie.dev/api/reset";
type Board = number[][];

export const Game4Row = () => {
  // State to store the game board and current player
  const [board, setBoard] = useState<Board>(Array(6).fill(Array(7).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch the initial board state when the component loads
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch(BOARD_API_URL);
        const data = await response.json();
        setBoard(data.board);
        setCurrentPlayer(data.current_player);
        setGameOver(data.game_over);
      } catch (error) {
        console.error("Error fetching board:", error);
        setMessage("Failed to load board.");
      }
    };
    fetchBoard();
  }, []);

  // Poll for board updates every few seconds to check for the opponent's move
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(BOARD_API_URL);
        const data = await response.json();

        // Check if the board has been updated (compare with current board)
        if (JSON.stringify(data.board) !== JSON.stringify(board)) {
          setBoard(data.board);
          setCurrentPlayer(data.current_player);
          setGameOver(data.game_over);
          if (data.game_over) {
            setMessage(data.message);
          }
        }
      } catch (error) {
        console.error("Error polling for board updates:", error);
        setMessage("Error checking for opponent's move.");
      }
    }, 1000); // Poll every 3 seconds

    // Clear interval when component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [board, gameOver]);

  // Handle player move when a cell is clicked
  const handleCellClick = async (columnIndex: number) => {
    if (gameOver) {
      setMessage("The game is over. Please reset to start a new game.");
      return;
    }

    try {
      const response = await fetch(MOVE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ column: columnIndex }),
      });
      const data = await response.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setBoard(data.board);
        setMessage(data.message);
        setGameOver(data.game_over);
        setCurrentPlayer(data.current_player);
      }
    } catch (error) {
      console.error("Error making move:", error);
      setMessage("Failed to make a move.");
    }
  };

  // Reset the game
  const handleReset = async () => {
    try {
      const response = await fetch(RESET_API_URL, { method: "POST" });
      const data = await response.json();
      setMessage(data.message);
      setBoard(data.board);
      setGameOver(false);
    } catch (error) {
      console.error("Error resetting game:", error);
      setMessage("Failed to reset the game.");
    }
  };

  // Render the game board
  const renderBoard = () => {
    return board.map((row, rowIndex: number) => (
      <tr key={rowIndex}>
        {row.map((cell: number, colIndex: number) => (
          <td
            key={colIndex}
            className={`cell player-${cell}`}
            onClick={() => handleCellClick(colIndex)}
          >
            {cell === 1 ? <div className="cell-black" /> : cell === 2 ? <div className="cell-red" /> : ""}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <h1>4 in a Row</h1>
      {/* {message && <h2 className="message">{message}</h2>} */}
      <h2 className="message">{message}</h2>
      <p>Current Player: {currentPlayer === 1 ? "⚫" : "🔴"}</p>
      <button onClick={handleReset}>Reset Game</button>

      <table className="game-board">
        <tbody>{renderBoard()}</tbody>
      </table>
    </>
  );
};
