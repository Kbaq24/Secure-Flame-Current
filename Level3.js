// Level3.js
export default class Level3 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level3' });
    this.part = 0;
  }
  
  preload() {
    this.load.image('background3', 'assets/background3.png');
    this.load.audio('bgMusic3', 'assets/bgMusic3.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg = this.add.image(centerX, centerY, 'background3');
    bg.setOrigin(0.5);
    this.music = this.sound.add('bgMusic3', { loop: true });
    this.music.play();

    this.storyParts = [
      {
        storyText: "Level 3:\nBAMF intensifies their attack; logs reveal targeted breaches on multiple systems.",
        options: [
          { text: "Immediately alert IT and prepare a coordinated response", correct: true, feedback: "Correct! Quick action is essential." },
          { text: "Wait for more data", correct: false, partiallyCorrect: true, feedback: "Partially correct: waiting might yield more info, but delays are risky." },
          { text: "Isolate only your workstation", correct: false, feedback: "Incorrect: the attack is widespread." },
          { text: "Rely solely on automated tools", correct: false, feedback: "Incorrect: manual coordination is required." }
        ]
      },
      {
        storyText: "Working with IT, you identify that specific ports are repeatedly exploited.",
        options: [
          { text: "Recommend updating firewall rules to secure these ports", correct: true, feedback: "Correct! Fine-tuning rules can help block exploitation." },
          { text: "Suggest monitoring without changes", correct: false, feedback: "Incorrect: monitoring alone is not enough." },
          { text: "Advise shutting down vulnerable ports", correct: false, partiallyCorrect: true, feedback: "Partially correct: shutting down might help, but must be balanced." },
          { text: "Ignore the pattern", correct: false, feedback: "Incorrect: repeated targeting is a clear threat." }
        ]
      },
      {
        storyText: "Further investigation reveals BAMF is using sophisticated methods to bypass defenses.",
        options: [
          { text: "Advise a comprehensive review of the firewall configuration", correct: true, feedback: "Correct! A thorough review uncovers hidden vulnerabilities." },
          { text: "Recommend minor tweaks", correct: false, partiallyCorrect: true, feedback: "Partially correct: tweaks may not suffice against advanced methods." },
          { text: "Rely on default settings", correct: false, feedback: "Incorrect: defaults are not secure." },
          { text: "Propose shutting down non-critical services", correct: false, feedback: "Incorrect: that approach is too disruptive." }
        ]
      },
      {
        storyText: "Time is critical; you must balance immediate defense with long-term strategy.",
        options: [
          { text: "Implement temporary fixes while planning permanent improvements", correct: true, feedback: "Correct! A dual approach is essential." },
          { text: "Focus only on immediate fixes", correct: false, partiallyCorrect: true, feedback: "Partially correct: immediate fixes alone are insufficient." },
          { text: "Delay action to gather more info", correct: false, feedback: "Incorrect: any delay can worsen the attack." },
          { text: "Disconnect your workstation", correct: false, feedback: "Incorrect: that does not address the widespread problem." }
        ]
      },
      {
        storyText: "After stabilizing the situation, you help IT document the incident and propose a revised security strategy.",
        options: [
          { text: "Provide detailed evidence and propose long-term improvements", correct: true, feedback: "Correct! Comprehensive documentation is key." },
          { text: "Offer a brief summary", correct: false, partiallyCorrect: true, feedback: "Partially correct: summaries are insufficient for long-term improvement." },
          { text: "Focus solely on recovery", correct: false, feedback: "Incorrect: recovery must be paired with strategic planning." },
          { text: "Recommend reverting to defaults", correct: false, feedback: "Incorrect: defaults leave vulnerabilities exposed." }
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
    }, () => { this.showOptions(part.options); }, 30);
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
            localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'Level4', part: 0 }));
            this.music.stop();
            this.scene.start('Level4');
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
      "Analyze the scan results thoroughly.",
      "Check for unusual service versions.",
      "Focus on key vulnerabilities, not just open ports.",
      "Review detailed outputs to identify weaknesses.",
      "Verify potential issues manually."
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

  

