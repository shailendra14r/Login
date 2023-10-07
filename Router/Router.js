import {Router} from 'express';
import * as controller from '../Controller/Controller.js';
import {vaildUser, verifyToken} from '../Middleware/auth.js';
const router = Router();


// POST Methods
router.route('/register').post(controller.register);
router.route('/login').post(vaildUser, controller.login);


export default router;