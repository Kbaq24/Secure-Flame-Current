// main.js

// Import your scenes
import StartScreen from './StartScreen.js';
import OfficeScene from './OfficeScene.js';
import LevelIntro from './LevelIntro.js';
import Level1 from './Level1.js';            
import Level2 from './Level2.js';
import Level3 from './Level3.js';
import Level4 from './Level4.js';
import Level5 from './Level5.js';
import BonusLevel from './BonusLevel.js';
import CongratulationsScene from './CongratulationsScene.js';

// Global Typewriter Helper Function
function typeText(scene, x, y, fullText, style, onComplete, delay = 50) {
  let currentText = '';
  let charIndex = 0;
  const textObject = scene.add.text(x, y, '', style);
  scene.time.addEvent({
    delay: delay, // 30
    repeat: fullText.length - 1,
    callback: () => {
      currentText += fullText.charAt(charIndex);
      textObject.setText(currentText);
      charIndex++;
      if (charIndex === fullText.length && onComplete) {
        onComplete();
      }
    }
  });
  return textObject;
}
window.typeText = typeText;

// Global Dynamic Difficulty Manager (optional)
class DifficultyManager {
  constructor() {
    this.correctCount = 0;
    this.partialCount = 0;
    this.incorrectCount = 0;
    this.totalAttempts = 0;
    this.currentDifficulty = 1;
    this.thresholdHigh = 0.8;
    this.thresholdLow = 0.5;
  }
  
  recordAnswer({ isCorrect = false, isPartial = false }) {
    this.totalAttempts++;
    if (isCorrect) {
      this.correctCount++;
    } else if (isPartial) {
      this.partialCount++;
    } else {
      this.incorrectCount++;
    }
    this.adjustDifficulty();
  }
  
  adjustDifficulty() {
    const score = this.correctCount + (this.partialCount * 0.5);
    const accuracy = score / this.totalAttempts;
    if (accuracy >= this.thresholdHigh && this.currentDifficulty < 5) {
      this.currentDifficulty++;
      this.resetMetrics();
      console.log('Increasing difficulty to:', this.currentDifficulty);
    } else if (accuracy <= this.thresholdLow && this.currentDifficulty > 1) {
      this.currentDifficulty--;
      this.resetMetrics();
      console.log('Decreasing difficulty to:', this.currentDifficulty);
    }
  }
  
  resetMetrics() {
    this.correctCount = 0;
    this.partialCount = 0;
    this.incorrectCount = 0;
    this.totalAttempts = 0;
  }
  
  getCurrentDifficulty() {
    return this.currentDifficulty;
  }
}
window.difficultyManager = new DifficultyManager();

// Phaser Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  // Register all your scenes here. Make sure Level1 is included!
  scene: [StartScreen, OfficeScene, LevelIntro, Level1, Level2, Level3, Level4, Level5, BonusLevel, CongratulationsScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  }
};

const game = new Phaser.Game(config);
game.events.on('ready', () => console.log('Game is ready.'));
game.events.on('destroy', () => console.log('Game destroyed.'));



