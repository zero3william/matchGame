export class playGame extends Phaser.Scene {
  constructor() {
    super('playGame');
  }
  create() {
    this.add.text(100, 200, 'Game start', { fill: '#0f0' });

    const graphics = this.add.graphics();

    graphics.fillStyle(0xffffff, 1.0);
    graphics.fillRect(100, 300, 32, 32);
  }
}
