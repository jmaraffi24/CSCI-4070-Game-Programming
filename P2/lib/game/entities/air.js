ig.module(
    'game.entities.air'
)

    .requires(
    'impact.entity'
)

    .defines(function(){

    EntityAir = ig.Entity.extend(
        {
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 255, 255, 0.5)',
            _wmScalable: true,

            checkAgainst: ig.Entity.TYPE.BOTH,
            size: {x: 16, y: 16},
            update: function(){},

            check: function (other)
            {
                other.inAir = true;
                other.gravityFactor = 0;
            }
        });
});