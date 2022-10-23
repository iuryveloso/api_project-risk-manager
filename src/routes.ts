import { Router } from 'express'
import customerController from '@controllers/customerController'
import authController from '@controllers/authController'
import userController from '@controllers/userController'
import isAuthenticated from '@middlewares/isAuthenticated'
import themeController from '@controllers/themeController'
import UploadFile from '@middlewares/uploadFile'

const upload = UploadFile()
const rootRoute = Router()
const authRoutes = Router()
const userRoutes = Router()
const customerRoutes = Router()
const themeRoutes = Router()

// Root route
rootRoute.get('/', (req, res) => res.json({
  projectName: 'Project Manager API',
  createdBy: 'Iury Veloso',
  email: 'iurysveloso@gmail.com'
}))

// OAuth Router
authRoutes.get('/google', authController.google)
authRoutes.get('/check', isAuthenticated, authController.check)
authRoutes.post('/', upload.single('avatar'), authController.create)
authRoutes.post('/login', authController.login)
authRoutes.get('/logout', isAuthenticated, authController.logout)

// Users routes
userRoutes.get('/', isAuthenticated, userController.get)
userRoutes.get('/avatar', isAuthenticated, userController.getAvatar)
userRoutes.patch('/', isAuthenticated, userController.update)
userRoutes.patch('/avatar', [isAuthenticated, upload.single('avatar')], userController.updateAvatar)
userRoutes.patch('/password', isAuthenticated, userController.updatePassword)

// Customer routes
customerRoutes.get('/', isAuthenticated, customerController.index)
customerRoutes.get('/:id', isAuthenticated, customerController.get)
customerRoutes.post('/', isAuthenticated, customerController.create)
customerRoutes.patch('/:id', isAuthenticated, customerController.update)
customerRoutes.delete('/:id', isAuthenticated, customerController.delete)

// Theme routes
themeRoutes.get('/', isAuthenticated, themeController.get)
themeRoutes.post('/', isAuthenticated, themeController.set)

export default { rootRoute, authRoutes, userRoutes, customerRoutes, themeRoutes }
