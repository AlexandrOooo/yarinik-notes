import express from 'express'
import * as UsersController from '../controllers/users'

const router = express.Router()

router.post('/signUp', UsersController.signUp)
router.get('/me', UsersController.getAuthenticatedUser)
router.post('/login', UsersController.login)
router.post('/logout', UsersController.logout)
export default router
