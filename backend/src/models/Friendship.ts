// src/models/Friendship.ts

import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/database';
import User from './User';

class Friendship extends Model {
  public userId!: number;
  public friendId!: number;
}

Friendship.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    friendId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'friendships',
  }
);

export default Friendship;
