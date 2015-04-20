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
var player,
    cursors,
    jumpTimer = 0,
    touchingWall = false,
    wallJumping = false,
    wallSliding = false,
    attacking = false,
    sliding = false,
    slideTimer = 0,
    previousLocation = null,
    cameraPos = new Phaser.Point(0, 0);

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

        this.map.onDeathLocationOverlap(this.playerDeath);
        this.map.onWallJumpOverlap(this.wallContactBegin, this.wallContactEnd);

        // Get the map location for the player
        var playerSpawnObject = this.map.getPlayerStart();
        player = game.add.sprite(playerSpawnObject[0].x, playerSpawnObject[0].y, 'player');

        player.anchor.setTo(1,0);
        // add animation phases
        player.animations.add('idle', [
            'idle01.png',
            'idle02.png',
            'idle03.png',
            'idle04.png'
        ], 8, true);

        player.animations.add('run', [
            'run01.png',
            'run02.png',
            'run03.png',
            'run04.png',
            'run05.png',
            'run06.png',
            'run07.png',
            'run08.png'
        ], 8, true);

        player.animations.add('jump', [
            'jump01.png'
        ], 8, false);

        player.animations.add('punch', [
            'punch_hard01.png',
            'punch_hard02.png',
            'punch_hard03.png',
            'punch_hard04.png',
            'punch_hard05.png',
            'punch_hard06.png'
        ], 16, false);

        player.animations.add('punch_jump', [
            'punch_jump01.png',
            'punch_jump02.png',
            'punch_jump03.png',
            'punch_jump04.png',
            'punch_jump05.png',
            'punch_jump06.png'
        ], 16, false);

        player.animations.add('slide', [
            'slide01.png',
            'slide02.png',
            'slide03.png',
            'slide02.png',
            'slide01.png'
        ], 24, false);

        player.animations.add('walljump', [
            'walljump01.png'
        ], 8, true);

        player.animations.add('fall', [
            'fall01.png',
            'fall02.png',
            'fall03.png'
        ], 8, true);

        game.physics.p2.enable(player);

        player.body.fixedRotation = true;

        // play animation
        player.animations.play('idle');

        // I'm not using the default camera follow because I want it smoothened
        // So set the camera to the player
        cameraPos.setTo(player.x, player.y);

        game.physics.enable(player);

        // Set the first velocity
        previousLocation = {
            x: parseFloat(player.body.x).toFixed(2),
            y: parseFloat(player.body.y).toFixed(2)
        };

        cursors = game.input.keyboard.createCursorKeys();

        var jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(this.jumpButtonPressed, this);

        var slideButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
        slideButton.onDown.add(this.slideButtonPressed, this);

        var attackButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
        attackButton.onDown.add(this.attackButtonPressed, this);

        player.events.onAnimationComplete.add(this.playerAnimationComplete, this);
    },

    playerAnimationComplete: function() {
        if(player.animations.currentAnim.name === "punch" || player.animations.currentAnim.name === "punch_jump") {
            attacking = false;
        }
        if(player.animations.currentAnim.name === "slide") {
            sliding = false;
        }
    },

    wallContactBegin: function(wall){ if(touchingWall !== wall.data.id) { wallJumping = false; } touchingWall = wall.data.id; },

    wallContactEnd: function(){ touchingWall = false; wallSliding = false; },

    spriteOrientation: function(orientation){
        player.scale.x = orientation; //facing ori entation direction
    },

    attackButtonPressed: function() {
        if(!attacking && !sliding) {
            attacking = true;
            if(!this.checkIfCanJump()) {
                player.animations.play("punch_jump");
            } else {
                player.animations.play("punch");
            }
        }
    },

    slideButtonPressed: function() {

        var sliding_speed = 300;

        if(!sliding && !attacking && game.time.now > slideTimer) {

            slideTimer = game.time.now + 750;
            sliding = true;
            player.animations.play("slide");

            if( cursors.left.isDown ) {
                player.body.velocity.x = -sliding_speed;
            }
            if( cursors.right.isDown ) {
                player.body.velocity.x = sliding_speed;
            }
            if( cursors.up.isDown ) {
                player.body.velocity.y = -sliding_speed / 1.2;
            }

            if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
                if(player.scale.x > 0) {
                    player.body.velocity.x = sliding_speed;
                } else {
                    player.body.velocity.x = -sliding_speed;
                }
            }
        }
    },

    jumpButtonPressed: function() {

        if( wallSliding ) {

            if( cursors.left.isDown ) {
                this.playerWallJump(1);
            } else if( cursors.right.isDown ) {
                this.playerWallJump(-1);
            }

        } else if(game.time.now > jumpTimer && this.checkIfCanJump()) {

            this.playerJump();
        }
    },

    update: function(){

        // Reset wallsliding
        wallSliding = false;

        if (cursors.left.isDown && !sliding && (!attacking || (attacking && !this.checkIfCanJump())))
        {
            this.playerMove(-1);

            if(!attacking) {
                // If the player is falling
                if (this.checkIfCanJump()) {
                    wallJumping = false;
                    player.animations.play('run');
                } else if (touchingWall && parseFloat(player.body.y).toFixed(2) > previousLocation.y) {
                    if (!wallJumping) {
                        player.body.velocity.y = 0;
                    }
                    player.animations.play('walljump');
                    wallSliding = true;
                } else {
                    player.animations.play('fall');
                }
            }

            this.spriteOrientation(-1);
        }
        else if (cursors.right.isDown && !sliding && (!attacking || (attacking && !this.checkIfCanJump()))) {

            this.playerMove(1);

            if(!attacking) {
                // If the player is falling
                if (this.checkIfCanJump()) {
                    wallJumping = false;
                    player.animations.play('run');
                } else if (touchingWall && parseFloat(player.body.y).toFixed(2) > previousLocation.y) {
                    if (!wallJumping) {
                        player.body.velocity.y = 0;
                    }
                    player.animations.play('walljump');
                    wallSliding = true;
                } else {
                    player.animations.play('fall');
                }
            }

            this.spriteOrientation(1);
        }
        else
        {
            if(!attacking && !sliding) {
                // If the player is falling
                if (!this.checkIfCanJump()) {
                    player.animations.play('fall');
                } else {
                    player.animations.play('idle');
                    wallJumping = false;
                }
            }
            if(!wallJumping && !sliding) {

                player.body.velocity.x -= (player.body.velocity.x < 0) ? 10 : -10;
                if( player.body.velocity.x < 10 || player.body.velocity.x > -10) {
                    player.body.velocity.x = 0;
                }
            }
        }

        // Camera properties
        // the amount of damping, lower values = smoother camera movement
        var lerp = 0.1;
        cameraPos.x += (player.x - cameraPos.x) * lerp;
        cameraPos.y += (player.y - cameraPos.y) * lerp;

        game.camera.focusOnXY(cameraPos.x, cameraPos.y);

        // Update the map (mostly for parallax purposes)
        this.map.update();

        // Set the first velocity
        previousLocation = {
            x: parseFloat(player.body.x).toFixed(2),
            y: parseFloat(player.body.y).toFixed(2)
        };
    },

    playerMove: function(orientation) {

        var velocity = (wallJumping) ? 2 : 25;

        if(orientation > 0) {
            player.body.velocity.x = (player.body.velocity.x + velocity).clamp(-150, 150);
        } else {
            player.body.velocity.x = (player.body.velocity.x - velocity).clamp(-150, 150);
        }

        this.spriteOrientation(orientation);
    },

    playerWallJump: function(orientation){

        // Disable sliding for a short while to prevent cheating!
        slideTimer = game.time.now + 750;

        wallJumping = true;
        player.body.moveUp(300);
        player.body.velocity.x = 300 * orientation;
        this.spriteOrientation(orientation * -1);
    },

    playerJump: function() {

        wallJumping = false;
        sliding = false;
        player.animations.play('jump');

        if(attacking) {
            player.animations.play("punch_jump");
        }

        player.body.moveUp(300);
        jumpTimer = game.time.now + 250;
    },

    playerDeath: function() {

        console.log("Death");
        game.state.restart();
    },

    checkIfCanJump: function() {

        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;

        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
        {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === player.body.data || c.bodyB === player.body.data)
            {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === player.body.data) {
                    d *= -1;
                }
                if (d > 0.5) {
                    result = true;
                }
            }
        }

        return result;

    },
};