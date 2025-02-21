// LevelIntro.js
export default class LevelIntro extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelIntro' });
  }
  
  init(data) {
    this.levelTitle = data.levelTitle || 'Level Intro';
    this.nextScene = data.nextScene || 'Level1';
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.add.text(centerX, centerY - 50, this.levelTitle, {
      font: '32px Arial',
      fill: '#00FF00'
    }).setOrigin(0.5);
    
    const continueButton = this.add.text(centerX, centerY + 50, 'Continue', {
      font: '24px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#004400',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive();
    
    continueButton.on('pointerdown', () => {
      this.scene.start(this.nextScene);
    });
  }
}
