 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";

import UserModel from '../models/User.js';

export const register = async(req, res) => {
    try {    
   
        // Password encryption  // hash 
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // create document in DB
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
             _id: user._id,
            }, 
            'secret123',
            {
              expiresIn: '30d',
            },
        );

        

        const { passwordHash, ...userData} = user._doc;

        res.json( {
            ...userData,
            token, 
        });

    } catch (err) {
        console.log(err)
        res.status(500).json(
           {
            message: 'User registration was not possible'
           }
        )
    }
};

export const login = async(req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'User was not found',
            });
        }


        //check if the password correct is
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(403).json( {
                message: 'Password or login is not correct'
            });
        };

        //create token (encrypted)
        const token = jwt.sign(
            {
             _id: user._id,
            }, 
            'secret123',
            { //token is valid 30 days long
              expiresIn: '30d',
            },
        );

        const { passwordHash, ...userData} = user._doc;

        res.json( {
            ...userData,
            token, 
        });

    } catch (err) {
        console.log(err)
        res.status(500).json(
           {
            message: 'It was not possible to authorize'
           }
        )

    }
};

export const getMe = async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User is not found'
            })
        }

        const { passwordHash, ...userData} = user._doc;

        res.json(userData);

       
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'No access',
        })
        
    }
};