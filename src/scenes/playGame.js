import { iconArr } from './loading';
import { gameOptions, game } from '../index';

const initScale = 1.1;
let boardArray = [];
let comboText;
let comboCount = 0;

export class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  create() {
    console.log(game);
    this.add
      .image(game.canvas.width / 2, game.canvas.height / 2, 'bg')
      .setScale(gameOptions.boardWidth / 450)
      .setAlpha(0.2);

    this.initBoard();
    this.canMove = true;

    comboText = this.add.text(
      gameOptions.offsetX + 30,
      (game.canvas.height - gameOptions.boardWidth * gameOptions.aspectRatio) /
        2 +
        50,
      '',
      {
        fontSize: '20px',
        fill: '#000'
      }
    );

    //listen event
    this.input.on('gameobjectdown', this.touchStartOnTile);
  }

  initBoard() {
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      boardArray[i] = [];
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        const tilePosition = this.getTilePosition(i, j);
        const random = this.getRandom(iconArr.length);
        const tile = this.add.image(
          tilePosition.x,
          tilePosition.y - game.config.height,
          iconArr[random]
        );
        tile.setInteractive();
        boardArray[i][j] = {
          rowIndex: i,
          colIndex: j,
          x: tilePosition.x,
          y: tilePosition.y,
          tile: tile
        };
        this.tweens.add({
          targets: tile,
          y: tilePosition.y,
          scaleX: initScale,
          scaleY: initScale,
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
  }

  touchStartOnTile(e, obj) {
    const scene = this.scene;

    //isTweening
    if (!scene.canMove) {
      return 0;
    }

    let board = scene.getTileByPosition(e.x, e.y);
    const tile = board.tile;

    // click tile animate
    scene.tweens.add({
      targets: tile,
      scaleX: initScale + 0.2,
      scaleY: initScale + 0.2,
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
        scene.swapTween();
      }
    });

    //pointer leave canvas (drop tile)
    const ctx = document.getElementById('gameContainer');
    const onceMouseleave = function() {
      scene.matchCheck(scene, 1);
      scene.input.off('pointermove');
      scene.input.off('pointerup');
      ctx.removeEventListener('mouseleave', onceMouseleave, false);
    };
    ctx.addEventListener('mouseleave', onceMouseleave, false);

    //drop tile
    scene.input.on('pointerup', function() {
      scene.matchCheck(scene, 1);
      scene.input.off('pointermove');
      scene.input.off('pointerup');
      ctx.removeEventListener('mouseleave', onceMouseleave, false);
    });
  }

  matchCheck(scene, comboTime) {
    scene.canMove = false;
    let isMatched = false;
    const rowSize = gameOptions.boardSize.rows;
    const colSize = gameOptions.boardSize.cols;

    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
        const hLength = this.scanRight(i, j, 1);
        if (hLength >= 3) {
          isMatched = true;
          for (let count = 0; count < hLength; count++) {
            boardArray[i][j + count].tile.active = false;
          }
        }
        const vLength = this.scanDown(i, j, 1);
        if (vLength >= 3) {
          isMatched = true;
          for (let count = 0; count < vLength; count++) {
            boardArray[i + count][j].tile.active = false;
          }
        }
      }
    }
    if (isMatched) {
      //start Tween
      comboText.visible = true;
      this.matchTween(boardArray, scene, comboTime);
    } else {
      //end Tween , continue game
      setTimeout(() => {
        comboText.visible = false;
      }, 1000);
      scene.canMove = true;
    }
  }

  matchTween(boardArray, scene, comboTime) {
    const rowSize = gameOptions.boardSize.rows;
    const colSize = gameOptions.boardSize.cols;

    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < colSize; j++) {
        if (boardArray[i][j].tile.active === false) {
          const tile = boardArray[i][j].tile;
          //clear matched tile
          scene.tweens.add({
            targets: tile,
            scaleX: 0,
            scaleY: 0,
            duration: gameOptions.dropSpeed
          });

          comboText.setText(`${comboTime} combo!!`);
          // comboText.style.fontSize = `${30 + comboTime}px`;
          console.log(comboText);

          //fall all the tile on this matched tile
          for (
            let k = i;
            k > 0 && boardArray[k - 1][j].tile.active !== false;
            k--
          ) {
            boardArray[k][j].tile = boardArray[k - 1][j].tile;
            scene.tweens.add({
              targets: boardArray[k - 1][j].tile,
              y: boardArray[k][j].y,
              duration: gameOptions.dropSpeed
            });
            boardArray[k - 1][j].tile = tile;
          }
        }
      }
    }

    setTimeout(function() {
      scene.dropNewTileOnBoard();
    }, gameOptions.dropSpeed);
    setTimeout(function() {
      scene.matchCheck(scene, comboTime + 1);
    }, gameOptions.dropSpeed * 2);
  }

  scanRight(row, col, length) {
    if (
      col + 1 === gameOptions.boardSize.cols ||
      boardArray[row][col].tile.texture.key !==
        boardArray[row][col + 1].tile.texture.key
    ) {
      return length;
    } else {
      return this.scanRight(row, col + 1, length + 1);
    }
  }

  scanDown(row, col, length) {
    if (
      row + 1 === gameOptions.boardSize.rows ||
      boardArray[row][col].tile.texture.key !==
        boardArray[row + 1][col].tile.texture.key
    ) {
      return length;
    } else {
      return this.scanDown(row + 1, col, length + 1);
    }
  }

  swapTween() {
    boardArray.forEach(row => {
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

  dropNewTileOnBoard() {
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        const board = boardArray[i][j];
        if (board.tile.active === false) {
          const tilePosition = this.getTilePosition(i, j);
          this.textures.setTexture(
            board.tile,
            iconArr[this.getRandom(iconArr.length)]
          );
          board.tile.active = true;
          board.tile.y = tilePosition.y - game.config.height;

          this.tweens.add({
            targets: board.tile,
            x: board.x,
            y: board.y,
            scaleX: initScale,
            scaleY: initScale,
            duration: gameOptions.dropSpeed
          });
        }
      }
    }

    return true;
  }

  getTilePosition(row, col) {
    let posX =
      gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5);
    let posY =
      gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

    posX += gameOptions.offsetX;
    posY += gameOptions.offsetY;
    return new Phaser.Geom.Point(posX, posY);
  }

  getTileByPosition(x, y) {
    let rowIndex = false;
    let colIndex = false;
    rowIndex = boardArray.findIndex(row => {
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
    return rowIndex === false ? false : boardArray[rowIndex][colIndex];
  }

  getRandom(max, min = 0) {
    return Math.floor(Math.random() * max) + min;
  }
}
