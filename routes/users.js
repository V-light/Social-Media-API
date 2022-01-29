const router = require("express").Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");

//Update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        req.body.password = await bcrypt.hash(req.body.password, 12);
      } catch (err) {
        res.status(500).json({ err });
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json({
        message: "Account has Been Updated",
      });
    } catch (err) {
      res.status(500).json({ err });
    }
  } else {
    res.status(403).json({ message: "You can updatae only your id" });
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    res.status(500).json({ message: "you can delete only your account" });
  }
});

//Get a User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(500).json({ message: "User Not Found" });
    }

    const { updatedAt, password, ...other } = user._doc;
    res.status(200).json({ other });
  } catch (err) {
    res.status(500).json({ err });
  }
});

//Follow User
router.put('/:id/follow' , async(req, res)=>{
    if(req.body.userId!== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}});
                await currUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json({message: "user followed successfully"});
            }else{
                res.status(403).json({message: "you already follow user"})
            }

        }catch(err){
            res.status(500).json({err});
        }
    }else{
        res.status(403).json({message: "you can follow yourself"});
    }
})

//Unfollow User

router.put('/:id/unfollow', async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers:req.body.userId}});
                await currUser.updateOne({$pull :{followings: req.params.id}});
                
                res.status(200).json({message: "unfollowed successfully"});
            }{
                res.status(500).json({ message: "you don't follow user"});
            }



        }catch(err){
            res.status(500).json({err});
        }
    }else{
        res.status(403).json({message: "you can not unfollow yourself"});
    }
})

module.exports = router;
