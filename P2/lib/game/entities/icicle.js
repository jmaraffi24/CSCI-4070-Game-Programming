ig.module(
    'game.entities.icicle'
)

    .requires(
    'impact.entity'
)

    .defines(function(){

    EntityIcicle = ig.Entity.extend(
        {
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(0, 0, 235, 0.5)',
            _wmScalable: true,

            checkAgainst: ig.Entity.TYPE.BOTH,

            update: function(){},

            check: function (other)
            {
                other.receiveDamage(1, this);
            }
        });
});