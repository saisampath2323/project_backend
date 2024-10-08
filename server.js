const express = require('express'); 
const User=require('./schemas/User');
const cors=require('cors');
const jwt=require("jsonwebtoken");
const cpPlatforms=require('./routes/cp-platforms');
const bodyParser = require('body-parser');
const Hackathon=require('./routes/hackathons')
const Dbconnect=require('./Db/Dbconnect');
const crypto = require('crypto');
const app = express(); 
const PORT = 3001; 




const secretKey ="nFmJ29qxqgMssJ7gxhriwE+1r8Awp8egXnpRkC3CjIM=";
// const Userr= new User({email:"milavarapusaisampath@gmail.com",password:"saisampath123",codechefId:"saisampath23",leetcodeId:"saisampath123"});
// Userr.save();
app.use(cors());
app.use(bodyParser.json()); 
app.use("/api",cpPlatforms)
app.use("/hackathons",Hackathon);

// async function logMovies() {
//   const response = await fetch("https://codechef-api.vercel.app/saisampath23");
//   const movies = await response.json();
//   console.log(movies);
// }
// logMovies();

app.listen(PORT, (error) =>{ 

    if(!error) {
        console.log("Server is Successfully Running,and App is listening on port "+ PORT)}
    else {
        console.log("Error occurred, server can't start", error); 
    }
});
app.get('/',(req,res)=>{
    res.send("sai");
}) 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      
      const token = jwt.sign({email: user.email }, secretKey);
     
      
  
      res.json({ token:token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/signup', async (req, res) => {
    const { email, password, codechefId, leetcodeId } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Hash the password before saving it to the database
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        email,
        password: password,
        codechefId,
        leetcodeId,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate a token
      const token = jwt.sign({ email: newUser.email }, secretKey);
  
      // Respond with the token
      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.get('/profile', verifyToken, async (req, res) => {
   
    const { email } = req.user;
  
    try {
      
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ email: user.email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
     
     
      if (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      req.user = decoded; 
      next();
    });
  }
  
Dbconnect();






 