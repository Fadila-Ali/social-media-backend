const express = require("express")

const posts = require("./PostsController")

const {
    getAllUsers,
    getUser,
    newUser,
    loginUser,
    editUser,
    getInterestFromUserByIndex,
    getInterestsFromUsers,
    addInterestToUser,
    deleteInterestsFromUsers
} = require("../queries/users")


const {checkPassword , checkEmail} = require("../middleware/userMiddleware")
const users = express.Router()

users.use("/:username/posts", posts)

users.get("/", async (req ,res) => {
    const allUsers = await getAllUsers();

    const filter = req.query
    const filterUser = allUsers.filter(user => {
        let isValid = true
        for(key in filter){
            if(isNaN(filter[key])){
                isValid = isValid && (user[key].toLowerCase() == filter[key].toLowerCase())
            }
            else{
                isValid = isValid && (user[key] == parseInt(filter[key]))
            }
        }
        return isValid
    })
    res.send(filterUser)

})

users.get("/:id", async (req , res) => {
    const {id} = req.params;

    const user = await getUser(id)
    if(user){
        res.json(user)
    }
    else{
        res.status(404).json({error: "User not Found"})
    }

})

users.post("/signup", checkPassword, checkEmail, async(req , res) => {

    const user = await newUser(req.body);
    
    const {id , username} = user
    
    res.status(200).json({username, id});
    
    })
    
    users.post("/login", async (req , res) => {
        const user = await loginUser(req.body)
    
        if(user.email){
            const {id , email} = user
            res.status(200).json({message: "Login Successful", id, email});
        }
        else{
            res.status(401).json({message: "User Not Found"})
        }
    
    })



    users.put("/:id", async(req , res) => {
        const {id} = req.params

        const editUsers = await editUser(id , req.body)

        res.status(200).json(editUsers)
    })



//Add Categories to User
users.post("/:userId/interest/:interestId", async (req, res) => {
    const { userId, interestId } = req.params;
  
    const addInterest = await  addInterestToUser(userId, interestId);
  
    if (addInterest) {
      res.json({ message: "Interest Added" });
    } else {
      res.json({ error: "Interest not added" });
    }
  });
  
  
  
  //Get Categories for User
  users.get("/:userId/interest", async (req, res) => {
    const { userId } = req.params;
  
    const userInterest = await getInterestsFromUsers(userId);
  
    const filter = req.query
  
    const filterInterest = userInterest .filter((req) => {
      let isValid = true
      for(key in filter){
        if(isNaN(filter[key])){
          isValid = isValid && req[key].toLowerCase() === filter[key].toLowerCase()
        }
        else{
          isValid = isValid && req[key] == parseInt(filter[key])
        }
      }
      return isValid
    })
  
    res.json(filterInterest);
  });
  
  //Delete Categories for User
  users.delete("/:userId/interest/:interestId", async (req, res) => {
    const { userId, interestId } = req.params;
  
    const deleteInterests = await  deleteInterestsFromUsers(userId, interestId);
  
    if (deleteInterests) {
      res.status(200).json(deleteInterests);
    }
  });


  users.get("/:userId/interest/:interestId", async (req, res) => {
    const { userId, interestId } = req.params;
  
    const getInterest = await getInterestFromUserByIndex(userId, interestId);
  
    if (getInterest && !getInterest.message) {
      res.json(getInterest);
    } else {
      res.status(404).json({ error: "not found" });
    }
  });


    module.exports = users