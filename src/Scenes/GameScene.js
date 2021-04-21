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
var scissorText;
var roundText;
var roundNumber = 1;
var baseVelocity = 400;
var background;
var scissors;
var scissorsMax = 19; //bodge to deal with starting at 0, means there are 20 total
var scissorsCount = 10;
var scissorsMinVel = 100;
var scissorsMaxVel = 200;
var scissorsMinAngVel = -200;
var scissorsMaxAngVel = 200;

var timer;
var timerLength = 10000; //ms

var hairSection1 = new Array(); //array of sprites that make the hair sections
var hairSection2 = new Array();
var hairSection3 = new Array();
var hairPath1 = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var hairPath2 = new Array();
var hairPath3 = new Array();
var numhairSections = 20; //number of hair sections
var hairSpacer = 4; //parameter that sets the spacing between sections - 3 for one long hair, 4 for blocks


export default class GameScene extends Phaser.Scene {
	constructor () {
		super('Game');
	}


	create ()
	{
		var width = game.config.width;
		var height = game.config.height;
        //Create world bounds
        this.physics.world.setBounds(0, 0, width * 2, height * 2);
        

        //Set camera bounds to match world        
        this.cameras.main.setBounds(0, 0, width * 2, height * 2);
        // this.cameras.main.setZoom(0.5);

        background = this.add.tileSprite(0, 0, width * 2, height * 2, 'background');
        background.setTileScale(2, 2); //Scale factors of tile
        background.setOrigin(0, 0);

        player = this.physics.add.sprite(width * 0.5, height * 0.5, 'snake');
        player.setOrigin(0.5,0.5);
        player.setBounce(0.2);
        player.setDamping(true);
        player.setMaxVelocity(500);
        player.setCollideWorldBounds(true);

        cursors = this.input.keyboard.createCursorKeys();

        scissors = this.physics.add.group();

        //Timer for spawning more scissors every timerLength miliseconds
        timer = this.time.addEvent({
            delay: timerLength,
            callback: onTimerEvent,
            loop: true,
          });
        
        // Load sprite frames
        this.anims.create({
        	key: 'up',
        	frames: this.anims.generateFrameNumbers('snake', {start: 0, end: 3}),
        	frameRate: 10,
        	repeat: -1,
        });

        this.anims.create({
        	key: 'down',
        	frames: this.anims.generateFrameNumbers('snake', {start: 8, end: 11}),
        	frameRate: 10,
        	repeat: -1,
        });

        this.anims.create({
        	key: 'left',
        	frames: this.anims.generateFrameNumbers('snake', {start: 4, end: 7}),
        	frameRate: 10,
        	repeat: -1
        });

        this.anims.create({
        	key: 'right',
        	frames: this.anims.generateFrameNumbers('snake', {start: 12, end: 15}),
        	frameRate: 10,
        	repeat: -1
        });

        bombs = this.physics.add.group();

        //  Init hairSection array
        for (var i = 1; i <= numhairSections-1; i++)
        {
        	hairSection1[i] = this.physics.add.sprite(400, 300, 'hair');
        	hairSection2[i] = this.physics.add.sprite(400, 300, 'hair');
        	hairSection3[i] = this.physics.add.sprite(400, 300, 'hair');
        }

    	//  Init hairPath array
    	for (var i = 0; i <= numhairSections * hairSpacer; i++)
    	{
    		hairPath1[i] = new Phaser.Geom.Point(400, 300);
    		hairPath2[i] = new Phaser.Geom.Point(400, 300);
    		hairPath3[i] = new Phaser.Geom.Point(400, 300);
    	}

        //  The score
        // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        roundText = this.add.text(16, 16, 'round: ' + roundNumber, { fontSize: '32px', fill: '#000' });
        scissorText = this.add.text(16, 48, 'scissors: ' + scissorsMax, { fontSize: '32px', fill: '#000' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(bombs, platforms);

        //this.physics.add.collider(player, scissors);

        this.physics.add.collider(hairSection1, scissors, hitScissors, null, this);
        this.physics.add.collider(hairSection2, scissors, hitScissors, null, this);
        this.physics.add.collider(hairSection3, scissors, hitScissors, null, this);
    }

    update ()
    {
        this.cameras.main.startFollow(player);

        console.log(scissors.countActive());

        scissorText.setText('scissors: ' + scissors.countActive());

        updateHair();
        //player.setVelocity(0);
        

        if (cursors.left.isDown)
        {
        	player.setVelocity(-baseVelocity, 0);
        	player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
        	player.setVelocity(baseVelocity, 0);
        	player.anims.play('right', true);
        }
        else if (cursors.up.isDown)
        {
        	player.setVelocity(0, -baseVelocity);
        	player.anims.play('up', true);
        }

        else if (cursors.down.isDown)
        {
        	player.setVelocity(0, baseVelocity);
        	player.anims.play('down', true);
        }

        var width = game.config.width;
        var height = game.config.height;

        var randGameX = Phaser.Math.Between(50, width);
        var randGameY = Phaser.Math.Between(50, height);
        addScissors(randGameX, randGameY);



    }
};

function updateHair()
{
	// Everytime the hair head moves, insert the new location at the start of the array, 
    // and knock the last position off the end

    var part1 = hairPath1.pop(); //last item
    var part2 = hairPath2.pop();
    var part3 = hairPath3.pop();
    
    if (player.body.velocity.x == 0)
    {
    	part1.setTo(player.x +26, player.y); //move last item to players position
    	part3.setTo(player.x -26, player.y);
    }
    else if (player.body.velocity.y == 0)
    {
    	part1.setTo(player.x, player.y+26); //move last item to players position
    	part3.setTo(player.x, player.y-26);

    }
    part2.setTo(player.x, player.y);

    hairPath1.unshift(part1); //add to front of the array
    hairPath2.unshift(part2);
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

function addScissors(x, y)
{
	if (scissorsCount <= scissorsMax) {
		var scissor = scissors.create(x, y, 'scissors');
		scissor.setScale(1);
		scissor.setVelocity(Phaser.Math.Between(-scissorsMinVel, scissorsMaxVel), Phaser.Math.Between(-scissorsMinVel, scissorsMaxVel));
		scissor.setAngularVelocity(Phaser.Math.Between(scissorsMinAngVel, scissorsMaxAngVel));
		scissor.setCollideWorldBounds(true);
		scissor.setBounce(Phaser.Math.Between(1, 5));
		scissor.setMaxVelocity(scissorsMaxVel);
		scissorsCount = scissors.countActive(); // updates scissor count when a scissor is created
	}
}

function hitScissors (hair, scissor)
{
	scissor.destroy();
	scissorsCount = scissors.countActive(); // updates scissor count when a scissor is destroyed
	hair.disableBody(true, true);
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

function onTimerEvent()
{
    roundNumber++;
    scissorsMax = scissorsMax + 5;
    roundText.setText('round: ' + roundNumber)
}
