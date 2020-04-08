const helpers = {}; //objeto que tiene las sgtes func

helpers.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Not autorizado');
    res.redirect('/');
};

module.exports = helpers;



