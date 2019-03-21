ig.module(
    'game.entities.flower'
)

    .requires(
    'impact.entity'
)

    .defines(function(){

    EntityFlower = ig.Entity.extend(
        {
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 255, 0, 0.5)',
            _wmScalable: true,

            size: {x: 20, y: 20},
            offset: {x: 0, y: 0},
            animSheet: new ig.AnimationSheet( 'media/flower.png' , 20 , 20 ),
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.PASSIVE,

            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.addAnim('idle', 0.2, [7,4]);  
                this.currentAnim = this.anims.idle;
            },
            
            update: function(){},

            check: function (other)
            {
                other.flowercount = other.flowercount + 1;
                if(other.flowercount == 7)
                    console.log("You win!");
                //destroy the flower after collected
                this.kill();
            }
        });
});