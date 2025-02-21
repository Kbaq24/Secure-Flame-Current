// StartScreen.js
import { loadGame } from './SaveLoadHelper.js';

export default class StartScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScreen' });
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Title text
    this.add.text(centerX, centerY - 100, 'Secure Flame Game', {
      font: '48px Arial',
      fill: '#00FF00'
    }).setOrigin(0.5);

    // New Game button – starts fresh and clears any saved data.
    const newGameButton = this.add.text(centerX, centerY, 'New Game', {
      font: '32px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#004400',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive();
    newGameButton.on('pointerdown', () => {
      localStorage.removeItem('gameSave');
      this.scene.start('OfficeScene'); // Replace with your initial scene key.
    });

    // Load Game button – resumes progress from saved data.
    const loadGameButton = this.add.text(centerX, centerY + 100, 'Load Game', {
      font: '32px Arial',
      fill: '#FFFFFF',
      backgroundColor: '#004400',
      padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive();
    loadGameButton.on('pointerdown', () => {
      const progress = loadGame();
      if (progress) {
        this.scene.start(progress.currentScene, progress);
      } else {
        alert('No saved game found. Starting a new game.');
        this.scene.start('OfficeScene'); // Replace with your initial scene key.
      }
    });
  }
}

  