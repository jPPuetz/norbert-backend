/**
 * @author Arwed Mett, Simon Oswald
 */
import { Router } from 'express';
import assert from 'assert';

const router = new Router;
var count = 0;



router.post('/', (req, res) => {
    let { username, name, password } = req.body;
    if(count == 0){
        req.app.core.initUserCollection();
    }
    req.app.core.createUser(username, name, password)
    	.then(function (){
	        res.send('User created.');
    	})
    	.catch(function(e){
	        res.status(500).send('Username ' + username +' is already in use');
    	});  
});

router.put("/", (req, res) => {
    let user = req.body;
    if(req.session.authenticated){
    req.app.core.updateUser(req.session.user, user)
        .then(function (){

            res.send('User updated.');
        })
        .catch(function(){
            res.status(500).send('Could not update user');
        });
    }else res.send(403).send('You need to be logged in to change your user');  
});

router.delete("/:userId", (req,res) => {
    let userId = req.params.userId;
    console.log(userId);
    if(req.session.user.username === userId){
    req.app.core.deleteUser(userId)
        .then(function(){
            res.send('User ' + userId + ' was succesfully deleted.');
        })
        .catch(function(){
            res.status(500).send('User ' + userId + ' could not be deleted.');
        });
    }else res.status(403).send('You can not delete other users');
        
});


router.post("/login", (req, res) => {
    console.log(req.body);
    let {username, password} = req.body;  
    if (username === undefined || password === undefined) {
        res.status(400).send('Both username and password have to be provided.');
        return;
    }
    req.app.core.authUser(username, password)
        .then(user => {
            req.session.user = {
                id      : user._id,
                username: user.username
            };
            req.session.authenticated = true;
            res.send('Succesfully authenticated user ' + username );
        })
        .catch(function(e){
            console.log(e);
            res.status(403).send('Authentication for user ' + username + ' failed');
        });
});

router.post("/logout" ,(req,res) =>{
    delete req.session.authenticated
    delete req.session.user;
    res.send('User succesfully logged out');
})

router.authenticate = (req, res, next) => {
    if(req.session.authenticated) {
        console.log('Authenticated ' + req.session.user.username);
        next();
    }
    else {
        console.log('Authentication failed.');
        res.status(403).send('Could not authenticate');
    }
};

module.exports = router;
