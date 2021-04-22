import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super('Preloader');
    }

    preload () {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        // add logo image
        var logo = this.add.image(width*0.5, height*0.2, 'Logo');
        logo.setScale(0.45);

        // display progress bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width*0.33, height*0.35, 320, 50);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width*0.34, height*0.36, 300 * value, 30);
        });

        // update file progress text
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // load assets needed in our game
        
        this.load.audio('bgMusic', ['assets/Wholesome.mp3']);
        this.load.audio('snip', ['assets/snip.mp3']);
        this.load.audio('levelUp', ['assets/levelUp.wav']);

        this.load.image('menuBG', 'assets/menuBG.png');
        this.load.image('optionsMenuBG', 'assets/optionsMenuBG.png');
        this.load.image('creditsMenuBG', 'assets/creditsMenuBG.png');
        this.load.image('aboutMenuBG', 'assets/aboutMenuBG.png');

        this.load.image('playBtn', 'assets/playBtn.png');
        this.load.image('playBtnPressed', 'assets/playBtnPressed.png');
        this.load.image('optionsBtn', 'assets/optionsBtn.png');
        this.load.image('optionsBtnPressed', 'assets/optionsBtnPressed.png');
        this.load.image('creditsBtn', 'assets/creditsBtn.png');
        this.load.image('creditsBtnPressed', 'assets/creditsBtnPressed.png');
        this.load.image('menuBtn', 'assets/menuBtn.png');
        this.load.image('menuBtnPressed', 'assets/menuBtnPressed.png');

        this.load.image('checkedBox', 'assets/checkedBox.png');
        this.load.image('uncheckedBox', 'assets/uncheckedBox.png');

        this.load.image('background', 'assets/background.png');
        this.load.image('scissors', 'assets/scissors.png');
        this.load.spritesheet('snake', 'assets/snake.png', {frameWidth: 150, frameHeight: 150});
        this.load.image('hair', 'assets/hair.png');


        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.game.registry.set('bgMusic', this.sound.add('bgMusic', { volume: 0.5, loop: true }));
            this.game.registry.set('snip', this.sound.add('snip', { volume: 0.5 }));
            this.game.registry.set('levelUp', this.sound.add('levelUp', { volume: 0.5 }));
            this.ready();
        }.bind(this));

        this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);
    }

    create () {
    }

    init () {
        this.readyCount = 0;
    }

    ready () {
        this.scene.start('Title');
        // this.readyCount++;
        // if (this.readyCount === 20) {
        //     this.scene.start('Credits');
        // }
    }
};
