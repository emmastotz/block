'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Instructors', 'rating', {
          type: Sequelize.DataTypes.DECIMAL(10,2)
        }, { transaction: t }),
        queryInterface.addColumn('Instructors', 'difficulty', {
          type: Sequelize.DataTypes.DECIMAL(10,2),
        }, { transaction: t }),
        queryInterface.addColumn('Instructors', 'take_again_percent', {
          type: Sequelize.DataTypes.DECIMAL(10,2),
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Instructors', 'rating', { transaction: t }),
        queryInterface.removeColumn('Instructors', 'difficulty', { transaction: t }),
        queryInterface.removeColumn('Instructors', 'take_again_percent', { transaction: t })
      ]);
    });
  }
};
