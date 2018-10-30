import 'phaser';

import { loading } from './scenes/loading';
import { playGame } from './scenes/playGame';

const gameConfig = {
  width: 1080,
  height: 800,
  scene: [loading, playGame],
  backgroundColor: 0x000
};

new Phaser.Game(gameConfig);
