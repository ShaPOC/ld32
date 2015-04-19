/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The boot state loads the most essential stuff including
 *  the loading screen and when done, it starts the loading
 *  screen which loads the rest.
 *
 *  Phaser version 2.3.0 "Tarabon"
 *  --------------------------------------------------------
 *  @package    [[GAME_TITLE]]
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    0.0.1
 *  @since      File available since Release 0.0.1
 */

'use strict';

module.exports = {

    init: function () {
        //Add here your scaling options
    },

    preload: function () {
        //Load just the essential files for the loading screen,
        //they will be used in the Load State
        game.load.image('loading', 'resources/ui/loading.png');
        game.load.image('load_progress_bar', 'resources/ui/progress_bar_bg.png');
        game.load.image('load_progress_bar_dark', 'resources/ui/progress_bar_fg.png');
    },

    create: function () {

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        //screen size will be set automatically
        game.scale.setScreenSize(true);

        game.state.start('load');
    }
};