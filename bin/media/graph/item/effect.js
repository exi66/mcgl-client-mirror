function run(counter) {
	//print(world.getBlockId(obj.posX, obj.posY-1, obj.posZ));
	for(var i = 0; i < 20; i++)
		obj.particle("bleed", obj.posX, obj.posY+1, obj.posZ, 0, 0.6, 0);
	
	if(counter > 10) {
		obj.setEntityDead();
		obj.play("damage.crit", 1);
	}
}
