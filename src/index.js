import 'phaser';
import { loading } from './scenes/loading';
import { playGame } from './scenes/playGame';

export const gameOptions = {
  tileSize: 48,
  tileSpacing: 0,
  boardSize: {
    rows: 5,
    cols: 5
  },
  dropSpeed: 600,
  dropDelay: 10,
  aspectRatio: 16 / 9
};

const w =
  gameOptions.boardSize.cols *
    (gameOptions.tileSize + gameOptions.tileSpacing) +
  gameOptions.tileSpacing;
const h = w * gameOptions.aspectRatio;

const gameConfig = {
  parent: 'gameContainer',
  width: w,
  height: w,
  scene: [loading, playGame],
  backgroundColor: 0xecf0f1
};
export const game = new Phaser.Game(gameConfig);
