/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  This is the entrance to everything. Phaser and every
 *  state is loaded here and the boot is called.
 *  Furthermore, global plugins used in the entire game are
 *  loaded here.
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

//We use window.game because we want it to be accessible from everywhere
window.game = new Phaser.Game(256, 224, Phaser.AUTO, "");

game.globals = {
    //Add variables here that you want to access globally
    //score: 0 could be accessed as game.globals.score for example
};

window.plugins = new Phaser.PluginManager(game);

game.state.add('play', require('./states/play.js'));
game.state.add('load', require('./states/load.js'));
game.state.add('menu', require('./states/menu.js'));
game.state.add('boot', require('./states/boot.js'));

// Add the plugin to use Tiled Tilemaps in the most performance enhanced way possible
window.plugins.add(new Phaser.Plugin.Tiled(game));

game.state.start('boot');