'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: true,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      otpPassword: {
        type: Sequelize.DataTypes.STRING(6),
        allowNull: true
      },
      otpExpiry: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      otpVerifiedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
