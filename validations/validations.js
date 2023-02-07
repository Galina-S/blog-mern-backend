import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'The email format is incorrect').isEmail(),
    body('password', 'The password should be at least 5 symbols').isLength({ min: 5 }), 
    body('fullName', 'Specify a name').isLength({ min: 3 }),
    body('avatarUrl', 'The Avatar link is incorrect').optional().isURL(), 
];

export const loginValidation = [
    body('email', 'The email format is incorrect').isEmail(),
    body('password', 'The password should be at least 5 symbols').isLength({ min: 5 }), 
   ];

export const postCreateValidation = [
    body('title', 'Enter the title of article').isLength({ min: 3}).isString(),
    body('text', 'Enter the text of the article').isLength({ min: 3}).isString(), 
    body('tags', 'Not the right tag format').optional().isString(),
    body('imageUrl', 'Wrong image URL').optional().isString(), 
];
