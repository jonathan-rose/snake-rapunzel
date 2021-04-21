import 'phaser';
import Button from '../Objects/Button';

export default class AboutScene extends Phaser.Scene {
    constructor () {
        super('About');
    }


    create () {
        var config = this.game.config;
        this.model = this.sys.game.globals.model;
        this.add.image(config.width*0.5, config.height*0.5, 'creditsMenuBG');

        this.menuButton = new Button(this, config.width*0.5, config.height*0.8, 'menuBtn', 'menuBtnPressed', '', 'Title');

    }

};
