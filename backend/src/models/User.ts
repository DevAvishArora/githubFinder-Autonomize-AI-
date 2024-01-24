// src/models/User.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';
import Friendship from './Friendship';

class User extends Model {
  public id!: number;
  public username!: string;
  public avatar_url!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

// Self-referencing association for friendships
User.belongsToMany(User, {
  as: 'Friends',
  through: Friendship,
  foreignKey: 'userId',
  otherKey: 'friendId',
});

export default User;
