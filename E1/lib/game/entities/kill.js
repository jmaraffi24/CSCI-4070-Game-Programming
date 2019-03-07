ig.module(
    'game.entities.kill'
)

.requires(
    'impact.entity'
)

.defines(function(){
    
    EntityKill = ig.Entity.extend(
    {
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255,0,0,0.5)',
        _wmScalable: true,
        
        checkAgainst: ig.Entity.TYPE.BOTH,
        
        //overriding the update function to do nothing on update
        update: function(){},
        
        //overriding the check function to kill the object that collides with it
        check: function(other)
        {
            other.kill();
        }
        
    });
});