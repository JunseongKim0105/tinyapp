const { application } = require("express");

app.post('/login',(req,res)=>{
  const email= req.body.email;
  const password= req.body.password;
  
  
})

const users = {

}
const getUserByEmail= function(email){
  const values = Object.keys(users)
for(const id of values ){

}  
  
  
  // do a for loop
  for(const id in users){
    const user = users[id]
  if(user.email=== email){
    return user
  }
  }
  return null
}