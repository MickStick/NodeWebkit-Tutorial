const User = require('../model/user');
const sha = require('sha-256-js');
const fs = require('fs');
const path = require('path');

module.exports.addUser = (body, files, res) => {
    let avi = ''
    console.log(`Files: ${JSON.stringify(files)}`);
    if (!files.file) {
        avi = "noimage.jpg"
    } else {
        avi = `${body.uname}_avi${path.extname(files.file.name)}`;
    }

    console.log(`Avi: ${avi}`);

    let newUser = new User({
        fname: body.fname,
        lname: body.lname,
        uname: body.uname,
        email: body.email,
        avi: avi,
        bio: "",
        password: sha(body.password)
    });

    let user = newUser.save((err, user) => {
        if (err) throw err;
        console.log(user.avi);
        if (user.avi == "noimage.jpg") {
            res.json({ status: true, message: 'User Added', user: user });
        } else {
            const newpath = `${path.join(__dirname, '../public/static/avi/')}${user.avi}`;
            fs.rename(files.file.path, newpath, function(err) {
                if (err) throw err;
                console.log(user.avi + " saved..");
                res.json({ status: true, message: 'User Added\nAvi Saved', user: user });
            });

        }

    });
    //res.json({ file: files });
}

module.exports.getUser = (body, res) => {
    body.password = sha(body.password);
    User.find({ uname: body.uname, password: body.password }, (err, user) => {
        if (err) throw err;

        if (!user.length) {
            console.error("User Not Found");
            res.json({ status: false, message: "User Not Found", user: null });
        } else {
            console.log("User Found");
            res.json({ status: true, message: "User Not Found", user: user });
        }

    });
}

module.exports.updateUser = (body) => {
    User.findOne({ uname: body.uname, password: body.password }, (err, user) => {
        if (err) throw err;

        if (!user.length) {
            res.json({ status: false, message: "User Not Found", user: null });
        } else {
            user = body;

            if (!body.avi || body.avi == 'undefined') {
                user.avi = "noimage.jpg";
            }
            user.save((err, newuser) => {
                if (err) throw err;

                if (!newuser.avi == "noimage.jpg") {
                    const newpath = `${path.join(__dirname, 'public/static/avi/')}${body.uname}avi${path.extname(files.file.name)}`;
                    fs.rename(files.file.path, newpath, function(err) {
                        if (err) throw err;
                        //console.log(files.file.name + " saved..");
                        res.json({ status: true, message: 'User Added', user: newuser });
                    });
                } else {
                    res.json({ status: true, message: 'User Added', user: newuser });
                }
            });

        }

    });


}