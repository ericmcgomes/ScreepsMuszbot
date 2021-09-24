module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {

        


        if (creep.room.name != creep.memory.targetRoom) {
            creep.say('hi')
            let exitDir = Game.map.findExit(creep.room.name, creep.memory.targetRoom);
            let Exit = creep.pos.findClosestByPath(exitDir);
            creep.memory.action = undefined;
            creep.memory.target = undefined;
            creep.moveTo(Exit);
        } else {
            if (creep.memory.action && creep.memory.target) {
                creep.execAction(creep.memory.action, creep.memory.target.id);
            }
            else if (creep.store.getFreeCapacity()
                &&
                creep.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => (s.structureType == STRUCTURE_CONTAINER)
                        && s.store.energy.valueOf() > 0
                })[0]) {
                creep.getEnergy();
            }
            else if (creep.store.energy.valueOf()) {

                if (!creep.depositEnergy()) {
                    if (!creep.buildConstruction()) {
                        if (!creep.repairStructure()) {
                            if (!creep.repairWall()) {
                                creep.upgrade();
                            }
                        }
                    }

                }
            }
            // if creep is supposed to harvest energy from source
            else {
                creep.getEnergy();
            }
        }
    }
};