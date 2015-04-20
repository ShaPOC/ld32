/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The tiled object brings some utilities to the game which
 *  allows it to read some specific information from the
 *  export of the tiled map generator.
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

var tiled = function() {};

/*
 |--------------------------------------------------------------------------
 | Find Objects By Type
 |--------------------------------------------------------------------------\
 |
 | Find objects in a Tiled layer that containt a property called "type" equal
 | to a certain value
 */

tiled.prototype.findObjectsByType = function(type, map, layer, array) {

    var result = [];
    // We want the ability to search in more than just the objects array
    array = array || "objects";

    map.objects.forEach(function(objectlayer){

        if(objectlayer.name === layer) {
            objectlayer[array].forEach(function(element){
                if(element.type === type) {
                    //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                    //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                    //so they might not be placed in the exact pixel position as in Tiled
                    element.y -= map.tileHeight;
                    result.push(element);
                }
            });
        }
    });

    return result;
};
// Export the prototype object
module.exports = tiled;