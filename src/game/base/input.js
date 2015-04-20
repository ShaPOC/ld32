/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  All input is processed here and given back to the game
 *  with event dispatchers. This way, all different ways to
 *  interact with the game (keyborad, gamepad and perhaps in
 *  the future touch) is handled here.
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

// Require the node util module
var util = require('util'),
    EventEmitter = require('events').EventEmitter;

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var input = function() {

    this.available = {
        "left" : [

        ],
        "right" : [

        ],
        "up" : [

        ],
        "down" : [

        ],
        "attack" : [

        ],
        "jump" : [

        ],
        "dash" : [

        ]
    };
};
// Inherit the eventemitter super class
util.inherits(input, EventEmitter);

/*
 |--------------------------------------------------------------------------
 |
 |--------------------------------------------------------------------------\
 |
 |
 */

input.prototype.onDown = function() {


};

/*
 |--------------------------------------------------------------------------
 |
 |--------------------------------------------------------------------------\
 |
 |
 */

input.prototype.onUp = function() {


};

/*
 |--------------------------------------------------------------------------
 |
 |--------------------------------------------------------------------------\
 |
 |
 */

input.prototype.onPressed = function() {


};

// Export the prototype object
module.exports = input;