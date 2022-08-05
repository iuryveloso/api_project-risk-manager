import { Router } from 'express'
import customerController from '@controllers/customerController'
import userController from '@controllers/userController'
import isAuthenticated from '@middlewares/isAuthenticated'
const rootRoute = Router()
const userRoutes = Router()
const customerRoutes = Router()

// Root route
rootRoute.get('/', (req, res) => res.json({
  projectName: 'Project Manager API',
  createdBy: 'Iury Veloso',
  email: 'iurysveloso@gmail.com'
}))

// Users routes
userRoutes.get('/', isAuthenticated, userController.get)
userRoutes.get('/check', isAuthenticated, userController.check)
userRoutes.post('/', userController.create)
userRoutes.post('/login', userController.login)
userRoutes.get('/logout', userController.logout)
userRoutes.patch('/', isAuthenticated, userController.update)
userRoutes.patch('/password', isAuthenticated, userController.updatePassword)

// Customer routes
customerRoutes.get('/', customerController.index)
customerRoutes.get('/:id', isAuthenticated, customerController.get)
customerRoutes.post('/', isAuthenticated, customerController.create)
customerRoutes.patch('/:id', isAuthenticated, customerController.update)
customerRoutes.delete('/:id', isAuthenticated, customerController.delete)

export default { rootRoute, userRoutes, customerRoutes }
