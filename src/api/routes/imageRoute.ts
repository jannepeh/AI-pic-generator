import express from 'express';
import {body} from 'express-validator';
import {validate} from '../../middlewares';
import {generateThumbnail} from '../controllers/imageController';

const router = express.Router();

router
  .route('/')
  .post(
    body('topic').notEmpty().escape(),
    body('text').optional().escape(),
    validate,
    generateThumbnail
  );

export default router;
