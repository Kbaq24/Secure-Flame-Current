// CongratulationsScene.js
export default class CongratulationsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CongratulationsScene' });
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.cameras.main.setBackgroundColor('#000000');
    
    this.add.text(centerX, centerY - 100, 'Congratulations!', {
      font: '48px Arial',
      fill: '#00FF00'
    }).setOrigin(0.5);
    
    this.add.text(centerX, centerY, 
      "You have successfully completed the game and learned essential cybersecurity skills!", {
      font: '24px Arial',
      fill: '#FFFFFF',
      align: 'center'
    }).setOrigin(0.5);
    
    const playAgainButton = this.add.text(centerX, centerY + 150, 'Play Again', {
      font: '32px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#004400',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive();
    
    playAgainButton.on('pointerdown', () => {
      localStorage.removeItem('gameSave');
      this.scene.start('StartScreen');
    });
  }
}

  