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

// PUT THIS VARIABLE IN A SEPERATE OBJECT LATER!
var cursors;

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var player = function() {

    // Load up the texturepacker spritesheet and atlas
    game.load.atlasJSONHash('player', 'resources/player/player.png', 'resources/player/player.json');
    // Load up the effects as well
    game.load.atlasJSONHash('effects', 'resources/effects/effects.png', 'resources/effects/effects.json');

    // Set default options
    this.maxHealth = 5;
};

/*
 |--------------------------------------------------------------------------
 | The create function, triggered when the state is started
 |--------------------------------------------------------------------------
 */
player.prototype.create = function(input, state ,playerstart) {

    // We have some callbacks we need filled
    var these = this;

    this.object = game.add.sprite(playerstart[0].x, playerstart[0].y, 'player');

    // Default class variables
    this.jumpTimer = 0;
    this.dashTimer = 0;
    this.spinkickTimer = 0;
    // The player health
    this.health = this.maxHealth;

    this.object.touchingWall = false;
    this.object.wallJumping = false;
    this.object.wallSliding = false;
    this.object.spinKicking = false;
    this.object.attacking = false;
    this.object.dashing = false;

    game.physics.p2.enable(this.object);

    // create capguy sprite
    this.windforce = game.add.sprite(-100, 0, 'effects', 'wind_gust01.png');

    // add animation phases
    this.windforce.animations.add('blow', [
        'wind_gust05.png',
        'wind_gust04.png',
        'wind_gust03.png',
        'wind_gust02.png',
        'wind_gust01.png'
    ], 30, false);

    // Make sure it's strong enough
    this.windforce.mass = 12;

    game.physics.p2.enable(this.windforce);
    // Set the anchor to the center for the body for the physics
    this.windforce.anchor.setTo(0.5,0.5);

    // Set the shape
    this.windforce.body.clearShapes();
    this.windforce.body.addCircle(22);
    // Make sure it doesn't tumble over, the player can stand up
    this.windforce.body.fixedRotation = true;

    // Set the first location found
    this.previousLocation = {
        x: parseFloat(this.object.body.x).toFixed(2),
        y: parseFloat(this.object.body.y).toFixed(2)
    };

    this.addAnimations();

    // Set the anchor to the center for the body for the physics
    this.object.anchor.setTo(0.5,0.5);

    // Make sure it doesn't tumble over, the player can stand up
    this.object.body.fixedRotation = true;

    // Set the shape
    this.object.body.clearShapes();
    this.object.body.addRectangle(18, 28);

    // play the default animation
    this.object.animations.play('idle');

    this.object.events.onAnimationComplete.add(function(){
        these.playerAnimationComplete();
    }, state);
    this.object.events.onAnimationLoop.add(function(){
        these.playerAnimationComplete();
    }, state);

    cursors = game.input.keyboard.createCursorKeys();

    var jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpButton.onDown.add(this.jump, this);

    var dashButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    dashButton.onDown.add(this.dash, this);

    var attackButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
    attackButton.onDown.add(this.attack, this);

    var spinkickButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
    spinkickButton.onDown.add(this.spinkick, this);
};

/*
 |--------------------------------------------------------------------------
 | Private method to add player animations
 |--------------------------------------------------------------------------
 */
player.prototype.addAnimations = function() {

    // add animation phases
    this.object.animations.add('idle', [
        'idle01.png',
        'idle02.png',
        'idle03.png',
        'idle04.png'
    ], 8, true);

    this.object.animations.add('run', [
        'run01.png',
        'run02.png',
        'run03.png',
        'run04.png',
        'run05.png',
        'run06.png',
        'run07.png',
        'run08.png'
    ], 8, true);

    this.object.animations.add('jump', [
        'jump01.png'
    ], 8, false);

    this.object.animations.add('punch', [
        'punch01.png',
        'punch02.png',
        'punch03.png',
        'punch04.png',
        'punch05.png',
        'punch04.png',
        'punch03.png',
        'punch02.png',
        'punch01.png',
    ], 24, false);


    this.object.animations.add('spinkick', [
        'punch01.png',
        'punch02.png',
        'punch03.png',
        'punch04.png',
        'punch05.png',
        'punch04.png',
        'punch03.png',
        'punch02.png',
        'punch01.png',
    ], 24, false);

    this.object.animations.add('punch_hard', [
        'punch_hard01.png',
        'punch_hard02.png',
        'punch_hard03.png',
        'punch_hard04.png',
        'punch_hard05.png',
        'punch_hard06.png'
    ], 24, false);

    this.object.animations.add('punch_jump', [
        'punch_jump01.png',
        'punch_jump02.png',
        'punch_jump03.png',
        'punch_jump04.png',
        'punch_jump05.png',
        'punch_jump06.png'
    ], 24, false);

    this.object.animations.add('spinkick', [
        'spinkick01.png',
        'spinkick02.png',
        'spinkick03.png',
        'spinkick04.png',
        'spinkick05.png'
    ], 24, false);

    this.object.animations.add('dash', [
        'dash01.png',
        'dash02.png',
        'dash03.png',
        'dash02.png',
        'dash01.png'
    ], 24, false);

    this.object.animations.add('walljump', [
        'walljump01.png'
    ], 8, true);

    this.object.animations.add('fall', [
        'fall01.png',
        'fall02.png',
        'fall03.png'
    ], 8, true);
};

/*
 |--------------------------------------------------------------------------
 | Triggered everytime an animation completes or loops
 |--------------------------------------------------------------------------
 */
player.prototype.playerAnimationComplete = function() {

    if(this.object.animations.currentAnim.name === "punch" || this.object.animations.currentAnim.name === "punch_hard" || this.object.animations.currentAnim.name === "punch_jump") {
        this.object.attacking = false;
    }
    if(this.object.animations.currentAnim.name === "spinkick") {
        this.object.attacking = false;
        this.object.spinKicking = false;
        if(this.isOnTheGround()) {
            this.spawnWindGust();
        }
    }
    if(this.object.animations.currentAnim.name === "dash") {
        this.object.dashing = false;
    }
};

/*
 |--------------------------------------------------------------------------
 | Check if the player is on the ground or airborne
 |--------------------------------------------------------------------------
 */
player.prototype.isOnTheGround = function() {

    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;

    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];

        if (c.bodyA === this.object.body.data || c.bodyB === this.object.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === this.object.body.data) {
                d *= -1;
            }
            if (d > 0.5) {
                result = true;
            }
        }
    }

    return result;

};

/*
 |--------------------------------------------------------------------------
 | Set the orientation (flip the sprite)
 |--------------------------------------------------------------------------
 */
player.prototype.spriteOrientation = function(orientation){

    this.object.scale.x = orientation; //facing orientation direction

};

/*
 |--------------------------------------------------------------------------
 | Wall contact events for wallgrab / wallslide
 |--------------------------------------------------------------------------
 */

player.prototype.wallContactBegin = function(wall){

    if(wall.sprite.touchingWall !== wall.data.id) {
        wall.sprite.wallJumping = false;
    }
    wall.sprite.touchingWall = wall.data.id;
};

player.prototype.wallContactEnd = function(wall){

    wall.sprite.touchingWall = false;
    wall.sprite.wallSliding = false;

};

/*
 |--------------------------------------------------------------------------
 | Movement
 |--------------------------------------------------------------------------
 */
player.prototype.move = function(orientation) {

    var velocity = (this.object.wallJumping) ? 2 : 25;

    if(orientation > 0) {
        this.object.body.velocity.x = (this.object.body.velocity.x + velocity).clamp(-150, 150);
    } else {
        this.object.body.velocity.x = (this.object.body.velocity.x - velocity).clamp(-150, 150);
    }

    this.spriteOrientation(orientation);
};

/*
 |--------------------------------------------------------------------------
 | Jumping and walljumping
 |--------------------------------------------------------------------------
 */

player.prototype.walljump = function(orientation){

    // Disable sliding for a short while to prevent cheating!
    this.dashTimer = game.time.now + 750;

    this.object.wallJumping = true;
    this.object.body.moveUp(300);
    this.object.body.velocity.x = 300 * orientation;

    this.spriteOrientation(orientation * -1);

};

player.prototype.jump = function() {

    if (this.object.wallSliding) {

        if (cursors.left.isDown) {
            this.walljump(1);
        } else if (cursors.right.isDown) {
            this.walljump(-1);
        }

    } else if (game.time.now > this.jumpTimer && this.isOnTheGround()) {

        this.object.wallJumping = false;
        this.object.dashing = false;
        this.object.animations.play('jump');

        // We get the current attacking phase, and resume it in the air
        if (this.object.attacking) {
            this.object.animations.play("punch_jump");
        }

        this.object.body.moveUp(300);
        this.jumpTimer = game.time.now + 250;
    }
};

/*
 |--------------------------------------------------------------------------
 | Attacking
 |--------------------------------------------------------------------------
 */

player.prototype.attack = function() {

    if (!this.object.attacking && !this.object.dashing) {
        this.object.attacking = true;
        if (!this.isOnTheGround()) {
            this.object.animations.play("punch_jump");
        } else {
            this.object.animations.play("punch_hard");
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Spin kick
 |--------------------------------------------------------------------------
 */

player.prototype.spinkick = function() {

    if (!this.object.attacking && !this.object.dashing && !this.isOnTheGround() && game.time.now > this.spinkickTimer) {

        this.object.spinKicking = true;
        this.object.attacking = true;

        this.object.animations.play("spinkick");
        this.object.body.velocity.y = 500;

        this.spinkickTimer = game.time.now + 650;
    }
};

/*
 |--------------------------------------------------------------------------
 | Dashing
 |--------------------------------------------------------------------------
 */

player.prototype.dash = function() {

    var dashing_speed = 300;

    if (!this.object.dashing && !this.object.attacking && game.time.now > this.dashTimer) {

        this.dashTimer = game.time.now + 750;
        this.object.dashing = true;
        this.object.animations.play("dash");

        if (cursors.left.isDown) {
            this.object.body.velocity.x = -dashing_speed;
        }
        if (cursors.right.isDown) {
            this.object.body.velocity.x = dashing_speed;
        }
        if (cursors.up.isDown) {
            this.object.body.velocity.y = -dashing_speed / 1.2;
        }

        if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {

            if (this.object.scale.x > 0) {
                this.object.body.velocity.x = dashing_speed;
            } else {
                this.object.body.velocity.x = -dashing_speed;
            }
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Spawn a gust of wind away from the player
 |--------------------------------------------------------------------------
 */
player.prototype.spawnWindGust = function() {

    this.windforce.body.y = this.object.body.y;

    this.windforce.alpha = 1;

    // Set the right direction
    this.windforce.scale.x = -this.object.scale.x;

    if(this.object.scale.x > 0) {
        this.windforce.body.x = this.object.body.x + 20;
        this.windforce.body.velocity.x = 700;
    } else {
        this.windforce.body.x = this.object.body.x - 20;
        this.windforce.body.velocity.x = -700;
    }

    // Fade out the gust
    var fadeOutTween = game.add.tween(this.windforce).to( { alpha: 0 }, 600, Phaser.Easing.Linear.None).start();
    fadeOutTween.onComplete.add(function(){
        this.windforce.body.y = -100;
    }, this);

    this.windforce.animations.play("blow");
};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------
 */
player.prototype.update = function() {

    // Reset wallsliding
    this.object.wallSliding = false;

    if (cursors.left.isDown && !this.object.dashing && (!this.object.attacking || (this.object.attacking && !this.isOnTheGround()))) {
        this.move(-1);

        if (!this.object.attacking) {
            // If the player is falling
            if (this.isOnTheGround()) {
                this.object.wallJumping = false;
                this.object.animations.play('run');
            } else if (this.object.touchingWall && parseFloat(this.object.body.y).toFixed(2) > this.previousLocation.y) {
                if (!this.object.wallJumping) {
                    this.object.body.velocity.y = 0;
                }
                this.object.animations.play('walljump');
                this.object.wallSliding = true;
            } else {
                this.object.animations.play('fall');
            }
        }

        this.spriteOrientation(-1);
    }
    else if (cursors.right.isDown && !this.object.dashing && (!this.object.attacking || (this.object.attacking && !this.isOnTheGround()))) {

        this.move(1);

        if (!this.object.attacking) {
            // If the player is falling
            if (this.isOnTheGround()) {
                this.object.wallJumping = false;
                this.object.animations.play('run');
            } else if (this.object.touchingWall && parseFloat(this.object.body.y).toFixed(2) > this.previousLocation.y) {
                if (!this.object.wallJumping) {
                    this.object.body.velocity.y = 0;
                }
                this.object.animations.play('walljump');
                this.object.wallSliding = true;
            } else {
                this.object.animations.play('fall');
            }
        }

        this.spriteOrientation(1);
    }
    else {
        if (!this.object.attacking && !this.object.dashing) {
            // If the player is falling
            if (!this.isOnTheGround()) {
                this.object.animations.play('fall');
            } else {
                this.object.animations.play('idle');
                this.object.wallJumping = false;
            }
        }
        if (!this.object.wallJumping && !this.object.dashing) {

            this.object.body.velocity.x -= (this.object.body.velocity.x < 0) ? 10 : -10;
            if (this.object.body.velocity.x < 10 || this.object.body.velocity.x > -10) {
                this.object.body.velocity.x = 0;
            }
        }
    }

    // Make sure the wind gust never falls
    this.windforce.body.velocity.y = 0;

    // Set the first velocity
    this.previousLocation = {
        x: parseFloat(this.object.body.x).toFixed(2),
        y: parseFloat(this.object.body.y).toFixed(2)
    };
};

/*
 |--------------------------------------------------------------------------
 | On death
 |--------------------------------------------------------------------------
 */
player.prototype.die = function() {

    console.log("You died");
};

// Export the prototype object
module.exports = player;