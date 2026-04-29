import { useState } from 'react';

const Player = {
    NONE: '',
    X: 'X',
    Y: 'Y',
} as const;
type Player = (typeof Player)[keyof typeof Player];

interface GameTile {
    owner: Player;

    claimTile(this: GameTile, newOwner: Player): boolean;
    validClaim(this: GameTile, newOwner: Player): boolean;
    getOwner(this: GameTile): Player;
    resetOwner(this: GameTile): void;
    getIndex(this: GameTile): number;
}

interface GameState {
    curPlayer: Player;
    board: Array<GameTile>;
    claimTile(this: GameState, index: number): boolean;
    validClaim(this: GameState, index: number): boolean;
    resetGame(this: GameState): void;
    getCurPlayer(this: GameState): Player;
    isGameOver(this: GameState): boolean;
    getWinner(this: GameState): Player;
    nextPlayer(this: GameState): void;
    getBoard(this: GameState): Array<GameTile>;
}

class TicTacToeTile implements GameTile {
    owner: Player;
    index: number;

    constructor(index: number) {
        this.owner = Player.NONE;
        this.index = index;
    }

    // If tile can be claimed by this player, claim it
    claimTile(newOwner: Player) {
        // If valid claim
        if (this.validClaim(newOwner)) {
            this.owner = newOwner;
            return true;
        }
        //  Otherwise, invalid claim
        return false;
    }

    // Verify if this tile can be claimed by a player
    validClaim(_newOwner: Player) {
        return this.owner == Player.NONE;
    }

    // Get the owner of a tile
    getOwner() {
        return this.owner;
    }

    // Reset owner of tile
    resetOwner() {
        this.owner = Player.NONE;
    }

    // Get index of tile
    getIndex() {
        return this.index;
    }
}

class TicTacToeState implements GameState {
    curPlayer: Player;
    board: Array<TicTacToeTile>;

    constructor() {
        this.curPlayer = Player.X;
        this.board = Array.from(
            { length: 9 },
            (_, index) => new TicTacToeTile(index),
        );
    }

    claimTile(this: GameState, index: number) {
        // If move is valid, allow current player to claim tile
        if (this.validClaim(index)) {
            // Swap to next player
            this.nextPlayer();
            // Return that claim was successful
            return true;
        }
        // Otherwise, claim unsuccessful
        return false;
    }
    validClaim(this: GameState, index: number) {
        // If the index is out of bounds, claim is invalid
        if (index < 0 || index >= this.board.length) {
            return false;
        }
        // Otherwise, check with specific piece if claim is valid
        return this.board[index].claimTile(this.curPlayer);
    }
    resetGame(this: GameState) {
        this.curPlayer = Player.X;
        for (let tile of this.board) {
            tile.resetOwner();
        }
    }
    getCurPlayer(this: GameState) {
        return this.curPlayer;
    }
    isGameOver(this: GameState) {
        // If there is a winner, the game is over
        if (this.getWinner() != Player.NONE) {
            return true;
        }
        // If there is no winner, the only way the game is over is if all tiles are claimed
        for (const tile of this.board) {
            if (tile.getOwner() == Player.NONE) {
                return false;
            }
        }
        return true;
    }
    getWinner(this: GameState) {
        // Shorthand storage for victory check
        let victoryChecks: Array<{
            startIndices: Array<number>;
            offset: number;
        }> = [
            { startIndices: [0, 3, 6], offset: 1 },
            { startIndices: [0, 1, 2], offset: 3 },
            { startIndices: [0, 2], offset: 4 },
        ];

        // For each victory check
        for (const victoryCheck of victoryChecks) {
            // For each "set of 3" on the board
            for (const startIndex of victoryCheck.startIndices) {
                // If a player has 3 in a row
                if (
                    this.board[startIndex].getOwner() ===
                        this.board[
                            startIndex + victoryCheck.offset
                        ].getOwner() &&
                    this.board[startIndex + victoryCheck.offset].getOwner() ===
                        this.board[
                            startIndex + victoryCheck.offset * 2
                        ].getOwner() &&
                    this.board[startIndex].getOwner() != Player.NONE
                ) {
                    // Return this player
                    return this.board[startIndex].owner;
                }
            }
        }

        // Otherwise, currently no winner
        return Player.NONE;
    }
    // Cycle to next player
    nextPlayer() {
        this.curPlayer = this.curPlayer == Player.X ? Player.Y : Player.X;
    }
    // Get the game board
    getBoard() {
        return this.board;
    }
}

function TicTacToeTileDisplay({
    tileInfo,
    claimTile,
}: {
    tileInfo: TicTacToeTile;
    claimTile: (index: number) => boolean;
}) {
    return (
        <>
            <button
                className="ttt_button"
                onClick={() => claimTile(tileInfo.getIndex())}
            >
                {tileInfo.getOwner() == Player.NONE
                    ? ''
                    : tileInfo.getOwner().toString()}
            </button>
        </>
    );
}

function TicTacToeBoardDisplay({
    board,
    claimTile,
}: {
    board: Array<TicTacToeTile>;
    claimTile: (index: number) => boolean;
}) {
    return (
        <>
            {[0, 1, 2].map((row) => (
                <div className="ttt_row" key={row}>
                    {board.slice(row * 3, row * 3 + 3).map((tile) => (
                        <TicTacToeTileDisplay
                            key={tile.getIndex()}
                            tileInfo={tile}
                            claimTile={claimTile}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

function App() {
    const [gameState, setGameState] = useState(new TicTacToeState());

    const handleClaimTile = (index: number) => {
        console.log(gameState.claimTile(index));
        setGameState(gameState);
        return true;
    };

    return (
        <>
            <TicTacToeBoardDisplay
                board={gameState.getBoard()}
                claimTile={handleClaimTile}
            />
        </>
    );
}

export default App;
