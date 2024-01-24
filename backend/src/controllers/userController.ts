// src/controllers/userController.ts

import { Request, Response } from 'express';
import User from '../models/User';
import Friendship from '../models/Friendship';
import githubApi from '../services/githubApi';

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;

    // Check if the user is already in the database
    const existingUser = await User.findOne({
      where: { username },
      include: [{ model: User, as: 'Friends' }],
    });

    if (existingUser) {
      res.json(existingUser);
    } else {
      // Fetch user data from GitHub API
      const response = await githubApi.get(`/users/${username}`);
      const userData = response.data;

      // Save user details to the database
      const newUser = await User.create({
        username: userData.login,
        avatar_url: userData.avatar_url,
      });

      // Find mutually followed users and save them as friends
      const followersResponse = await githubApi.get(`/users/${username}/followers`);
      const followers = followersResponse.data.map((follower: any) => follower.login);
console.log("FollowersResponse======>",followersResponse);
console.log("Followers======>",followers);

      const followingResponse = await githubApi.get(`/users/${username}/following`);
      const following = followingResponse.data.map((followed: any) => followed.login);
      console.log("FollowingResponse======>",followingResponse);
      console.log("Following======>",following);

      const mutualFriends = followers.filter((follower: string) => following.includes(follower));

      for (const friendUsername of mutualFriends) {
        const friend = await User.findOne({ where: { username: friendUsername } });
        if (friend) {
          // Manually create entries in the Friendships table
          await Friendship.create({
            userId: newUser.id,
            friendId: friend.id,
          });

          // Also, you can optionally create a reverse entry if you want bi-directional friendships
          await Friendship.create({
            userId: friend.id,
            friendId: newUser.id,
          });
        }
      }

      res.json(newUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
