import { Router } from 'express'

import authController from '@controllers/authController'
import authCreateVerified from '@middlewares/auth/authCreateVerified'
import authLoginVerified from '@middlewares/auth/authLoginVerified'

import userController from '@controllers/userController'
import userUpdateVerified from '@middlewares/user/userUpdateVerified'
import userUpdateAvatarVerified from '@middlewares/user/userUpdateAvatarVerified'
import userUpdatePasswordVerified from '@middlewares/user/userUpdatePasswordVerified'

import customerController from '@controllers/customerController'
import customerCreateVerified from '@middlewares/customer/customerCreateVerified'
import customerUpdateVerified from '@middlewares/customer/customerUpdateVerified'

import isAuthenticated from '@middlewares/isAuthenticated'
import UploadFile from '@middlewares/uploadFile'

const upload = UploadFile()
const rootRoute = Router()
const authRoutes = Router()
const userRoutes = Router()
const customerRoutes = Router()

// Root route
rootRoute.get('/', (req, res) => res.json({
  projectName: 'Project Manager API',
  createdBy: 'Iury Veloso',
  email: 'iurysveloso@gmail.com'
}))

// Auth Router
authRoutes.get('/check', isAuthenticated, authController.check)
authRoutes.post('/', [upload.single('avatar'), authCreateVerified], authController.create)
authRoutes.post('/login', authLoginVerified, authController.login)
authRoutes.get('/google', authController.google)
authRoutes.get('/logout', isAuthenticated, authController.logout)

// Users routes
userRoutes.get('/', isAuthenticated, userController.get)
userRoutes.get('/avatar', isAuthenticated, userController.getAvatar)
userRoutes.patch('/', [isAuthenticated, userUpdateVerified], userController.update)
userRoutes.patch('/avatar', [isAuthenticated, upload.single('avatar'), userUpdateAvatarVerified], userController.updateAvatar)
userRoutes.patch('/password', [isAuthenticated, userUpdatePasswordVerified], userController.updatePassword)

// Customer routes
customerRoutes.get('/', isAuthenticated, customerController.index)
customerRoutes.get('/:id', isAuthenticated, customerController.get)
customerRoutes.post('/', [isAuthenticated, customerCreateVerified], customerController.create)
customerRoutes.patch('/:id', [isAuthenticated, customerUpdateVerified], customerController.update)
customerRoutes.delete('/:id', isAuthenticated, customerController.delete)

export default { rootRoute, authRoutes, userRoutes, customerRoutes }
