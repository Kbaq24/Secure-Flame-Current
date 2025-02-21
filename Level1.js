// Level1.js
export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Level1' });
    this.part = 0;
  }
  
  preload() {
    this.load.image('background1', 'assets/background1.png');
    this.load.audio('bgMusic1', 'assets/bgMusic1.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    let bg = this.add.image(centerX, centerY, 'background1');
    bg.setOrigin(0.5);
    this.music = this.sound.add('bgMusic1', { loop: true });
    this.music.play();
    
    // Define story parts for Level 1
    this.storyParts = [
      {
        storyText: "Level 1:\nYou receive an alert: unauthorized connection attempts detected. Rumors suggest BAMF is targeting your company.",
        options: [
          { text: "Notify IT and disconnect", correct: true, feedback: "Correct! Alerting IT immediately helps contain the threat." },
          { text: "Disconnect without notifying", correct: false, partiallyCorrect: true, feedback: "Partially correct: disconnecting helps, but IT must be informed." },
          { text: "Ignore the alert", correct: false, feedback: "Incorrect: ignoring could lead to a full-blown breach." },
          { text: "Attempt to fix it yourself", correct: false, feedback: "Incorrect: unauthorized changes may worsen the situation." }
        ]
      },
      {
        storyText: "A suspicious email arrives urging you to click a link to secure your account. Is it genuine?",
        options: [
          { text: "Verify with IT first", correct: true, feedback: "Correct! Always verify suspicious emails before acting." },
          { text: "Click the link immediately", correct: false, feedback: "Incorrect: it might be a phishing attempt." },
          { text: "Ignore the email", correct: false, partiallyCorrect: true, feedback: "Partially correct: ignoring avoids immediate risk, but IT should be notified." },
          { text: "Forward it to colleagues", correct: false, feedback: "Incorrect: spreading malicious content increases risk." }
        ]
      },
      {
        storyText: "You examine the firewall logs and notice spikes in traffic targeting non-critical ports.",
        options: [
          { text: "Report and suggest restricting ports", correct: true, feedback: "Correct! This reduces the network's attack surface." },
          { text: "Close all non-critical ports yourself", correct: false, partiallyCorrect: true, feedback: "Partially correct: unilateral changes can disrupt operations." },
          { text: "Continue monitoring", correct: false, feedback: "Incorrect: inaction may lead to exploitation." },
          { text: "Share the logs with colleagues", correct: false, feedback: "Incorrect: proper response should involve IT." }
        ]
      },
      {
        storyText: "Your logs reveal multiple unauthorized login attempts on your workstation.",
        options: [
          { text: "Change passwords, enable MFA, and notify IT", correct: true, feedback: "Correct! Strengthening credentials and notifying IT is essential." },
          { text: "Change your passwords quietly", correct: false, partiallyCorrect: true, feedback: "Partially correct: IT must be informed for a coordinated response." },
          { text: "Lock your workstation", correct: false, feedback: "Incorrect: locking is temporary and insufficient." },
          { text: "Run an antivirus scan first", correct: false, feedback: "Incorrect: immediate action is needed." }
        ]
      },
      {
        storyText: "Collaborate with IT to document the incident and isolate your workstation.",
        options: [
          { text: "Follow IT’s instructions and document everything", correct: true, feedback: "Correct! Coordination and proper documentation are key." },
          { text: "Shut down your computer immediately", correct: false, partiallyCorrect: true, feedback: "Partially correct: shutting down might help locally, but evidence is lost." },
          { text: "Continue working and assume IT will handle it", correct: false, feedback: "Incorrect: proactive response is needed." },
          { text: "Only notify your supervisor", correct: false, feedback: "Incorrect: IT’s involvement is essential." }
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
            localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'Level2', part: 0 }));
            this.music.stop();
            this.scene.start('Level2');
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
      "Notify IT immediately.",
      "Verify suspicious emails carefully.",
      "Document unusual firewall activity.",
      "Strengthen your credentials immediately.",
      "Coordinate with IT for a coordinated response."
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
