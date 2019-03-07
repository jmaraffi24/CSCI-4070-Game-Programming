ig.module( 
    'game.main' 
)
.requires(
    'impact.game',
    'game.levels.level1',
    'impact.debug.debug'
)


//----------the game definition begin -------------------
.defines( function()
{

    MyGame = ig.Game.extend(
        {


            gravity: 0,

            init: function() 
            {

                this.loadLevel( LevelLevel1 ); // Concatentation: "Level" + "Object"

                // Initialize your game here; bind keys etc.
                ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
                ig.input.bind( ig.KEY.UP_ARROW, 'up');
                ig.input.bind( ig.KEY.X, 'jump');
                ig.input.bind( ig.KEY.C, 'shoot');
                ig.input.bind ( ig.KEY.TAB, 'switch');

            },

            update: function() 
            {
                // Update all entities and backgroundMaps
                // Add your own, additional update code here
                // centering the camera around the player
                var player = this.getEntitiesByType(EntityPlayer)[0];

                //if the player exists
                if(player)
                {
                    //set the x and y pos of the screen to be the location of the player
                    this.screen.x = player.pos.x - ig.system.width/2;
                    this.screen.y = player.pos.y - ig.system.height/2;
                }

                // left right

                this.parent();

               
            },

            draw: function() 
            {
                // Draw all entities and backgroundMaps
                this.parent();		
            }
        });
    //----------the game definition -------------------



    // Start the Game with 60fps, a resolution of 320x240, scaled
    // up by a factor of 2
    // ( 'canvas-i', gameobject, fps, x, y, factor )
    ig.main( '#canvas', MyGame, 60, 400, 300, 2 );

});
