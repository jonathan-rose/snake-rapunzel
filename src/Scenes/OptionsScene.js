import 'phaser';
import Button from '../Objects/Button';

export default class OptionsScene extends Phaser.Scene {
    constructor () {
        super('Options');
    }


    create () {
        this.model = this.sys.game.globals.model;
        var config = this.game.config;

        this.add.image(config.width/2, config.height/2, 'optionsMenuBG');

        this.musicButton = this.add.image(config.width*0.4, config.height*0.5, 'checkedBox');

        this.soundButton = this.add.image(config.width*0.4, config.height*0.65, 'checkedBox');

        this.musicButton.setInteractive();
        this.soundButton.setInteractive();

        this.musicButton.on('pointerdown', function () {
            this.model.musicOn = !this.model.musicOn;
            this.updateAudio();
        }.bind(this));

        this.soundButton.on('pointerdown', function () {
            this.model.soundOn = !this.model.soundOn;
            this.updateAudio();
        }.bind(this));

        this.updateAudio();

        this.menuButton = new Button(this, config.width*0.65, config.height*0.8, 'menuBtn', 'menuBtnPressed', '', 'Title');
        this.updateAudio();
    }

    updateAudio() {
        if (this.model.musicOn === false) {
            this.musicButton.setTexture('uncheckedBox');
            if (this.sys.game.globals.bgMusic != null) {
                this.sys.game.globals.bgMusic.stop();
            }
            this.model.bgMusicPlaying = false;
        } else {
            this.musicButton.setTexture('checkedBox');
            if (this.model.bgMusicPlaying === false) {
                this.sys.game.globals.bgMusic.play();
                this.model.bgMusicPlaying = true;
            }
        }

        if (this.model.soundOn === false) {
            this.soundButton.setTexture('uncheckedBox');
        } else {
            this.soundButton.setTexture('checkedBox');
        }
    }
};
