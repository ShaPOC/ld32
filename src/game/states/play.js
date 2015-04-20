/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The play state starts every initial setting and objects
 *  used by the game during gameplay.
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

/**
 * Private variables used by this object
 */
var cameraPos = new Phaser.Point(0, 0);

module.exports = {

    preload: function(){

        this.player = new (require("../gameobjects/player.js"))();
        this.map = new (require("../maps/airu_ruins.js"))();
    },

    create: function(){

        // Start the default Phaser Physics engine (we don't need box2d in this case)
        game.physics.startSystem(Phaser.Physics.P2JS);

        // Trigger the map creation
        this.map.create();

        // Set the gravity
        game.physics.p2.restitution = 0;
        game.physics.p2.gravity.y = 800;

        // Create the player and insert the input objectt
        this.player.create(
            new (require("../base/input.js"))(),
            this,
            this.map.getPlayerStart()
        );

        this.map.onDeathLocationOverlap( this.player.die );
        this.map.onWallJumpOverlap( this.player.wallContactBegin, this.player.wallContactEnd );

        // I'm not using the default camera follow because I want it smoothened
        // So set the camera to the player
        cameraPos.setTo(this.player.object.x, this.player.object.y);
    },

    update: function(){

        // Camera properties
        // the amount of damping, lower values = smoother camera movement
        var lerp = 0.1;
        cameraPos.x += (this.player.object.x - cameraPos.x) * lerp;
        cameraPos.y += (this.player.object.y - cameraPos.y) * lerp;

        game.camera.focusOnXY(cameraPos.x, cameraPos.y);

        // Update the map (mostly for parallax purposes)
        this.map.update();
        this.player.update();
    }
};