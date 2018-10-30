export class loading extends Phaser.Scene {
  constructor() {
    super('loading');
  }
  preload() {
    this.load.image('egg', 'assets/sprites/egg.png');
    this.load.image('fish', 'assets/sprites/fish.png');
    this.load.image('meat', 'assets/sprites/meat.png');
    this.load.image('watermelon', 'assets/sprites/watermelon.png');
    this.load.image('grape', 'assets/sprites/grape.png');
    this.load.image('potato', 'assets/sprites/potato.png');
    this.load.image('vegetable', 'assets/sprites/vegetable.png');
  }
  create() {
    this.add.text(100, 100, 'loading ...', { fill: '#0f0' });
    this.scene.start('playGame');
  }
}
