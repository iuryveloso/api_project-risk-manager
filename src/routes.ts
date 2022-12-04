import { Router } from 'express'

import authController from '@controllers/authController'
import authCreateVerified from '@middlewares/auth/authCreateVerified'
import authLoginVerified from '@middlewares/auth/authLoginVerified'

import userController from '@controllers/userController'
import userUpdateVerified from '@middlewares/user/userUpdateVerified'
import userUpdateAvatarVerified from '@middlewares/user/userUpdateAvatarVerified'
import userUpdatePasswordVerified from '@middlewares/user/userUpdatePasswordVerified'

import actionController from '@controllers/actionController'
import actionCreateVerified from '@middlewares/action/actionCreateVerified'
import actionUpdateVerified from '@middlewares/action/actionUpdateVerified'

import projectController from '@controllers/projectController'
import projectCreateVerified from '@middlewares/project/projectCreateVerified'
import projectUpdateVerified from '@middlewares/project/projectUpdateVerified'

import riskController from '@controllers/riskController'
import riskCreateVerified from '@middlewares/risk/riskCreateVerified'
import riskUpdateVerified from '@middlewares/risk/riskUpdateVerified'

import taskController from '@controllers/taskController'
import taskCreateVerified from '@middlewares/task/taskCreateVerified'
import taskUpdateVerified from '@middlewares/task/taskUpdateVerified'

import riskTaskController from '@controllers/riskTaskController'
import projectUserController from '@controllers/ProjectUserController'

import isAuthenticated from '@middlewares/isAuthenticated'
import UploadFile from '@middlewares/uploadFile'

const upload = UploadFile()
const rootRoute = Router()
const authRoutes = Router()
const userRoutes = Router()
const actionRoutes = Router()
const projectRoutes = Router()
const riskRoutes = Router()
const taskRoutes = Router()
const riskTaskRoutes = Router()
const projectUserRoutes = Router()

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
userRoutes.get('/', isAuthenticated, userController.list)
userRoutes.get('/get', isAuthenticated, userController.get)
userRoutes.get('/avatar', isAuthenticated, userController.getAvatar)
userRoutes.get('/avatar/:avatarName', isAuthenticated, userController.getAvatarByAvatarName)
userRoutes.patch('/', [isAuthenticated, userUpdateVerified], userController.update)
userRoutes.patch('/avatar', [isAuthenticated, upload.single('avatar'), userUpdateAvatarVerified], userController.updateAvatar)
userRoutes.patch('/password', [isAuthenticated, userUpdatePasswordVerified], userController.updatePassword)

// Action routes
actionRoutes.get('/', isAuthenticated, actionController.listAll)
actionRoutes.get('/get/:id', isAuthenticated, actionController.get)
actionRoutes.get('/:riskID', isAuthenticated, actionController.list)
actionRoutes.post('/', [isAuthenticated, actionCreateVerified], actionController.create)
actionRoutes.patch('/:id', [isAuthenticated, actionUpdateVerified], actionController.update)
actionRoutes.delete('/:id', isAuthenticated, actionController.delete)

// Project routes
projectRoutes.get('/', isAuthenticated, projectController.list)
projectRoutes.get('/:id', isAuthenticated, projectController.get)
projectRoutes.post('/', [isAuthenticated, projectCreateVerified], projectController.create)
projectRoutes.patch('/:id', [isAuthenticated, projectUpdateVerified], projectController.update)
projectRoutes.delete('/:id', isAuthenticated, projectController.delete)

// Risk routes
riskRoutes.get('/:projectID', isAuthenticated, riskController.list)
riskRoutes.get('/get/:id', isAuthenticated, riskController.get)
riskRoutes.post('/', [isAuthenticated, riskCreateVerified], riskController.create)
riskRoutes.patch('/:id', [isAuthenticated, riskUpdateVerified], riskController.update)
riskRoutes.delete('/:id', isAuthenticated, riskController.delete)

// Task routes
taskRoutes.get('/get/:id', isAuthenticated, taskController.get)
taskRoutes.get('/:projectID', isAuthenticated, taskController.list)
taskRoutes.get('/subtasks/:projectID', isAuthenticated, taskController.listAllSubTasks)
taskRoutes.get('/:projectID/:parentTaskID', isAuthenticated, taskController.listSubTasks)
taskRoutes.post('/', [isAuthenticated, taskCreateVerified], taskController.create)
taskRoutes.patch('/:id', [isAuthenticated, taskUpdateVerified], taskController.update)
taskRoutes.delete('/:id', isAuthenticated, taskController.delete)

// RiskTask routes
riskTaskRoutes.get('/:riskID', isAuthenticated, riskTaskController.list)
riskTaskRoutes.get('/task/:taskID', isAuthenticated, riskTaskController.listByTask)
riskTaskRoutes.post('/', isAuthenticated, riskTaskController.create)
riskTaskRoutes.delete('/:riskID/:taskID', isAuthenticated, riskTaskController.delete)

// ProjectUser routes
projectUserRoutes.get('/:userID', isAuthenticated, projectUserController.list)
projectUserRoutes.get('/project/:projectID', isAuthenticated, projectUserController.listByProject)
projectUserRoutes.get('/get/:userID/:projectID', isAuthenticated, projectUserController.get)
projectUserRoutes.post('/', isAuthenticated, projectUserController.create)
projectUserRoutes.delete('/:userID/:projectID', isAuthenticated, projectUserController.delete)

export default { rootRoute, authRoutes, userRoutes, actionRoutes, projectRoutes, riskRoutes, taskRoutes, riskTaskRoutes, projectUserRoutes }
