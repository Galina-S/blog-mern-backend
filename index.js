import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';

import { UserController, PostController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

mongoose
    .connect(
        process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

// storage

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads'); //callback function, save the files in Uploads folder
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });


app.use(express.json()); 
app.use(cors());
app.use('/uploads', express.static('uploads')); //get request to get a static file

//Authorization
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
 
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id', 
    checkAuth, 
    postCreateValidation, 
    handleValidationErrors,
    PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log("Server OK")
})