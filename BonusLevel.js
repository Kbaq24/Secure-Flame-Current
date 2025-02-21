// BonusLevel.js
import { createSaveButton } from './SaveLoadHelper.js';

export default class BonusLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'BonusLevel' });
    this.part = 0;
  }
  
  preload() {
    // Reuse Level1 assets for this example.
    this.load.image('backgroundBonus', 'assets/background1.png'); 
    this.load.audio('bgMusicBonus', 'assets/bgMusic1.mp3');
    this.load.audio('correctSound', 'assets/success.mp3');
    this.load.audio('incorrectSound', 'assets/failure.mp3');
    this.load.audio('hintSound', 'assets/hint.mp3');
  }
  
  create() {
    // Create a Save button in this level.
    createSaveButton(this);
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    // Display the background image.
    let bg = this.add.image(centerX, centerY, 'backgroundBonus');
    bg.setOrigin(0.5);
    
    // Play background music.
    this.music = this.sound.add('bgMusicBonus', { loop: true });
    this.music.play();
    
    // Define the educational story parts.
    this.storyParts = [
      {
        storyText: "Bonus Level - Part 1:\nUnderstanding Open Ports:\nOpen ports allow communication, but too many open ports increase vulnerability. Tools like Nmap help you identify them.",
        options: [
          { text: "Learn to use Nmap for scanning open ports", correct: true, feedback: "Correct! Nmap is a powerful port scanner." },
          { text: "Manually guess which ports are open", correct: false, feedback: "Incorrect! Guessing is unreliable." },
          { text: "Rely solely on firewall logs", correct: false, feedback: "Incorrect! Logs might not show all open ports." },
          { text: "Ignore port scanning altogether", correct: false, feedback: "Incorrect! Identifying open ports is essential." }
        ]
      },
      {
        storyText: "Bonus Level - Part 2:\nEssential Penetration Testing Tools:\nEffective testing uses tools such as Nmap, Wireshark, and Metasploit.",
        options: [
          { text: "Install and learn Nmap, Wireshark, and Metasploit", correct: true, feedback: "Correct! These tools are industry standards." },
          { text: "Use only Wireshark for all testing", correct: false, feedback: "Incorrect! No single tool covers every aspect." },
          { text: "Rely exclusively on online scanners", correct: false, feedback: "Incorrect! Local tools offer more control." },
          { text: "Skip installing specialized tools", correct: false, feedback: "Incorrect! Proper tools are essential for effective testing." }
        ]
      },
      {
        storyText: "Bonus Level - Part 3:\nUsing Nmap:\nOpen your terminal and run: nmap -sV <target-ip> to list open ports and detect running services.",
        options: [
          { text: "Run 'nmap -sV <target-ip>' in your terminal", correct: true, feedback: "Correct! This command shows open ports and services." },
          { text: "Use your browser to scan ports", correct: false, feedback: "Incorrect! Browsers cannot perform full port scans." },
          { text: "Manually check each port", correct: false, feedback: "Incorrect! Manual checking is not reliable." },
          { text: "Rely on system monitors alone", correct: false, feedback: "Incorrect! Dedicated scanners provide detailed results." }
        ]
      },
      {
        storyText: "Bonus Level - Part 4:\nConducting a Penetration Test:\nAfter scanning, use vulnerability scanners (e.g., OpenVAS or Nessus) or Metasploit modules to assess the discovered services.",
        options: [
          { text: "Run a vulnerability scanner to assess risks", correct: true, feedback: "Correct! Scanners help identify exploitable vulnerabilities." },
          { text: "Assume no vulnerabilities exist if ports are open", correct: false, feedback: "Incorrect! Open ports can hide vulnerabilities." },
          { text: "Manually research each service", correct: false, feedback: "Incorrect! Automated tools provide a comprehensive assessment." },
          { text: "Skip testing altogether", correct: false, feedback: "Incorrect! Testing is crucial for security." }
        ]
      },
      {
        storyText: "Bonus Level - Part 5:\nInterpreting Scan Results:\nReview the output to identify open ports, running services, and potential vulnerabilities. Look for outdated software or unusual services.",
        options: [
          { text: "Analyze the scan output for known vulnerabilities", correct: true, feedback: "Correct! Detailed analysis helps pinpoint weaknesses." },
          { text: "Ignore details and only count open ports", correct: false, feedback: "Incorrect! Service details are critical for security." },
          { text: "Rely solely on the scanner's summary", correct: false, feedback: "Incorrect! Manual verification is necessary." },
          { text: "Assume everything is secure if no alerts appear", correct: false, feedback: "Incorrect! Always verify the results." }
        ]
      },
      {
        storyText: "Bonus Level - Part 6:\nAdjusting Firewall Settings:\nAccess your firewall’s configuration panel. Create a default-deny rule and explicitly allow only trusted services and IP addresses.",
        options: [
          { text: "Configure the firewall to block all inbound traffic except from trusted sources", correct: true, feedback: "Correct! This minimizes your exposure." },
          { text: "Disable the firewall temporarily", correct: false, feedback: "Incorrect! Disabling increases risk." },
          { text: "Allow all traffic then filter it", correct: false, feedback: "Incorrect! That approach creates vulnerabilities." },
          { text: "Keep default settings", correct: false, feedback: "Incorrect! Defaults are rarely secure." }
        ]
      },
      {
        storyText: "Bonus Level - Part 7:\nDocumentation and Continuous Monitoring:\nAfter updating your firewall, document every change and set up regular monitoring for future audits and improvements.",
        options: [
          { text: "Keep detailed logs and review them regularly", correct: true, feedback: "Correct! Documentation and monitoring are key to long-term security." },
          { text: "Rely solely on periodic scans", correct: false, feedback: "Incorrect! Continuous monitoring is necessary." },
          { text: "Document only major changes", correct: false, partiallyCorrect: true, feedback: "Partially correct: even minor changes can be important." },
          { text: "Skip documentation to save time", correct: false, feedback: "Incorrect! Proper documentation is critical for maintaining security." }
        ]
      }
    ];
    
    this.showPart();
  }
  
  showPart() {
    this.children.removeAll();
    const part = this.storyParts[this.part];
    window.typeText(this, 50, 50, part.storyText, 
      { font: '20px Arial', fill: '#FFFFFF', wordWrap: { width: this.cameras.main.width - 100 } },
      () => { this.showOptions(part.options); }, 30);
  }
  
  showOptions(options) {
    Phaser.Utils.Array.Shuffle(options);
    options.forEach((option, index) => {
      const btn = this.add.text(100, 150 + index * 50, option.text, 
        { font: '18px Arial', fill: '#00FF00' }).setInteractive();
      btn.on('pointerdown', () => {
        window.difficultyManager.recordAnswer({
          isCorrect: option.correct,
          isPartial: option.partiallyCorrect || false
        });
        this.handleAnswer(option.correct, option.feedback, option.partiallyCorrect);
      });
    });
    const hintButton = this.add.text(100, 500, 'Need a Hint?', 
      { font: '18px Arial', fill: '#FFD700' }).setInteractive();
    hintButton.on('pointerdown', () => this.showHint());
  }
  
  handleAnswer(isCorrect, feedback, partiallyCorrect) {
    this.children.removeAll();
    const soundKey = (isCorrect && !partiallyCorrect) ? 'correctSound' : 'incorrectSound';
    const sound = this.sound.add(soundKey);
    sound.play();
    this.currentFeedback = feedback;
    window.typeText(this, 50, 50, feedback, 
      { font: '20px Arial', fill: isCorrect ? '#00FF00' : '#FF0000', wordWrap: { width: this.cameras.main.width - 100 } },
      () => {
        const continueButton = this.add.text(100, 500, 'Continue', 
          { font: '18px Arial', fill: '#00FF00', backgroundColor: '#444444', padding: { x: 10, y: 5 } }).setInteractive();
        continueButton.on('pointerdown', () => {
          if (isCorrect && !partiallyCorrect) {
            this.part++;
            if (this.part < this.storyParts.length) {
              this.showPart();
            } else {
              localStorage.setItem('gameSave', JSON.stringify({ currentScene: 'CongratulationsScene', part: 0 }));
              this.music.stop();
              this.scene.start('CongratulationsScene');
            }
          } else {
            this.showPart();
          }
        });
        if (!isCorrect || partiallyCorrect) {
          const backButton = this.add.text(300, 500, 'Back', 
            { font: '18px Arial', fill: '#FFD700', backgroundColor: '#444444', padding: { x: 10, y: 5 } }).setInteractive();
          backButton.on('pointerdown', () => this.showPart());
        }
      }
    );
  }
  
  showHint() {
    const hints = [
      "Review default firewall settings carefully.",
      "Use Nmap to list open ports.",
      "Identify and whitelist only trusted IP addresses.",
      "Run vulnerability scans with tools like Nessus.",
      "Analyze scan outputs to spot weaknesses.",
      "Update your firewall rules to close unnecessary ports.",
      "Document every step and continuously monitor your network."
    ];
    const hint = hints[this.part] || "Review your configuration!";
    this.children.removeAll();
    window.typeText(this, 50, 50, "Hint: " + hint, 
      { font: '20px Arial', fill: '#FFD700', wordWrap: { width: this.cameras.main.width - 100 } },
      () => {
        const nextButton = this.add.text(100, 500, 'Next', 
          { font: '18px Arial', fill: '#00FF00', backgroundColor: '#444444', padding: { x: 10, y: 5 } }).setInteractive();
        nextButton.on('pointerdown', () => this.showPart());
      }
    );
  }
}


  
