// OfficeScene.js
export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'OfficeScene' });
  }
  
  preload() {
    // No external assets are loaded since they are not available.
    // You can add asset loading here if you later add custom images.
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Set a solid background color.
    this.cameras.main.setBackgroundColor('#222222');
    
    // Display a title text to indicate this is the Office Scene.
    this.add.text(centerX, centerY - 100, 'Office Scene', {
      font: '32px Arial',
      fill: '#00FF00'
    }).setOrigin(0.5);
    
    // Display instructions for the player.
    this.add.text(centerX, centerY, 
      'Imagine you are at your desk.\nClick anywhere to turn on your computer and begin the game.',
      {
        font: '20px Arial',
        fill: '#FFFFFF',
        align: 'center',
        wordWrap: { width: 700 }
      }
    ).setOrigin(0.5);
    
    // Make the scene interactive – on click, simulate turning on the computer.
    this.input.once('pointerdown', () => {
      // Display a temporary message simulating the computer turning on.
      this.add.text(centerX, centerY + 100, 'Computer is now ON!', {
        font: '28px Arial',
        fill: '#FFFF00'
      }).setOrigin(0.5);
      
      // After a brief delay, transition to the next scene (e.g., LevelIntro).
      this.time.delayedCall(1000, () => {
        this.scene.start('LevelIntro', {
          levelTitle: 'Level 1: The First Signs of BAMF Intrusion',
          nextScene: 'Level1'
        });
      });
    });
  }
}


  