module.exports = {
    ensureAuth: function (req, res, next){
        if (req.isAuthenticated()){
            return next()
        }else{
            res.render('login',{title:"You Must Log In",message:"you have to be logged in for that"})
        }
    },
    ensureGuest: function (req,res,next){
        if(req.isAuthenticated()){
            res.redirect('auth/admin')
        }else{
            return next()
        }

    }
}