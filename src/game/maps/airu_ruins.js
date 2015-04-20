/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
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

// The base class to extend from
var map = require("../base/map.js");

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var airu_ruins = function() {

    // Call the parent function and insert the mapname
    map.apply(this, ["airu_ruins"]);

    // The parralax background images
    game.load.image('background_tile01', 'resources/maps/airu_ruins_background_01.png');
    game.load.image('background_tile02', 'resources/maps/airu_ruins_background_02.png');
};

// Set map's prototype to airu_ruins's prototype to "extend" it
airu_ruins.prototype = Object.create(map.prototype);
// Set the constructor back
airu_ruins.prototype.constructor = airu_ruins;

/*
 |--------------------------------------------------------------------------
 | The create function, triggered when the state is started
 |--------------------------------------------------------------------------
 */
airu_ruins.prototype.create = function() {

    // And a default background color
    game.stage.backgroundColor = '#0e1115';

    // Create the parallax backgrounds
    this.bgtile01 = game.add.tileSprite(0, 0, game.width, game.height, 'background_tile01');
    this.bgtile01.fixedToCamera = true;

    this.bgtile02 = game.add.tileSprite(0, 0, game.width, game.height, 'background_tile02');
    this.bgtile02.fixedToCamera = true;

    // Call the parent function
    map.prototype.create.call(this);
};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------
 */
airu_ruins.prototype.update = function() {

    this.bgtile01.tilePosition.set( game.camera.x * -0.05, game.camera.y * -0.07 );
    this.bgtile02.tilePosition.set( game.camera.x * -0.08, game.camera.y * -0.065 );
};

// Export the prototype object
module.exports = airu_ruins;