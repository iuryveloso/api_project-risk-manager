import { Router } from 'express'
import customerController from '@controllers/customerController'
import userController from '@controllers/userController'
import isAuthenticated from '@middlewares/isAuthenticated'
import themeController from '@controllers/themeController'
import UploadFile from '@middlewares/uploadFile'
const upload = UploadFile()
const rootRoute = Router()
const userRoutes = Router()
const customerRoutes = Router()
const themeRoutes = Router()

// Root route
rootRoute.get('/', (req, res) => res.json({
  projectName: 'Project Manager API',
  createdBy: 'Iury Veloso',
  email: 'iurysveloso@gmail.com'
}))

// Users routes
userRoutes.get('/', isAuthenticated, userController.get)
userRoutes.get('/avatar', isAuthenticated, userController.getAvatar)
userRoutes.get('/check', isAuthenticated, userController.check)
userRoutes.post('/', upload.single('avatar'), userController.create)
userRoutes.post('/login', userController.login)
userRoutes.get('/logout', isAuthenticated, userController.logout)
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

export default { rootRoute, userRoutes, customerRoutes, themeRoutes }
