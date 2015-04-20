/**
 *  [[GAME_TITLE]]
 *  [[GAME_DESCRIPTION]]
 *
 *  The smoothened camera is operated from here. Also shake
 *  effects are triggered with this object.
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

var enemies = function( player ) {

    // All enemies (for updating purposes)
    this.currentEnemies = [];
    // Set the player in the object
    this.player = player;
    // Load up the texturepacker spritesheet and atlas
    game.load.atlasJSONHash('enemies', 'resources/enemies/enemies.png', 'resources/enemies/enemies.json');
};

/* jshint ignore:start */
// Hack to compile Glob files. Don´t call this function!
function ಠ_ಠ() {
    // We make browserify believe we require this, and we do! Eventually...
    // So put all available enemies here!
    require("../gameobjects/stonehead.js", { glob: true });
}
/* jshint ignore:end */

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------\
 */
enemies.prototype.spawn = function( name , location, properties ) {

    // Create the enemy object
    var enemy = new (require("../gameobjects/"+name+".js"))(this.player);
    // Spawn now
    enemy.spawn(location, properties.orientation);
    // Push the enemy
    this.currentEnemies.push(enemy);
};

/*
 |--------------------------------------------------------------------------
 | The update function, triggered every tick
 |--------------------------------------------------------------------------\
 */
enemies.prototype.update = function() {

    for(var i = 0; i < this.currentEnemies.length; ++i) {
        if(typeof this.currentEnemies[i].update === "function"){
            this.currentEnemies[i].update();
        }
    }
};

// Export the prototype object
module.exports = enemies;