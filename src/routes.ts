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

import projectController from '@controllers/projectController'
import projectCreateVerified from '@middlewares/project/projectCreateVerified'
import projectUpdateVerified from '@middlewares/project/projectUpdateVerified'

import taskController from '@controllers/taskController'
import taskCreateVerified from '@middlewares/task/taskCreateVerified'
import taskUpdateVerified from '@middlewares/task/taskUpdateVerified'

import isAuthenticated from '@middlewares/isAuthenticated'
import UploadFile from '@middlewares/uploadFile'

const upload = UploadFile()
const rootRoute = Router()
const authRoutes = Router()
const userRoutes = Router()
const customerRoutes = Router()
const projectRoutes = Router()
const taskRoutes = Router()

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
customerRoutes.get('/', isAuthenticated, customerController.get)
customerRoutes.post('/', [isAuthenticated, customerCreateVerified], customerController.create)
customerRoutes.patch('/:id', [isAuthenticated, customerUpdateVerified], customerController.update)
customerRoutes.delete('/:id', isAuthenticated, customerController.delete)

// Project routes
projectRoutes.get('/', isAuthenticated, projectController.index)
projectRoutes.get('/:id', isAuthenticated, projectController.get)
projectRoutes.post('/', [isAuthenticated, projectCreateVerified], projectController.create)
projectRoutes.patch('/:id', [isAuthenticated, projectUpdateVerified], projectController.update)
projectRoutes.delete('/:id', isAuthenticated, projectController.delete)

// Task routes
taskRoutes.get('/:projectID', isAuthenticated, taskController.get)
taskRoutes.get('/one/:id', isAuthenticated, taskController.getOne)
taskRoutes.get('/:projectID/:parentTaskID', isAuthenticated, taskController.getWithParent)
taskRoutes.post('/', [isAuthenticated, taskCreateVerified], taskController.create)
taskRoutes.patch('/:id', [isAuthenticated, taskUpdateVerified], taskController.update)
taskRoutes.delete('/:id', isAuthenticated, taskController.delete)

export default { rootRoute, authRoutes, userRoutes, customerRoutes, projectRoutes, taskRoutes }
