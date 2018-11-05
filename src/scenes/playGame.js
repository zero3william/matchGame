import { iconArr } from './loading';
import { gameOptions, game } from '../index';
export class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  create() {
    // init Board Start
    this.boardArray = [];
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        const tilePosition = this.getTilePosition(i, j);
        const random = this.getRandom(iconArr.length);
        const tile = this.add.image(
          tilePosition.x,
          tilePosition.y - game.config.height,
          iconArr[random]
        );
        this.boardArray[i][j] = {
          rowIndex: i,
          colIndex: j,
          x: tilePosition.x,
          y: tilePosition.y,
          tile: tile,
          type: random
        };
        this.tweens.add({
          targets: tile,
          y: tilePosition.y,
          scaleX: 1.1,
          scaleY: 1.1,
          angle: 360,
          duration: gameOptions.dropSpeed,
          ease: 'Phaser.Easing.Bounce.Out',
          repeat: 0,
          delay:
            gameOptions.dropDelay *
              gameOptions.boardSize.cols *
              (gameOptions.boardSize.rows - i - 1) +
            gameOptions.dropDelay * j
        });
      }
    }
    // init Board End
    this.input.on('pointerdown', this.touchStartOnTile);
  }

  touchStartOnTile(e) {
    const scene = this.scene;
    let board = scene.getTileByPosition(e.x, e.y);
    const tile = board.tile;

    // click tile animate
    scene.tweens.add({
      targets: tile,
      scaleX: 1.3,
      scaleY: 1.3,
      yoyo: true,
      duration: 100
    });

    //drag tile
    scene.input.on('pointermove', function(e) {
      const _board = scene.getTileByPosition(e.x, e.y);
      const _tile = _board.tile;
      if (tile != _tile) {
        board.tile = _tile;
        _board.tile = tile;
        board = _board;
        scene.updateBoard();
      }
    });

    //pointer leave canvas (drop tile)
    const ctx = document.getElementById('gameContainer');
    const onceMouseleave = function() {
      scene.matchCheck();
      scene.input.off('pointermove');
      scene.input.off('pointerup');
      ctx.removeEventListener('mouseleave', onceMouseleave, false);
    };
    ctx.addEventListener('mouseleave', onceMouseleave, false);

    //drop tile
    scene.input.on('pointerup', function() {
      scene.matchCheck();
      scene.input.off('pointermove');
      scene.input.off('pointerup');
      ctx.removeEventListener('mouseleave', onceMouseleave, false);
    });
  }

  matchCheck() {
    const boardArray = this.boardArray;

    const rowSize = gameOptions.boardSize.row;
    const colSize = gameOptions.boardSize.col;

    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
        //todo
        // const length = scanPos(i, j, boardArray[i][j].type, 0);
      }
    }
  }

  scanPos(row, col, type, length) {
    //todo
    return 0;
  }

  updateBoard() {
    this.boardArray.forEach(row => {
      row.forEach(board => {
        this.tweens.add({
          targets: board.tile,
          x: board.x,
          y: board.y,
          duration: 100
        });
      });
    });
  }

  getTilePosition(row, col) {
    let posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    let posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);
    let boardHeight = gameOptions.boardSize.rows * gameOptions.tileSize;
    boardHeight += (gameOptions.boardSize.rows + 1) * gameOptions.tileSpacing;
    let offsetY = game.config.height - boardHeight;
    posY += offsetY;
    return new Phaser.Geom.Point(posX, posY);
  }

  getTileByPosition(x, y) {
    let rowIndex = false;
    let colIndex = false;
    rowIndex = this.boardArray.findIndex(row => {
      colIndex = row.findIndex(item => {
        if (
          item.y - gameOptions.tileSize * 0.5 > y ||
          item.y + gameOptions.tileSize * 0.5 < y
        ) {
          return true;
        }
        if (
          item.x - gameOptions.tileSize * 0.5 < x &&
          item.x + gameOptions.tileSize * 0.5 >= x
        ) {
          rowIndex = true;
          return true;
        }
      });
      return rowIndex;
    });
    return rowIndex === false ? false : this.boardArray[rowIndex][colIndex];
  }

  getRandom(max, min = 0) {
    return Math.floor(Math.random() * max) + min;
  }
}
