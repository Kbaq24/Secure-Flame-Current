// Level2.js
export default class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level2' });
    this.part = 0;
  }
  
  preload() {
    this.load.image('background2', 'assets/background2.png');
    this.load.audio('bgMusic2', 'assets/bgMusic2.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg = this.add.image(centerX, centerY, 'background2');
    bg.setOrigin(0.5);
    this.music = this.sound.add('bgMusic2', { loop: true });
    this.music.play();
    
    // Define story parts for Level 2 (BAMF escalation)
    this.storyParts = [
      {
        storyText: "Level 2:\nBAMF’s coordinated assault intensifies. Multiple departments report unusual activity and rising security alerts.",
        options: [
          { text: "Immediately notify IT and report the escalation", correct: true, feedback: "Correct! Immediate escalation ensures IT can coordinate a response." },
          { text: "Wait to confirm the patterns", correct: false, partiallyCorrect: true, feedback: "Partially correct: waiting might yield more info, but delays are dangerous." },
          { text: "Try to handle it on your own", correct: false, feedback: "Incorrect! Unilateral action risks further exposure." },
          { text: "Assume it's a false alarm", correct: false, feedback: "Incorrect! The signs indicate a serious threat." }
        ]
      },
      {
        storyText: "Analyzing network logs, you notice spikes in both inbound and outbound traffic across critical systems.",
        options: [
          { text: "Document these anomalies and share them with IT immediately", correct: true, feedback: "Correct! Detailed documentation helps IT adjust defenses promptly." },
          { text: "Assume it’s a temporary glitch", correct: false, feedback: "Incorrect! Persistent anomalies indicate a targeted attack." },
          { text: "Monitor silently without reporting", correct: false, feedback: "Incorrect! IT must be informed to take action." },
          { text: "Try to filter the traffic on your own", correct: false, partiallyCorrect: true, feedback: "Partially correct: filtering can help, but must be coordinated with IT." }
        ]
      },
      {
        storyText: "You and IT determine that vulnerable ports are being exploited repeatedly. The default firewall rules are insufficient.",
        options: [
          { text: "Recommend immediate reconfiguration of the firewall", correct: true, feedback: "Correct! Adjusting firewall settings promptly is essential." },
          { text: "Suggest a temporary block on the exploited ports", correct: false, partiallyCorrect: true, feedback: "Partially correct: temporary measures help but must be part of a broader plan." },
          { text: "Focus on monitoring without changes", correct: false, feedback: "Incorrect! Monitoring without action leaves vulnerabilities open." },
          { text: "Assume IT already has a plan and do nothing", correct: false, feedback: "Incorrect! Your input is crucial for a comprehensive response." }
        ]
      },
      {
        storyText: "The situation grows critical. You must balance immediate defense with gathering evidence for long-term improvements.",
        options: [
          { text: "Continue coordinating with IT and document all findings", correct: true, feedback: "Correct! Coordination and thorough documentation are critical." },
          { text: "Focus only on immediate fixes", correct: false, partiallyCorrect: true, feedback: "Partially correct: immediate fixes are necessary, but documentation is essential." },
          { text: "Delay action to collect more evidence", correct: false, feedback: "Incorrect! Delays can worsen the breach." },
          { text: "Rely solely on automated systems", correct: false, feedback: "Incorrect! Automated systems need human oversight." }
        ]
      },
      {
        storyText: "With the crisis partially contained, you execute the agreed countermeasures and stabilize the network.",
        options: [
          { text: "Execute the countermeasures and prepare to move to the next level", correct: true, feedback: "Correct! Effective countermeasures set the stage for further defense." },
          { text: "Assume the situation is under control and relax", correct: false, feedback: "Incorrect! Remaining vigilant is crucial." },
          { text: "Apply changes only to your workstation", correct: false, partiallyCorrect: true, feedback: "Partially correct: localized changes aren’t sufficient." },
          { text: "Delay implementation to double-check evidence", correct: false, feedback: "Incorrect! Delays can result in additional damage." }
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
            localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'Level3', part: 0 }));
            this.music.stop();
            this.scene.start('Level3');
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
      "Document anomalies carefully.",
      "Monitor network traffic closely.",
      "Focus on the exploited vulnerable ports.",
      "Coordinate your response with IT.",
      "Implement countermeasures promptly."
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

  






