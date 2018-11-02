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
        tile.setInteractive();
        this.boardArray[i][j] = {
          x: tilePosition.x,
          y: tilePosition.y,
          image: iconArr[random],
          tile: tile
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

    // this.input.on('pointerup', this.handlePointerUp, this);
    this.input.on('gameobjectdown', this.handlePointerUp);
  }

  update() {
    // console.log('1');
  }

  handlePointerUp(e, obj) {
    // const swipeTime = e.upTime - e.downTime;
    // const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    // console.log('Movement time:' + swipeTime + ' ms');
    // console.log('Horizontal distance: ' + swipe.x + ' pixels');
    // console.log('Vertical distance: ' + swipe.y + ' pixels');
    console.log('e.upX', e.upX);
    console.log('e.upY', e.upY);
    console.log(obj);
    // const tile = this.getTileByPosition(e.upX, e.upY);
    // tile.visible = !tile.visible;
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
    let tile = false;
    this.boardArray.find(row => {
      row.find(item => {
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
          tile = item.tile;
          return true;
        }
      });
      return tile;
    });
    return tile;
  }

  getRandom(max, min = 0) {
    return Math.floor(Math.random() * max) + min;
  }
}
