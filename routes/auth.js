const router = require('express').Router();
const User = require('./../models/User');
const bcrypt = require('bcrypt');

//Register
router.post('/register', async (req, res)=>{
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password:  hashedPassword
        });

        await newUser.save();
        res.status(200).json({
            newUser
        })

    }catch(err){
        res.status(500).json({err})
    }
    
    
});

//Login
router.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        !user&& res.status(404).json({
            status : "Error",
            message: 'User not found'
        });

        const passwordCheck = await bcrypt.compare(req.body.password, user.password);

        !passwordCheck && res.status(500).json({
            status: 'Error',
            message: "Password is Incorrect"
        });

        res.status(200).json({
            user
        })

    }catch(err){
        res.status(500).json({err});
    }
})

module.exports = router;