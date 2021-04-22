import 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
	constructor () {
		super('Title');
	}

	preload () {
	}

	create () {
		var config = this.game.config;

        this.add.image(config.width/2, config.height/2, 'menuBG');

        // Game - Head to Rocket Select page
        this.gameButton = new Button(this, config.width*0.5, config.height/2 + 60, 'playBtn', 'playBtnPressed', '', 'About');

        // Options
        this.optionsButton = new Button(this, config.width*0.5, config.height/2 + 170, 'optionsBtn', 'optionsBtnPressed', '', 'Options');

        // About
        this.aboutButton = new Button(this, config.width*0.5, config.height/2 + 280, 'creditsBtn', 'creditsBtnPressed', '', 'Credits');

        this.model = this.sys.game.globals.model;
        if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
            this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
            this.bgMusic.play();
            this.model.bgMusicPlaying = true;
            this.sys.game.globals.bgMusic = this.bgMusic;
        }
        this.snipSound = this.sound.add('snip', { volume: 0.5 });
    }
};
