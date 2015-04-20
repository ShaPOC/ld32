/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The stonehead enemy
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

// Option
// Only check once every ... ms if there is a player near
var wakeCheckTime = 1200;

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var stonehead = function(player) {

    // This enemey is always inactive until it senses someone
    this.active = false;
    // Set the player so we can intersect with it
    this.player = player;
    // There is a timer in which every stonehead enemey checks if there is player near
    this.wakeTimer = game.time.now + wakeCheckTime;
};

/*
 |--------------------------------------------------------------------------
 | The spawn
 |--------------------------------------------------------------------------
 */
stonehead.prototype.spawn = function(location, orientation) {

    // We need this
    var these = this;

    // Waking up
    this.waking = false;

    this.object = game.add.sprite(location.x, location.y, 'enemies');

    this.addAnimations();

    game.physics.p2.enable(this.object);
    // Set the anchor to the center for the body for the physics
    this.object.anchor.setTo(0.5,0.5);

    // Make sure it doesn't tumble over, the player can stand up
    this.object.body.fixedRotation = true;

    // Set the shape
    this.object.body.clearShapes();
    this.object.body.addRectangle(20, 42);
    //this.object.body.debug = true;

    this.object.body.mass = 6;

    this.object.anchor.set(0.5, 0.5);

    // play the default animation
    this.object.animations.play('idle');

    // Set the orientation
    this.object.scale.x = parseInt(orientation);

    this.object.events.onAnimationComplete.add(function(){
        these.animationComplete();
    });
    this.object.events.onAnimationLoop.add(function(){
        these.animationComplete();
    });
};

/*
 |--------------------------------------------------------------------------
 | Private method to add player animations
 |--------------------------------------------------------------------------
 */
stonehead.prototype.animationComplete = function() {
    if(this.object.animations.currentAnim.name === "activate") {
        this.waking = false;
    }
};

/*
 |--------------------------------------------------------------------------
 | Private method to add player animations
 |--------------------------------------------------------------------------
 */
stonehead.prototype.addAnimations = function() {

    // add animation phases
    this.object.animations.add('idle', [
        'stonehead_Idle01.png'
    ], 8, false);

    // add animation phases
    this.object.animations.add('activate', [
        'stonehead_activate01.png',
        'stonehead_activate02.png',
        'stonehead_activate03.png',
        'stonehead_activate04.png',
        'stonehead_activate05.png',
        'stonehead_activate06.png',
        'stonehead_activate07.png'
    ], 12, false);

    // add animation phases
    this.object.animations.add('move', [
        'stonehead_move01.png',
        'stonehead_move02.png',
        'stonehead_move03.png',
        'stonehead_move04.png',
        'stonehead_move05.png'
    ], 12, false);

    // add animation phases
    this.object.animations.add('death', [
        'stonehead_death01.png',
        'stonehead_death02.png',
        'stonehead_death03.png',
        'stonehead_death04.png'
    ], 8, false);
};

stonehead.prototype.activate = function() {

    // Set to active
    this.active = true;
    this.waking = true;

    this.object.animations.play("activate");
};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------
 */
stonehead.prototype.update = function() {

    // Check again
    if(!this.active) {

        if(this.wakeTimer < game.time.now) {

            this.wakeTimer = game.time.now + wakeCheckTime;

            if( Phaser.Rectangle.contains(
                new Phaser.Rectangle(
                    this.object.x - 100,
                    this.object.y,
                    200,
                    80
                ),
                this.player.object.x,
                this.player.object.y
            ) ) {
                this.activate();
            }
        }

    } else {

        if(!this.waking) {


        }

        
    }
};

// Export the prototype object
module.exports = stonehead;