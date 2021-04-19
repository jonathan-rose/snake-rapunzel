import 'phaser';

export default {
    type: Phaser.AUTO,
    width: 1024,
    height: 1024,
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            gravity: { y: 0 },
            debug: false
        }
    }
};