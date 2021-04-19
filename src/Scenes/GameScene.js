import 'phaser';
import Button from '../Objects/Button';

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var baseVelocity = 400;
var baseAccel = 10000;
var background;
var scissors;

export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }


    create ()
    {
        const width = game.config.width;
        const height = game.config.height;

        //Create world bounds
        this.physics.world.setBounds(0, 0, width * 2, height * 2);
        

        //Set camera bounds to match world        
        this.cameras.main.setBounds(0, 0, width * 2, height * 2);
        // this.cameras.main.setZoom(0.5);

        background = this.add.tileSprite(0, 0, width * 2, height * 2, 'background');
        background.setTileScale(2, 2); //Scale factors of tile
        background.setOrigin(0, 0);

        player = this.physics.add.sprite(width * 0.5, height * 0.5, 'head');
        player.setOrigin(0.5,0.5);
        player.setBounce(0.2);
        player.setDamping(true);
        player.setMaxVelocity(500);
        player.setCollideWorldBounds(true);

        scissors = this.physics.add.sprite(100, 100, 'scissors');
        scissors.setScale(3);


        cursors = this.input.keyboard.createCursorKeys();

        // Load sprite frames
        this.anims.create({
          key: 'up',
          frames: this.anims.generateFrameNumbers('head', {start: 0, end: 0}),
          framerate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: 'down',
          frames: this.anims.generateFrameNumbers('head', {start: 1, end: 1}),
          framerate: 10,
          repeat: -1,
        });

        this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('head', {start: 2, end: 2}),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('head', {start: 3, end: 3}),
          frameRate: 10,
          repeate: -1
        });

        this.anims.create({
          key: 'turn',
          frames: [{key: 'head', frame: 4}],
          frameRate: 20
        });
    }

    update ()
    {
        //Make camera follow player
        this.cameras.main.startFollow(player);

        player.setVelocity(0);

        if (cursors.left.isDown)
        {
          player.setAcceleration(-baseAccel, 0);
          player.setVelocityX(-baseVelocity);
          player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
          player.setAcceleration(baseAccel, 0);
          player.setVelocityX(baseVelocity);
          player.anims.play('right', true);
        }
        else if (cursors.up.isDown)
        {
          player.setAcceleration(0, -baseAccel);
          player.setVelocityY(-baseVelocity);
          player.anims.play('up', true);
        }
        else if (cursors.down.isDown)
        {
          player.setAcceleration(0, baseAccel);
          player.setVelocityY(baseVelocity);
          player.anims.play('down', true);
        }
    }
};