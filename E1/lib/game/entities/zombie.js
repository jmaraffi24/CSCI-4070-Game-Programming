ig.module(
    'game.entities.zombie'
)
    .requires(
    'impact.entity'
)

//--- define the behavior of the wondereres - with collision though.
// when a player collides with the zombie - the player dies of fear!

    .defines(function()
             {

    // ------------- these zombies are just wanderers ----------------------
    EntityZombie = ig.Entity.extend(
        {
            animSheet: new ig.AnimationSheet( 'media/zombie.png', 16, 16 ),

            // https://impactjs.com/documentation/class-reference/entity#size-x-size-y
            size: {x: 8, y:14},  		// collision box. of player. ***want this to be smaller than the actual object usually***
            offset: {x: 4, y: 2},  		// EX. x.  animimation frame is 16px, size is 8, then offset is (16-8)/2=4
            // smaller than sprite.

            maxVel: {x: 100, y: 100},
            flip: false,
            friction: {x: 150, y: 0},  // de-acceleratin coefficient. || experiement to see what it does.

            speed: 14,

            // book - page 45.
            // https://impactjs.com/documentation/collision
            type: 			ig.Entity.TYPE.B, // setting the type of all zombies to by type "B" will check collision against type "A"
            checkAgainst: 	ig.Entity.TYPE.A, // the player type. check the collision of this object with the object of type "A"
            collides: 		ig.Entity.COLLIDES.PASSIVE, // similar object are OK to overlap. do nothing when colliding with an identical objet

            init: function( x, y, settings ) 
            {
                this.parent( x, y, settings );
                this.addAnim('walk', .07, [0,1,2,3,4,5]);
            },
            update: function() 
            {
                // page 43. in book
                // check collision map, near an EDGE (no collison tile)
                // change direction


                if( ! ig.game.collisionMap.getTile(
                    this.pos.x + (this.flip ? +4 : this.size.x -4), //  x 
                    this.pos.y + this.size.y + 1 					 // y check the tile below it.
                )
                  ) 
                {
                    this.flip = !this.flip;
                }

                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;
                this.parent();
            },

            //overloading receiveDamage function to spawn the death explosion upon taking a hit
            receiveDamage: function(value)
            {
                this.parent(value);
                if (this.health > 0)
                    //you can use the same death explosion for the zombie entity this is because JS's scope is global and any entity defined in Impact is available throughout the game engine
                    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 1});
            },
            
            //overloading kill function to spawn the death explosion upon zombie death
            kill: function()
            {
                this.parent();
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset:1});
            },
            
            // handle collision with WALLS.
            handleMovementTrace: function( res ) 
            {
                this.parent( res );

                // collision with a wall? return!
                if( res.collision.x ) 
                {
                    this.flip = !this.flip;
                }
            },

            check: function( other ) 
            {
                other.receiveDamage( 1, this ); // how much health the 'other' colliding objects receives. applied to the "other" object involved in the collision
                // damage is inflicted every frame
            }
        });
});
