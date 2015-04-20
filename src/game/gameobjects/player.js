/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The player object and all of it's moves
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

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var player = function() {

    // Load up the texturepacker spritesheet and atlas
    game.load.atlasJSONHash('player', 'resources/player/player.png', 'resources/player/player.json');
};

/*
 |--------------------------------------------------------------------------
 | The create function, triggered when the state is started
 |--------------------------------------------------------------------------\
 */
player.prototype.create = function() {


};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------\
 */
player.prototype.update = function() {


};

/*
 |--------------------------------------------------------------------------
 |
 |--------------------------------------------------------------------------\
 |
 |
 */

player.prototype.insertSprites = function() {


};
// Export the prototype object
module.exports = player;