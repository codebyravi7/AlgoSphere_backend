import { User } from "../models/user.model.js";

export const areFriend = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const isFriend = user?.friends?.find((friendID) => friendID.equals(id));
    return res.json(isFriend);
  } catch (err) {
    return res.json({ message: "Error in adding Friend", success: false });
  }
};
export const addFriend = async (req, res) => {
  const user = req.user;
  const { id } = req.body;
  try {
    const friend = await User.findById(id);
    if (!friend) {
      return res.json({ message: "USER NOT FOUND!!", success: false });
    }
    //   checking if user already a friend
    const isFriend = user.friends.find((friendID) => friendID.equals(id));
    if (!isFriend) {
      user?.friends?.push(id);
      friend?.friends?.push(user?._id);
      await user.save();
      await friend.save();
      return res.json({ message: "Now we are friends", user, success: true });
    } else {
      user?.friends?.pull(id);
      friend?.friends?.pull(user?._id);
      await user.save();
      await friend.save();
      return res.json({
        message: "We are no longer friends",
        user,
        success: true,
      });
    }
  } catch (err) {
    return res.json({ message: "Error in adding Friend", success: false });
  }
};
export const allfriends = async (req, res) => {
  try {
    let user = req.user;
    user = await user.populate("friends");
    // const friend = await User.findById(user?._id);

    return res.json({ message: "All friends: ", user, success: true });
  } catch (err) {
    return res.json({ message: "Error in finding all Friend", success: false });
  }
};

export const userProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await User.findById(id).populate("posts");
    const filteredPosts = user?.posts?.filter(
      (post) => post?.public === true || post?.public == null
    );
    // console.log(user);

    res.json({
      message: "user-Profile",
      fullName: user?.fullName,
      profilePic: user?.profilePic,
      codingProfiles:user?.codingProfiles,
      filteredPosts,
      success: true,
    });
  } catch (err) {
    res.json({ message: "Error in finding user Profile", success: false });
  }
};

export const addProfiles = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const { leetcode, codechef, codeforces } = req.body;
    console.log(leetcode, codechef, codeforces);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          "codingProfiles.leetcode": leetcode,
          "codingProfiles.codechef": codechef,
          "codingProfiles.codeforces": codeforces,
        },
      },
      { new: true } // Returns the updated user
    );

    res.json({
      message: "user-Profile-added",
      updatedUser: updatedUser,
      success: true,
    });
  } catch (err) {
    res.json({ message: "Error in finding user Profile", success: false });
  }
};
