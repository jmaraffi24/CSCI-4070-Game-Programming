ig.module(
    'game.entities.basket'
)

    .requires(
    'impact.entity'
)

    .defines(function(){

    EntityBasket = ig.Entity.extend(
        {
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 255, 0, 0.5)',
            _wmScalable: true,

            size: {x: 10, y: 10},
            offset: {x: 0, y: 0},
            animSheet: new ig.AnimationSheet( 'media/basket.png' , 20 , 20 ),
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.addAnim('idle', 0.2, [0,1]);  
                this.currentAnim = this.anims.idle;
            },

            update: function(){},

            check: function (other)
            {
                //destroy the basket after delivered the flowers
                this.kill();
            }
        });
});