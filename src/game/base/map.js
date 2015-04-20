/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  This is the BaseClass for every map spawned by a state.
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

// The map object uses the tiled object to get some information from the
// tiled map json
var tiled = new (require("../base/tiled.js"))();

/*
 |--------------------------------------------------------------------------
 | "Constructor" for object
 |--------------------------------------------------------------------------
 */

var map = function(mapname) {

    // By using the built-in cache key creator, the phaser-tiled plugin can
    // automagically find all the necessary items in the cache
    var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

    // load the tiled map, notice it is "tiledmap" and not "tilemap"
    game.load.tiledmap(cacheKey(mapname, 'tiledmap'), 'resources/maps/' + mapname + '.json', null, Phaser.Tilemap.TILED_JSON);

    // load the images for your tilesets, make sure the last param to "cacheKey" is
    // the name of the tileset in your map so the plugin can find it later
    game.load.image(cacheKey(mapname, 'tileset', 'Tiles'), 'resources/maps/' + mapname + '.png');
};

/*
 |--------------------------------------------------------------------------
 | The create function, triggered when the state is started
 |--------------------------------------------------------------------------
 */
map.prototype.create = function() {

    // add the tiledmap to the game
    // this method takes the key for the tiledmap which has been used in the cacheKey calls
    // earlier, and an optional group to add the tilemap to (defaults to game.world).
    this.tilemap = game.add.tiledmap('airu_ruins');

    // Set the collidable layer
    game.physics.p2.convertTiledCollisionObjects(this.tilemap, 'Collision');
    // Set the overlap layer
    game.physics.p2.convertTiledCollisionObjects(this.tilemap, 'Overlap');
};

/*
 |--------------------------------------------------------------------------
 | Get Death locations in the map
 |--------------------------------------------------------------------------
 */
map.prototype.onDeathLocationOverlap = function(trigger_function) {

    var x = this.tilemap.getObjectlayer('Overlap').bodies;

    for (var i = 0; i < x.length; ++i) {
        // Set as overlap only
        x[i].sensor = true;
        if(x[i].tiledObject.type === "FallDeath") {
            x[i].onBeginContact.add( trigger_function );
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Get Wall jump locations
 |--------------------------------------------------------------------------
 */
map.prototype.onWallJumpOverlap = function(begin, end) {

    var x = this.tilemap.getObjectlayer('Collision').bodies;

    for (var i = 0; i < x.length; ++i) {
        if(x[i].tiledObject.type === "walljump") {
            x[i].onBeginContact.add(begin);
            x[i].onEndContact.add(end);
        }
    }
};

/*
 |--------------------------------------------------------------------------
 | Get player start location
 |--------------------------------------------------------------------------
 */
map.prototype.getPlayerStart = function() {

    return tiled.findObjectsByType('PlayerStart', this.tilemap, 'Objects');
};

// Export the prototype object
module.exports = map;