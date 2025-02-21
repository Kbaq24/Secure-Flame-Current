// Level4.js
import { createSaveButton } from './SaveLoadHelper.js';

export default class Level4 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level4' });
    this.part = 0;
  }
  
  preload() {
    this.load.image('background4', 'assets/background4.png');
    this.load.audio('bgMusic4', 'assets/bgMusic4.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    // Create the Save button for Level4
    createSaveButton(this);
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg = this.add.image(centerX, centerY, 'background4');
    bg.setOrigin(0.5);
    this.music = this.sound.add('bgMusic4', { loop: true });
    this.music.play();

    // Define story parts for Level4 (Counterattack and Recovery)
    this.storyParts = [
      {
        storyText: "Level 4:\nEarly in the morning, you detect a coordinated attack spanning multiple departments. BAMF is testing your network on a large scale.",
        options: [
          { text: "Immediately coordinate with IT and initiate emergency protocols", correct: true, feedback: "Correct! A swift, coordinated response is critical." },
          { text: "Wait for additional data", correct: false, partiallyCorrect: true, feedback: "Partially correct: waiting might yield more info, but delays are dangerous." },
          { text: "Focus only on your department", correct: false, feedback: "Incorrect: the attack is widespread and requires a full-scale response." },
          { text: "Ignore the alerts", correct: false, feedback: "Incorrect: ignoring signals can lead to severe breaches." }
        ]
      },
      {
        storyText: "Analyzing logs, you observe that key ports are repeatedly exploited, indicating targeted vulnerabilities.",
        options: [
          { text: "Recommend immediate firewall reconfiguration", correct: true, feedback: "Correct! Adjusting firewall rules promptly can block the attack vectors." },
          { text: "Rely solely on monitoring", correct: false, feedback: "Incorrect: monitoring without changes won’t stop the breaches." },
          { text: "Suggest a temporary block on those ports", correct: false, partiallyCorrect: true, feedback: "Partially correct: temporary blocks help but must be part of a broader strategy." },
          { text: "Assume the attack will subside soon", correct: false, feedback: "Incorrect: proactive measures are needed." }
        ]
      },
      {
        storyText: "BAMF’s tactics evolve rapidly; subtle anomalies indicate that standard defenses are being bypassed.",
        options: [
          { text: "Advise a comprehensive review of the firewall configuration", correct: true, feedback: "Correct! A thorough review uncovers hidden vulnerabilities." },
          { text: "Recommend only minor tweaks", correct: false, partiallyCorrect: true, feedback: "Partially correct: tweaks may not suffice against advanced methods." },
          { text: "Rely on default security settings", correct: false, feedback: "Incorrect: defaults are not secure against sophisticated attacks." },
          { text: "Propose shutting down non-critical services", correct: false, feedback: "Incorrect: that approach is too disruptive." }
        ]
      },
      {
        storyText: "Under mounting pressure, you and IT implement temporary measures while planning a long-term recovery strategy.",
        options: [
          { text: "Help implement targeted, temporary firewall adjustments", correct: true, feedback: "Correct! Temporary measures can mitigate damage while a permanent solution is developed." },
          { text: "Shut down the firewall entirely", correct: false, feedback: "Incorrect: shutting down disrupts critical operations." },
          { text: "Rely solely on automated adjustments", correct: false, partiallyCorrect: true, feedback: "Partially correct: automation is useful, but human oversight is essential." },
          { text: "Focus solely on restoring services", correct: false, feedback: "Incorrect: restoration must be paired with improved defenses." }
        ]
      },
      {
        storyText: "As the attack subsides, you work with IT to consolidate defenses and document all changes for a revised security strategy.",
        options: [
          { text: "Document all changes and propose long-term improvements", correct: true, feedback: "Correct! Detailed documentation is key to future resilience." },
          { text: "Assume temporary fixes are sufficient", correct: false, feedback: "Incorrect: long-term strategy is essential." },
          { text: "Focus only on restoring systems", correct: false, partiallyCorrect: true, feedback: "Partially correct: restoration is important, but strategic planning is equally vital." },
          { text: "Revert to default settings", correct: false, feedback: "Incorrect: defaults leave vulnerabilities exposed." }
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
            // When Level4 is complete, save progress and transition to Level5
            localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'Level5', part: 0 }));
            this.music.stop();
            this.scene.start('Level5');
          }
        } else {
          this.showPart();
        }
      });
      // Back button returns to the current question/options screen
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
      "Coordinate immediate countermeasures with IT.",
      "Focus on securing vulnerable ports.",
      "A comprehensive review is needed.",
      "Act swiftly with temporary and long-term solutions.",
      "Document every detail for future strategy."
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


  


