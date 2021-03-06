/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The complete in-game ui
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

var ui = function() {

    // Load up the texturepacker spritesheet and atlas
    game.load.atlasJSONHash('ui', 'resources/ui/ui.png', 'resources/ui/ui.json');
};

/*
 |--------------------------------------------------------------------------
 | Create the UI - called when the state starts
 |--------------------------------------------------------------------------\
 */
ui.prototype.create = function() {


};

/*
 |--------------------------------------------------------------------------
 | Create the UI - called when the state starts
 |--------------------------------------------------------------------------\
 */
ui.prototype.setHearts = function(current, max) {

    var i = 0;

    for(i; i < current; ++i) {
        game.add.sprite(5 + (i * 15), 5, 'ui', 'heart_full.png').fixedToCamera = true;
    }

    if(i < max) {
        for(i; i < max; ++i) {
            game.add.sprite(5 + (i * 15), 5, 'ui', 'heart_empty.png').fixedToCamera = true;
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------\
 */
ui.prototype.update = function() {


};

// Export the prototype object
module.exports = ui;