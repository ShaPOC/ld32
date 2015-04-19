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
    previousLocation = null,
    map,
    tiled = new (require("../base/tiled.js"))();


module.exports = {

    preload: function(){

        // By using the built-in cache key creator, the phaser-tiled plugin can
        // automagically find all the necessary items in the cache
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

        // Load up the texturepacker spritesheet and atlas
        game.load.atlasJSONHash('player', 'resources/player/player.png', 'resources/player/player.json');

        // load the tiled map, notice it is "tiledmap" and not "tilemap"
        game.load.tiledmap(cacheKey('airu_ruins', 'tiledmap'), 'resources/maps/airu_ruins.json', null, Phaser.Tilemap.TILED_JSON);

        // load the images for your tilesets, make sure the last param to "cacheKey" is
        // the name of the tileset in your map so the plugin can find it later
        game.load.image(cacheKey('airu_ruins', 'tileset', 'Tiles'), 'resources/maps/airu_ruins.png');
    },

    create: function(){

        // Start the default Phaser Physics engine (we don't need box2d in this case)
        game.physics.startSystem(Phaser.Physics.P2JS);
        // And a default background color
        game.stage.backgroundColor = '#2d2d2d';

        // add the tiledmap to the game
        // this method takes the key for the tiledmap which has been used in the cacheKey calls
        // earlier, and an optional group to add the tilemap to (defaults to game.world).
        map = game.add.tiledmap('airu_ruins');
        // Set the collidable layer
        game.physics.p2.convertTiledCollisionObjects(map, 'Collision');

        // Set the gravity
        game.physics.p2.restitution = 0;
        game.physics.p2.gravity.y = 800;

        // Get the map location for the player
        var playerSpawnObject = tiled.findObjectsByType('PlayerStart', map, 'Objects');

        player = game.add.sprite(playerSpawnObject[0].x, playerSpawnObject[0].y, 'player');

        player.anchor.setTo(1,1);
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
        ], 8, true);

        player.animations.add('walljump', [
            'walljump01.png'
        ], 8, true);

        player.animations.add('fall', [
            'fall01.png',
            'fall02.png',
            'fall03.png'
        ], 8, false);

        game.physics.p2.enable(player);

        player.body.fixedRotation = true;

        var walljumpbodies = map.getObjectlayer('Collision').bodies;

        for (var i = 0; i < walljumpbodies.length; ++i) {
            if(walljumpbodies[i].tiledObject.type === "walljump") {
                walljumpbodies[i].onBeginContact.add(this.wallContactBegin);
                walljumpbodies[i].onEndContact.add(this.wallContactEnd);
            }
        }

        // play animation
        player.animations.play('idle');

        game.physics.enable(player);

        game.camera.follow(player);

        // Set the first velocity
        previousLocation = {
            x: parseFloat(player.body.x).toFixed(2),
            y: parseFloat(player.body.y).toFixed(2)
        };

        cursors = game.input.keyboard.createCursorKeys();

        var jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onDown.add(this.jumpButtonPressed, this);
    },

    wallContactBegin: function(wall){ touchingWall = wall.data.id; },

    wallContactEnd: function(){ touchingWall = false; },

    spriteOrientation: function(orientation){
        player.scale.x = orientation; //facing orientation direction
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

        if (cursors.left.isDown)
        {
            this.playerMove(-1);

            // If the player is falling
            if (this.checkIfCanJump()) {
                wallJumping = false;
                player.animations.play('run');
            } else if(touchingWall && parseFloat(player.body.y).toFixed(2) > previousLocation.y) {
                if(!wallJumping){
                    player.body.velocity.y = 0;
                }
                player.animations.play('walljump');
                wallSliding = true;
            } else {
                player.animations.play('fall');
            }

            this.spriteOrientation(-1);
        }
        else if (cursors.right.isDown) {

            this.playerMove(1);

            // If the player is falling
            if (this.checkIfCanJump()) {
                wallJumping = false;
                player.animations.play('run');
            } else if(touchingWall && parseFloat(player.body.y).toFixed(2) > previousLocation.y) {
                if(!wallJumping) {
                    player.body.velocity.y = 0;
                }
                player.animations.play('walljump');
                wallSliding = true;
            } else {
                player.animations.play('fall');
            }

            this.spriteOrientation(1);
        }
        else
        {
            // If the player is falling
            if (!this.checkIfCanJump()) {
                player.animations.play('fall');
            } else {
                player.animations.play('idle');
                wallJumping = false;
            }
            if(!wallJumping) {
                player.body.velocity.x = 0;
            }
        }

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

        wallJumping = true;
        player.body.moveUp(300);
        player.body.velocity.x = 300 * orientation;
        this.spriteOrientation(orientation * -1);
    },

    playerJump: function() {

        wallJumping = false;

        player.animations.play('jump');
        player.animations.stop();
        player.frame = 1;

        player.body.moveUp(300);
        jumpTimer = game.time.now + 750;
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