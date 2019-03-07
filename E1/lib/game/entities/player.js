ig.module( 'game.entities.player' )
    .requires( 'impact.entity' )
    .defines ( function()
              {
    // the magic is in the player -----------------------------------
    EntityPlayer = ig.Entity.extend(
        {
            animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16 ),

            // https://impactjs.com/documentation/class-reference/entity#size-x-size-y
            size: {x: 8, y:14},  	// collision box -- smaller than player
            offset: {x:4, y:2},
            flip: false,

            // physics -- impact does this for us - with just simply setting
            // these parameters.
            //https://impactjs.com/documentation/class-reference/entity
            maxVel: {x:100, y:150},  // velocity is capped at these velocities.
            friction: {x:0, y:0},

            // Setting up my own paramaters so I accelleration is different between air/ground.
            accelGround: 400,
            accelAir: 200,
            jump: 200,

            // Impact handles the collision for us - using collision boxes.
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE, 		// zombie handles collision
            collides: ig.Entity.COLLIDES.PASSIVE, 	// prevent anohter passive
            // entity to move
            health: 20,

            weapon: 0,      
            totalWeapons: 2, // 2 different weapons right now.add another is straightforward.
            activeWeapon: "EntityBullet",

            //adding invincibility so that the player does not die to his own grenades
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,
            
            //makes the player bounce off all the walls
            bounciness: 1.0,


            init: function( x, y, settings )
            {
                this.parent( x,y, settings );

                //intializing the invicibleTimer and making the player invincible
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();

                // -- what we had earlier without a weapon now use animation 
                // with a weapon.
                //this.addAnim( 'idle', 1, [0] );
                //this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
                //this.addAnim( 'jump', 1, [9] );
                //this.addAnim( 'fall', 0.4, [6,7] );	

                // animation sequence depends if ishas a weapon or not.
                // 10 sprites has a weapons abnd 10 does not carry a weapon.
                this.setupAnimation( this.weapon ); // weapon = 0 ?


            }, // end init function

            setupAnimation: function( offset ) // if zero it has a weapon!
            {
                // https://impactjs.com/documentation/class-reference/entity#addanim [stop: repeat or not]
                //.addAnim( name, frameTime, sequence, [stop] )¶

                offset = offset * 10;
                this.addAnim('idle', 1, [0+offset]);
                this.addAnim('run', .07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
                this.addAnim('jump', 1, [9+offset]);
                this.addAnim('fall', 0.4, [6+offset,7+offset]);
            }, // different animations whether we carry  visible weapon or not

            //invincibility functionn to toggle the invincibility of the player
            makeInvincible: function()
            {
                this.invincible = true;
                this.invincibleTimer.reset();
            },

            //overriding the recieveDamage method, test if invincibility is active
            receiveDamage: function(amount, from)
            {
                if(this.invincible)
                {
                    return;
                }
                this.parent(amount, from);
                if (this.health > 0)
                    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {particles: 2});
            },

            //overloading the draw function, if invincibility is active, set the alpha value of the sprite to reflect how much longer they are invincible
            draw: function()
            {
                if(this.invincible)
                {
                    this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
                }
                this.parent();
            },

            //overloading the kill function, creates the death explosion upon kill() being called on EntityPlayer
            kill: function()
            {
                this.parent();

                //starting position of the animation at the location of the EntityPlayer
                var x = 75;//this.startPosition.x;
                var y = 100;//this.startPosition.y;

                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack: function(){ig.game.spawnEntity(EntityPlayer, x, y)}});

            },

            update: function()
            {

                // -- determines the  players movment and it depends on state of player and 
                //		keyboard, mouse, or other user input.
                // if you want the 'player' to  defy gravity this is the place of manipulation.


                // set accelaration.
                var accel = this.standing ? this.accelGround : this.accelAir;


                // manipulation depending on user input (and location in game if you want
                // EXAMPLE: add current 'state' of gravity,
                // if gravity is currently 'normal' do that same as below
                // but if it going up (feet in air)

                // result of state ->
                //	flip
                //  accel.x, accel.y


                // --- right or left of mouse --- 
                if( ig.input.state('left') ) //  
                {
                    this.accel.x = -accel;
                    this.flip = true;
                }
                else if( ig.input.state('right'))
                {
                    this.accel.x = accel;
                    this.flip = false;
                }
                else if( ig.input.state('down'))
                {
                    this.accel.y = accel;
                }
                else if( ig.input.state('up'))
                {
                    this.accel.y = -accel;
                }
                else
                {
                    this.accel.x = 0;
                }


                // jump
                if( this.standing && ig.input.pressed('jump') )
                {
                    this.vel.y = -this.jump;
                }

                // shoot
                if( ig.input.pressed('shoot') ) 
                {
                    //ig.game.spawnEntity( EntityBullet,    this.pos.x, this.pos.y, {flip:this.flip} );				
                    ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip} );


                }

                // toggle weapon

                if( ig.input.pressed('switch') ) 
                {
                    //toggle to the next weapon
                    this.weapon ++;
                    //if no more weapons, cycle back
                    if(this.weapon >= this.totalWeapons)
                        this.weapon = 0;
                    //switch statement that controls the activeWeapon
                    switch(this.weapon)
                    {
                        case(0):
                            this.activeWeapon = "EntityBullet";
                            break;
                        case(1):
                            this.activeWeapon = "EntityGrenade";
                            break;
                    }
                    this.setupAnimation(this.weapon);
                }

                // handle gravity our selves. with some assistance form impactJS.

                // https://impactjs.com/forums/help/multiple-gravity-directions/page/1

                // this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;

                // 			Example: gravity direction is to UP or down: modify this.vel.y
                // 					velocity is decreases if updward gravity.
                // 					velocity is increases if downwards.
                // 				Example: gravity direction is to left or right: modify this.vel.y

                //  'normally gravity' adds to the y direction in impactJS.
                //	so normally:  this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
                //
                // you want to modify this behaviour in your game when gravity is wonky!

                // also the animation sprite my be rotated.
                // use angle to rotate the sprite


                // before below is added animation doesn't change -
                // set the current animation, based on the player's speed
                if( this.vel.y < 0 ) 
                {
                    this.currentAnim = this.anims.jump;
                }
                else if( this.vel.y > 0 ) 
                {
                    this.currentAnim = this.anims.fall;
                }
                else if( this.vel.x != 0 ) 
                {
                    // impact will change sprite automatically
                    this.currentAnim = this.anims.run;
                }
                else
                {
                    this.currentAnim = this.anims.idle;
                }

                // check to see if the flip needs to change (true/false)
                this.currentAnim.flip.x = this.flip;

                //invincibility tests to see if timer > delay, if so, set invicible to falce and alpha = 1
                if (this.invincibleTimer.delta()  >  this.invincibleDelay)
                {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }

                // finally activate the move
                this.parent();
            }, // end update function

            /*handleMovementTrace: function (res)
            {
                this.parent( res );
                if(res.collision.x || res.collision.y)
                {
                    this.accel.y = -(this.accel.y);
                    this.accel.x = -(this.accel.x);
                }

            }*/
        }); // EntityPlayer - extend the class afterwards


    // -- inner class definiton of weapons see page 48 book.
    EntityBullet = ig.Entity.extend(
        {
            size: {x: 5, y: 3},
            animSheet: new ig.AnimationSheet( 'media/bullet.png', 5, 3 ),
            maxVel: {x: 200, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function( x, y, settings ) 
            {
                this.parent( x + (settings.flip ? -4 : 8) , y+8, settings );
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim( 'idle', 0.2, [0] );
            },
            handleMovementTrace: function( res ) 
            {
                this.parent( res );
                if( res.collision.x || res.collision.y )
                {
                    this.kill();
                }
            },
            check: function( other ) 
            {
                other.receiveDamage( 3, this );
                this.kill();
            }
        });


    EntityGrenade = ig.Entity.extend(
        {
            size: {x: 4, y: 4},
            offset: {x: 2, y: 2},
            animSheet: new ig.AnimationSheet( 'media/grenade.png', 8, 8 ),

            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.PASSIVE,

            maxVel: {x: 200, y: 200},

            bounciness: 0.6,
            bounceCounter: 0,

            init: function( x, y, settings ) 
            {
                this.parent( x + (settings.flip ? -4 : 7), y, settings );
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);

                this.vel.y = -(50 + (Math.random()*100));  // adds an arc, with some randomness
                this.addAnim( 'idle', 0.2, [0,1] );
            },


            handleMovementTrace: function( res ) 
            {
                this.parent( res );
                if( res.collision.x || res.collision.y ) 
                {
                    // only bounce 3 times, doesn't explode
                    // or become deadly until bounced 3 times.
                    this.bounceCounter++;
                    if( this.bounceCounter > 3 ) {
                        this.kill();
                    }
                }
            },

            check: function( other ) 
            {
                other.receiveDamage( 10, this );
                this.kill();
            },

            //overriding the kill method to spawn the explosion particles
            kill: function()
            {
                for(var i = 0; i < 20; i++)
                    ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
                this.parent();
            }

        });

    //adding an explosion animation that occurs when a grenade explodes
    EntityGrenadeParticle = ig.Entity.extend(
        {
            size: { x: 1, y: 1 },
            maxVel: { x: 160, y:200 },
            lifetime: 1,
            fadetime: 1,
            bounciness: 0.3,
            vel: { x: 40, y: 50 },
            friction: { x: 20, y: 20 },
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.LITE,

            animSheet: new ig.AnimationSheet('media/explosion.png', 1, 1),

            init: function( x, y, settings)
            {
                this.parent(x, y, settings);
                this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 10 - 1) * this.vel.y;

                this.idleTimer = new ig.Timer();

                var frameID = Math.round(Math.random() * 7);

                this.addAnim('idle', 0.2, [frameID]);
            },

            update: function()
            {
                if (this.idleTimer.delta() > this.lifetime)
                {
                    this.kill();
                    return;
                }

                this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

                this.parent();
            }
        });

    //adding a death animation (particle explosion upon player health = 0)
    EntityDeathExplosion = ig.Entity.extend(
        {
            lifetime: 1,
            callBack: null,
            particles: 25,

            init: function( x, y, settings )
            {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                {
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, 
                                        {colorOffset: settings.colorOffset ? settings.colorOffset:0});
                }
                this.idleTimer = new ig.Timer();
            },

            update: function()
            {
                if( this.idleTimer.delta()  >  this.lifetime )
                {
                    this.kill();
                    if (this.callBack)
                    {
                        this.callBack();
                    }
                    return;
                }
            }
        });

    //adding particle inner class for creating the particle explosion upon player death
    EntityDeathExplosionParticle = ig.Entity.extend(
        {
            size: { x:2 , y:2 },
            maxVel: { x: 160, y: 200 },
            lifetime: 2,
            fadetime: 1,
            bounciness: 0,
            vel: { x: 100, y: 30 },
            friction: { x: 100, y: 0 },
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 0,
            totalColors: 7,

            animSheet: new ig.AnimationSheet ('media/blood.png', 2, 2),

            init: function( x , y, settings )
            {
                this.parent( x , y , settings);
                var frameID = Math.round(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));

                this.addAnim('idle', 0.2, [frameID]);

                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;

                this.idleTimer = new ig.Timer();
            },

            update: function()
            {
                if ( this.idleTimer.delta() > this.lifetimer)
                {
                    this.kill();
                    return;
                }

                this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);

                this.parent();
            }
        });
}); // define