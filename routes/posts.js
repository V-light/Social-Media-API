const router = require("express").Router();
const { raw } = require("express");
const Post = require("./../models/Post");

//create post
router.post("/", async (req, res) => {
  const post = await new Post(req.body);
  try {
    const savedPost = await post.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(200).json(err);
  }
});

//update Post
router.put('/:id', async (req, res)=>{
    try{
        const post = await  Post.findById(req.params.id);
        
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json({message: "update succesfully"});
        }else{
            res.status(403).json({message: "you can update only your post"});
        }
    }catch(err){
        res.status(500).json(err);
    }
   
})

//Delete Post

router.delete('/:id', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json({message: "post deleted successfully"});
        }else{
            res.status(200).json({message: 'you can delete only your post'});
        }
    }catch(err){
        res.status(500).json(err);
    }
})

// like/dislike post

router.put('/:id/like', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json({message: "post has been liked"});

        }else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json({message: "post has been disliked"});
        }

    }catch(err){
        res.status(500).json(err);
    }
})

//get a post
router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
