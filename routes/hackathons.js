const express=require("express");
const User = require("../schemas/User");
const Hackathon=require("../schemas/Hackathon");
const jwt=require("jsonwebtoken");
const router = express.Router();
const secretKey ="nFmJ29qxqgMssJ7gxhriwE+1r8Awp8egXnpRkC3CjIM=";
const UserRank=require("../schemas/Userrankschema")
const ObjectId = require('mongoose').Types.ObjectId;
router.get("/allHackathons",verifyToken,async(req,res)=>{
      const result=await Hackathon.find({})
      res.json(result);
     
    
})

router.get("/findHackathon/:id",verifyToken,async(req,res)=>{
   const id=req.params.id;
const Id = new ObjectId(id);

  
    const result=await Hackathon.findById(Id);
    res.json(result);
})
router.get('/getLeaderboard/:id', async (req, res) => {
  try {
    const hackathonId = req.params.id;

    // Find all user ranks for the specified hackathon, sorted by rank
    const leaderboard = await UserRank
      .find({ hackathon: hackathonId })
      .populate('user', 'name') // Populate user details
      .sort({ rank: 1 }) // Sort by rank in ascending order
      .exec();

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get("/register/:id",verifyToken,async(req,res)=>{
    const id=req.params.id;
   
const Id = new ObjectId(id);
const {email}=req.user;
const updatedHackathon = await Hackathon.findByIdAndUpdate(
 Id,
    { $push: { registeredPeople: email } },
    { new: true, upsert: true }
);


res.json({ message: "Thank you for registering.", updatedHackathon });
})
router.post("/createHackathon",verifyToken, async(req, res) => {
     const { name, conductedBy, prizeMoney, teamSize, lastDate, details, contact, type } = req.body;
     const {email}=req.user;
     const cu = await User.findOne({ email });
    const newHackathon = new Hackathon({
        name: name,
        conductedBy: conductedBy,
        prizeMoney: prizeMoney,
        teamSize: teamSize,
        lastDate: lastDate,
        details: details,
        contact: contact,
        conductedByRef: cu._id,
        registeredPeople: [],
        type: "hackathon"
    });
    
    // You need to save the newHackathon to the database
    newHackathon.save()
        .then(savedHackathon => {
            res.status(201).json(savedHackathon);
        })
        .catch(error => {
           res.status(400).json({ message: error.message });
        });
});
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) =>{
     
     
      if (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      req.user = decoded; 
    
      next();
    });
  }

module.exports = router;