ig.module(
    'game.entities.trigger'
)

    .requires(
    'impact.entity'
)

    .defines(function(){
    EntityTrigger = ig.Entity.extend({
        size: {x: 16, y: 16},
        target: {},
        checkAgainst: ig.Entity.TYPE.BOTH,

        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

        check: function(other){
            
            
            other.bounciness = 0;
            /*//if the gravity is 0, give the game gravity
            if (ig.game.gravity === 0){
                ig.game.gravity = 300;

                //changing the physics applied to the player that collides with the trigger
                other.bounciness = 0;
                other.friction = 100,100;
            
            } 
            //if the gravity is not 0, make it 0
            else {
                ig.game.gravity = 0;
            }*/

        }

    });
});