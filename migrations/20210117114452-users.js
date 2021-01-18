'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      email: { type: Sequelize.STRING },
      profileImage: { type: Sequelize.STRING },
      token: { type: Sequelize.STRING}
    });

    await queryInterface.createTable('trips', {
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
      launchId: { type: Sequelize.INTEGER },
      userId: { type: Sequelize.INTEGER }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
