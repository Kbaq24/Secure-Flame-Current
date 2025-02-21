// Level5.js
import { createSaveButton } from './SaveLoadHelper.js';

export default class Level5 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level5' });
    this.part = 0;
  }
  
  preload() {
    // Reuse Level1 assets for this example
    this.load.image('background5', 'assets/background1.png'); 
    this.load.audio('bgMusic5', 'assets/bgMusic1.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    // Create Save button for Level5
    createSaveButton(this);
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg = this.add.image(centerX, centerY, 'background5');
    bg.setOrigin(0.5);
    this.music = this.sound.add('bgMusic5', { loop: true });
    this.music.play();
    
    // Define story parts for Level 5 (BAMF storyline continuation)
    this.storyParts = [
      {
        storyText: "Level 5:\nThe assault from BAMF reaches its peak. Systems are overloaded and alerts flood in. Your heart races as you monitor the spike in warnings.",
        options: [
          { text: "Immediately alert IT and initiate emergency protocols", correct: true, feedback: "Correct! Rapid communication is essential." },
          { text: "Keep monitoring a bit longer", correct: false, partiallyCorrect: true, feedback: "Partially correct: waiting may provide more data, but any delay could worsen the attack." },
          { text: "Try to fix issues on your own", correct: false, feedback: "Incorrect! Unauthorized fixes can exacerbate the situation." },
          { text: "Ignore the alerts", correct: false, feedback: "Incorrect! Ignoring alerts may lead to further breaches." }
        ]
      },
      {
        storyText: "Working with IT, you pinpoint unpatched vulnerabilities and misconfigured firewall rules that BAMF exploits.",
        options: [
          { text: "Report your findings and suggest immediate patching", correct: true, feedback: "Correct! Swift action helps close vulnerabilities." },
          { text: "Assume IT knows and do nothing", correct: false, feedback: "Incorrect! Your input is crucial." },
          { text: "Attempt to patch vulnerabilities yourself", correct: false, partiallyCorrect: true, feedback: "Partially correct: initiative is good, but IT should handle the changes." },
          { text: "Only document the issues", correct: false, feedback: "Incorrect! Documentation alone won't stop the attack." }
        ]
      },
      {
        storyText: "IT instructs you to help update firewall rules to block BAMF’s attack vectors. Every second counts.",
        options: [
          { text: "Collaborate with IT to update firewall rules immediately", correct: true, feedback: "Correct! Coordinated action can stem the attack." },
          { text: "Implement changes only on your workstation", correct: false, partiallyCorrect: true, feedback: "Partially correct: local changes help, but a network-wide update is necessary." },
          { text: "Delay changes to verify vulnerabilities", correct: false, feedback: "Incorrect! Delays may allow breaches to continue." },
          { text: "Rely solely on automated scripts", correct: false, feedback: "Incorrect! Automation requires IT oversight." }
        ]
      },
      {
        storyText: "As the updated firewall rules take effect, BAMF’s activity decreases and the network stabilizes, though recovery is just beginning.",
        options: [
          { text: "Assist IT in monitoring and fine-tuning firewall settings", correct: true, feedback: "Correct! Continuous adjustments are vital for long-term security." },
          { text: "Assume the attack is over and resume normal operations", correct: false, feedback: "Incorrect! Residual threats may persist." },
          { text: "Focus only on your workstation", correct: false, partiallyCorrect: true, feedback: "Partially correct: the entire network must be monitored." },
          { text: "Shut down non-critical systems", correct: false, feedback: "Incorrect! That may disrupt operations." }
        ]
      },
      {
        storyText: "Finally, as BAMF’s assault subsides, you help IT compile evidence and document the incident. Your efforts have secured the network—and now you prepare to transition to the Bonus Level for advanced training.",
        options: [
          { text: "Prepare to transition to the Bonus Level for advanced training", correct: true, feedback: "Correct! Your work sets the stage for further improvements." },
          { text: "Assume your job is done and relax", correct: false, feedback: "Incorrect! Ongoing vigilance and training are essential." },
          { text: "Recommend reverting to default settings", correct: false, feedback: "Incorrect! Defaults are not secure." },
          { text: "Suggest ignoring future alerts", correct: false, feedback: "Incorrect! Every alert is a chance to improve defenses." }
        ]
      }
    ];
    
    this.showPart();
  }
  
  showPart() {
    this.children.removeAll();
    const part = this.storyParts[this.part];
    window.typeText(this, 50, 50, part.storyText, {
      font: '20px Arial',
      fill: '#FFFFFF',
      wordWrap: { width: this.cameras.main.width - 100 }
    }, () => {
      this.showOptions(part.options);
    }, 30);
  }
  
  showOptions(options) {
    Phaser.Utils.Array.Shuffle(options);
    options.forEach((option, index) => {
      const btn = this.add.text(100, 150 + index * 50, option.text, {
        font: '18px Arial',
        fill: '#00FF00'
      }).setInteractive();
      btn.on('pointerdown', () => {
        window.difficultyManager.recordAnswer({
          isCorrect: option.correct,
          isPartial: option.partiallyCorrect || false
        });
        this.handleAnswer(option.correct, option.feedback, option.partiallyCorrect);
      });
    });
    const hintButton = this.add.text(100, 500, 'Need a Hint?', {
      font: '18px Arial',
      fill: '#FFD700'
    }).setInteractive();
    hintButton.on('pointerdown', () => this.showHint());
  }
  
  handleAnswer(isCorrect, feedback, partiallyCorrect) {
    this.children.removeAll();
    const soundKey = (isCorrect && !partiallyCorrect) ? 'correctSound' : 'incorrectSound';
    const sound = this.sound.add(soundKey);
    sound.play();
    this.currentFeedback = feedback;
    window.typeText(this, 50, 50, feedback, {
      font: '20px Arial',
      fill: isCorrect ? '#00FF00' : '#FF0000',
      wordWrap: { width: this.cameras.main.width - 100 }
    }, () => {
      const continueButton = this.add.text(100, 500, 'Continue', {
        font: '18px Arial',
        fill: '#00FF00',
        backgroundColor: '#444444',
        padding: { x: 10, y: 5 }
      }).setInteractive();
      continueButton.on('pointerdown', () => {
        if (isCorrect && !partiallyCorrect) {
          this.part++;
          if (this.part < this.storyParts.length) {
            this.showPart();
          } else {
            // End of Level5: Save progress and transition to BonusLevel scene
            localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'BonusLevel', part: 0 }));
            this.music.stop();
            this.scene.start('BonusLevel');
          }
        } else {
          this.showPart();
        }
      });
      if (!isCorrect || partiallyCorrect) {
        const backButton = this.add.text(300, 500, 'Back', {
          font: '18px Arial',
          fill: '#FFD700',
          backgroundColor: '#444444',
          padding: { x: 10, y: 5 }
        }).setInteractive();
        backButton.on('pointerdown', () => this.showPart());
      }
    });
  }
  
  showHint() {
    const hints = [
      "Immediately alert IT.",
      "Document all vulnerabilities carefully.",
      "Focus on the unpatched vulnerabilities.",
      "Work closely with IT to update configurations.",
      "Ensure ongoing vigilance."
    ];
    const hint = hints[this.part] || "Stay alert!";
    this.children.removeAll();
    window.typeText(this, 50, 50, "Hint: " + hint, {
      font: '20px Arial',
      fill: '#FFD700',
      wordWrap: { width: this.cameras.main.width - 100 }
    }, () => {
      const nextButton = this.add.text(100, 500, 'Next', {
        font: '18px Arial',
        fill: '#00FF00',
        backgroundColor: '#444444',
        padding: { x: 10, y: 5 }
      }).setInteractive();
      nextButton.on('pointerdown', () => this.showPart());
    });
  }
}


  

