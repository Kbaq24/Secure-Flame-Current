// SaveLoadHelper.js

/**
 * Creates a Save button in the given scene.
 * When clicked, it saves the current scene key and progress (e.g., the "part" number) to localStorage.
 */
export function createSaveButton(scene) {
    const saveButton = scene.add.text(
      scene.cameras.main.width - 100, // x-position (top right)
      20,                             // y-position
      'Save',
      {
        font: '16px Arial',
        fill: '#FFFFFF',
        backgroundColor: '#444444',
        padding: { x: 5, y: 3 }
      }
    )
    .setScrollFactor(0)
    .setDepth(1000)
    .setInteractive();
    
    saveButton.on('pointerdown', () => {
      // Save the current scene key and progress (assumes scene has a "part" property)
      const progressData = {
        currentScene: scene.scene.key,
        part: scene.part || 0
      };
      localStorage.setItem('gameSave', JSON.stringify(progressData));
      // Show a temporary "Game Saved!" message
      const savedMsg = scene.add.text(
        scene.cameras.main.width / 2,
        50,
        'Game Saved!',
        { font: '20px Arial', fill: '#00FF00' }
      ).setOrigin(0.5).setDepth(1000);
      scene.time.delayedCall(1500, () => savedMsg.destroy());
    });
  }
  
  /**
   * Loads saved game data from localStorage.
   * Returns an object with saved progress (e.g., { currentScene: 'Level2', part: 3 })
   * or null if no saved data is found.
   */
  export function loadGame() {
    const savedData = localStorage.getItem('gameSave');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  }
  
  