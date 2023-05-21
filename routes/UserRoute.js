const express = require('express')
const router = express.Router()
const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')

router.post('/signup', (req, res) => {
    let { name, email, password, dateOfBirth } = req.body
    name = name.trim()
    email = email.trim()
    password = password.trim()
    dateOfBirth = dateOfBirth.trim()

    if(name == '' || email == '' || password == '' || dateOfBirth == '') {
        res.json({
            status: "FAILED",
            message: "Empty input feilds!"
        })
    } else if(!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name feilds!"
        })
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email feilds!"
        })
    } else if(!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid Date Of Birth entered!"
        })
    } else if(password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {
        //Checking email
        User.find({email})
            .then((result) => {
                if(result.length) {
                    //A user already exist
                    res.json({
                        status: "FAILED",
                        message: "User with the provided email already exists"
                    })
                } else {
                    //Create a new user
                        //password hashing
                    const saltRounds = 10
                    bcrypt.hash(password, saltRounds)
                        .then((hashedPassword) => {
                            const newUser = new User({
                                name,
                                email,
                                password: hashedPassword,
                                dateOfBirth
                            })

                            newUser.save()
                                .then((result) => {
                                    res.json({
                                        status: "SUCCESS",
                                        message: "Signup successfully",
                                        data: result
                                    })
                                })
                                .catch((err) => {
                                    res.json({
                                        status: "FAILED",
                                        message: "An error occurred while saving user account"
                                    })
                                })
                        })
                        .catch((err) => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while hashing password!"
                            })
                        })
                }
            })
            .catch((err) => {
                console.log(err)
                res.json({
                    status: "FAILED",
                    message: "An error occurred while checking for existing user!"
                })
            })
    }
})

module.exports = router