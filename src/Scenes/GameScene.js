import 'phaser';
import Button from '../Objects/Button';

var player;
var stars;
var bombs;
var platforms;
var hairGroup;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;
var baseVelocity = 400;
var baseAccel = 10000;
var background;
var scissors;

var hairSection1 = new Array(); //array of sprites that make the hair sections
var hairSection2 = new Array();
var hairSection3 = new Array();
var hairPath1 = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var hairPath2 = new Array();
var hairPath3 = new Array();
var numhairSections = 10; //number of hair sections
var hairSpacer = 6; //parameter that sets the spacing between sections


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

        bombs = this.physics.add.group();

        //  Init hairSection array
        for (var i = 1; i <= numhairSections-1; i++)
        {
        	hairSection1[i] = this.physics.add.sprite(400, 300, 'star');
        	hairSection2[i] = this.physics.add.sprite(400, 300, 'star');
        	hairSection3[i] = this.physics.add.sprite(400, 300, 'star');
        }

    	//  Init hairPath array
    	for (var i = 0; i <= numhairSections * hairSpacer; i++)
    	{
    		hairPath1[i] = new Phaser.Geom.Point(400, 300);
    		hairPath2[i] = new Phaser.Geom.Point(400, 300);
    		hairPath3[i] = new Phaser.Geom.Point(400, 300);
    	}

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);

        this.physics.add.collider(hairSection1, bombs, hitBomb, null, this);
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


          updateHair();
	  player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
          player.setAcceleration(baseAccel, 0);
          player.setVelocityX(baseVelocity);


          updateHair();
	  player.anims.play('right', true);
        }
        else if (cursors.up.isDown)
        {
          player.setAcceleration(0, -baseAccel);
          player.setVelocityY(-baseVelocity);
          updateHair();
	  player.anims.play('up', true);
        }

        else if (cursors.down.isDown)
        {
          player.setAcceleration(0, baseAccel);
          player.setVelocityY(baseVelocity);
          updateHair();
	  player.anims.play('down', true);
        }
    }
};
function updateHair()
{
	// Everytime the hair head moves, insert the new location at the start of the array, 
    // and knock the last position off the end

    var part1 = hairPath1.pop();
    part1.setTo(player.x - 10, player.y -10);
    hairPath1.unshift(part1);

    var part2 = hairPath2.pop();
    part2.setTo(player.x, player.y);
    hairPath2.unshift(part2);

    var part3 = hairPath3.pop();
    part3.setTo(player.x +10, player.y +10);
    hairPath3.unshift(part3);

    for (var i = 1; i <= numhairSections - 1; i++)
    {
    	hairSection1[i].x = (hairPath1[i * hairSpacer]).x;
    	hairSection1[i].y = (hairPath1[i * hairSpacer]).y;

    	hairSection2[i].x = (hairPath2[i * hairSpacer]).x;
    	hairSection2[i].y = (hairPath2[i * hairSpacer]).y;

    	hairSection3[i].x = (hairPath3[i * hairSpacer]).x;
    	hairSection3[i].y = (hairPath3[i * hairSpacer]).y;
    }
}








function hitBomb (player, bomb)
{
    var config = this.game.config;
    this.model = this.sys.game.globals.model; 

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    var timer = this.time.delayedCall(1000, function(){
        var popup = this.add.image(config.width/2, config.height/2, 'deathScene')
        this.add.text(355, 410, score, { fontSize: '80px', fill: '#FFF' });
        var menuButton = new Button(this, 200, 550, 'Button', 'ButtonPressed', 'Menu', 'Title');
        var playButton = new Button(this, 600, 550, 'Button', 'ButtonPressed', 'Play Again', 'Game');

        if (score > this.model.highscore) {
            this.model.highscore = score;
            var newhighscoretext = this.add.text(500, 290, 'New High Score!', { fontSize: '20px', fill: '#F9BE4F' });
            newhighscoretext.angle = 35;
        }

        score = 0;
    }, [], this); 
}
