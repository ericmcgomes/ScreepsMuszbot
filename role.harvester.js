// var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getFreeCapacity() == 0 && !creep.memory.working){
            creep.memory.working = true;
        }

        if(creep.store.energy.valueOf() == 0 && creep.memory.working){
            creep.memory.working = false;
        }

        if(!creep.memory.working) {

            if (creep.memory.role == 'harvester') {

                // Try to find nearest contaner with energy
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_CONTAINER) &&
                                 s.store[RESOURCE_ENERGY] > 0
                });

                // If there is no available container, get energy from source
                if (!target) {
                    target = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: (source) => {
                            return (source.energy > 0);
                        }
                    });
                }
            }
            else {

                // If creep is not a harvester, try to get energy from a container or storage
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                 s.store[RESOURCE_ENERGY] > 0
                });

                // If there is no available container, get energy from source
                if (!target) {
                    target = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: (source) => {
                            return (source.energy > 0);
                        }
                    });
                }
            }
            

            // If there is a valid energy source, move to and harvest it
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.memory.target = target;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.target = target;
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            // Get a structure to store the energy
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });


            if(target) {
                // If there is a valid target, move to and upgrade it
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.memory.target = target;
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                // Try to upgrade controller if there is no valid target in the room
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.memory.target = creep.room.controller;
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;