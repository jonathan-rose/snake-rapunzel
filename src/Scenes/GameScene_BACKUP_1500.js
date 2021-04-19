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
<<<<<<< HEAD

var hairSection1 = new Array(); //array of sprites that make the hair sections
var hairSection2 = new Array();
var hairSection3 = new Array();
var hairPath1 = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var hairPath2 = new Array();
var hairPath3 = new Array();
var numhairSections = 10; //number of hair sections
var hairSpacer = 6; //parameter that sets the spacing between sections

=======
var gameOver = false;
var baseVelocity = 400;
var baseAccel = 10000;
var background;
var scissors;
>>>>>>> main

export default class GameScene extends Phaser.Scene {
	constructor () {
		super('Game');
	}


<<<<<<< HEAD
	create ()
	{
        //  A simple background for our game
        this.add.image(400, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();
=======
    create ()
    {
        const width = game.config.width;
        const height = game.config.height;
>>>>>>> main

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
<<<<<<< HEAD
        	key: 'left',
        	frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        	frameRate: 10,
        	repeat: -1
        });

        this.anims.create({
        	key: 'turn',
        	frames: [ { key: 'dude', frame: 4 } ],
        	frameRate: 20
        });

        this.anims.create({
        	key: 'right',
        	frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        	frameRate: 10,
        	repeat: -1
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
        	key: 'star',
        	repeat: 2,
        	setXY: { x: 12, y: 0, stepX: 70 }
=======
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
>>>>>>> main
        });

        this.anims.create({
          key: 'turn',
          frames: [{key: 'head', frame: 4}],
          frameRate: 20
        });
<<<<<<< HEAD

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
=======
>>>>>>> main
    }

    update ()
    {
<<<<<<< HEAD
    	if (cursors.left.isDown)
    	{
    		player.setVelocityX(-160);
    		updateHair();

    		player.anims.play('left', true);
    	}
    	else if (cursors.right.isDown)
    	{
    		player.setVelocityX(160);
    		updateHair();

    		player.anims.play('right', true);
    	}
    	else if (cursors.up.isDown)
    	{
    		player.setVelocityY(-160);
    		updateHair();

    		player.anims.play('right', true);

    	}
    	else if (cursors.down.isDown)
    	{
    		player.setVelocityY(160);
    		updateHair();

    		player.anims.play('right', true);
    	}
    	else
    	{
    		player.setVelocityX(0);
    		player.setVelocityY(0);

    		player.anims.play('turn');
    	}
    }
};

function collectStar (player, star)
{
	star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

        	child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

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
=======
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
>>>>>>> main
