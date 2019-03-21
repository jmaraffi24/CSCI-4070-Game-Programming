ig.module(
    'game.entities.water'
)

.requires(
    'impact.entity'
)

.defines(function(){
    
    EntityWater = ig.Entity.extend(
    {
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.5)',
        _wmScalable: true,
        
        checkAgainst: ig.Entity.TYPE.BOTH,
        size: {x: 16, y: 16},
        update: function(){},
        
        check: function (other)
        {
            other.bounciness = 0;
            other.inWater = true;
            other.friction.y = 0;
            other.gravityFactor = 0.1;
            other.maxVel.y = 50;
        }
    });
});