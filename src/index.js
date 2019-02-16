import 'phaser';
import { loading } from './scenes/loading';
import { playGame } from './scenes/playGame';

//參數設定區
const w = window.innerWidth; //canvas width
const h = window.innerHeight; //canvas height

const rows = 5; //遊戲主板列數
const cols = 6; //遊戲主板行數
const tileSize = 48; //元素大小
const tileSpacing = 0; //元素間隔
const dropSpeed = 300; //掉落速度
const dropDelay = 10; //初始元素掉落間隔時間
const backgroundColor = 0xecf0f1; //預設背景顏色

const aspectRatio = 16 / 9; //總版面寬高比
const boardWidth = cols * (tileSize + tileSpacing) + tileSpacing; //元素版面寬
let offsetX = (w - boardWidth) / 2; //元素x軸掉落位置
const boardHeight = rows * (tileSize + tileSpacing) + tileSpacing; //元素版面高
let offsetY = (h + boardWidth * aspectRatio) / 2 - boardHeight; //元素y軸掉落位置

export const gameOptions = {
  tileSize: tileSize,
  tileSpacing: tileSpacing,
  boardSize: {
    rows: rows,
    cols: cols
  },
  dropSpeed: dropSpeed,
  dropDelay: dropDelay,
  boardWidth: boardWidth,
  boardHeight: boardHeight,
  offsetX: offsetX,
  offsetY: offsetY,
  aspectRatio: aspectRatio
};

const gameConfig = {
  parent: 'gameContainer',
  width: w,
  height: h,
  scene: [loading, playGame],
  backgroundColor: backgroundColor
};

export const game = new Phaser.Game(gameConfig);
