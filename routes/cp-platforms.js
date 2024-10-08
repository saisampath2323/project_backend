// const express=require("express");
// const User = require("../schemas/User");
// const jwt=require("jsonwebtoken");
// const router = express.Router();
// const secretKey ="nFmJ29qxqgMssJ7gxhriwE+1r8Awp8egXnpRkC3CjIM=";
// router.get('/codechef', verifyToken,async(req, res) => {
//      const {email}=req.user;
//     const user = await User.findOne({ email });
//     const codechefId=user.codechefId;
//     const response = await fetch(`https://codechef-api.vercel.app/${codechefId}`);
//       const movies = await response.json();
//       res.json(movies);
     
// });

// router.get('/leetcode',verifyToken, async(req, res) => {
 
//     const {email}=req.user;
//     const user = await User.findOne({ email });
//     const leetcodeId=user.leetcodeId;
//     const response = await fetch(`https://leetcodestats.cyclic.app/${leetcodeId}`);
//       const movies = await response.json();
//       res.json(movies);
//       console.log(leetcodeId);
// });
// function verifyToken(req, res, next) {
 
//     const token = req.headers['authorization'];
//     console.log(token);
//     if (!token) {
//       return res.status(401).json({ message: 'unauthorized' });
//     }
  
//     jwt.verify(token, secretKey, (err, decoded) => {
     
     
//       if (err) {
//         console.log(err);
//         return res.status(401).json({ message: 'Invalid token' });
//       }
      
//       req.user = decoded; 
//       console.log(decoded);
//       next();
//     });
//   }

// module.exports = router;
const express = require("express");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
//const fetch = require("node-fetch"); // Make sure to install node-fetch if you haven't already

const secretKey = "nFmJ29qxqgMssJ7gxhriwE+1r8Awp8egXnpRkC3CjIM=";

// Middleware to verify the JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = decoded;
    next();
  });
}

// Fetch CodeChef data
router.get('/codechef', verifyToken, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  const codechefId = user.codechefId;

  try {
    const response = await fetch(`https://codechef-api.vercel.app/handle/${codechefId}`);
    const codeChefData = await response.json();
   
    if (!codeChefData.success) {
      return res.status(404).json({ message: 'CodeChef data not found' });
    }

    res.json({
      name: codeChefData.name,
      currentRating: codeChefData.currentRating,
      highestRating: codeChefData.highestRating,
      countryName: codeChefData.countryName,
      globalRank: codeChefData.globalRank,
      countryRank: codeChefData.countryRank,
      profile: codeChefData.profile,
      stars: codeChefData.stars,
      countryFlag: codeChefData.countryFlag,
    });
  } catch (error) {
    console.error('Error fetching CodeChef data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch LeetCode data
router.get('/leetcode', verifyToken, async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  const leetcodeId = user.leetcodeId;

  try {
    // Fetch different endpoints for LeetCode data
    const submitStatsResponse = await fetch(`https://leetcodeapi-v1.vercel.app/${leetcodeId}`);
    const questionsResponse = await fetch(`https://leetcodeapi-v1.vercel.app/questions/${leetcodeId}`);
    const ratingResponse = await fetch(`https://leetcodeapi-v1.vercel.app/rating/${leetcodeId}`);
    const contestResponse = await fetch(`https://leetcodeapi-v1.vercel.app/contest/${leetcodeId}`);

    const submitStatsData = await submitStatsResponse.json();
    const questionsData = await questionsResponse.json();
    const ratingData = await ratingResponse.json();
    const contestData = await contestResponse.json();

    res.json({
      submitStats: {
        total: submitStatsData.saisampath23.submitStatsGlobal.acSubmissionNum,
        rating: ratingData.rating,
      },
      contestDetails: {
        attendedContestsCount: contestData.userContestDetails.attendedContestsCount,
        globalRanking: contestData.userContestDetails.globalRanking,
        topPercentage: contestData.userContestDetails.topPercentage,
        totalParticipants: contestData.userContestDetails.totalParticipants,
      },
      questionStats: {
        easySolved: questionsData.Easy,
        mediumSolved: questionsData.Medium,
        hardSolved: questionsData.Hard,
      },
    });
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
