export const iconArr = [
  'egg',
  'fish',
  'meat'
  // 'watermelon',
  // 'grape',
  // 'potato',
  // 'vegetable'
];
export class loading extends Phaser.Scene {
  constructor() {
    super('loading');
  }
  preload() {
    this.load.image('egg', 'assets/sprites/egg48x48.png');
    this.load.image('fish', 'assets/sprites/fish48x48.png');
    this.load.image('meat', 'assets/sprites/meat48x48.png');
    this.load.image('watermelon', 'assets/sprites/watermelon48x48.png');
    this.load.image('grape', 'assets/sprites/grape48x48.png');
    this.load.image('potato', 'assets/sprites/potato48x48.png');
    this.load.image('vegetable', 'assets/sprites/vegetable48x48.png');
    this.load.image('bg', 'assets/sprites/bg.jpg');
  }
  create() {
    this.add.text(100, 100, 'loading ...', { fill: '#0f0' });
    this.scene.start('playGame');
  }
}
