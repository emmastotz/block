'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('savedSchedules', 'schedule_name', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('savedSchedules', 'schedule_description', {
          type: Sequelize.DataTypes.TEXT
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('savedSchedules', 'schedule_name', { transaction: t }),
        queryInterface.removeColumn('savedSchedules','schedule_description', {transaction: t})
      ]);
    });
  }
};
