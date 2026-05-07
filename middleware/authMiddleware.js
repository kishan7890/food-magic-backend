const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){

  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({msg:"No token"})
  }

  try{

    const decoded = jwt.verify(token,process.env.SECRET_KEY)

    req.user = decoded

    next()

  }catch(err){

    res.status(401).json({msg:"Invalid token"})

  }

}