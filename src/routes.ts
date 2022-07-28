import { Router } from 'express'
import customerController from '@controllers/customerController'
import userController from '@controllers/userController'
import checkTokenMiddleware from '@middlewares/checkTokenMiddleware'
const routes = Router()

// Root route
routes.get('/', (req, res) => res.json({ message: 'Project Manager API with TS' }))

// Users routes
routes.get('/auth', checkTokenMiddleware, userController.get)
routes.post('/auth', userController.create)
routes.post('/auth/login', userController.login)
routes.patch('/auth', checkTokenMiddleware, userController.update)

// Customer routes
routes.get('/customer', customerController.index)
routes.get('/customer/:id', customerController.get)
routes.post('/customer', customerController.create)
routes.patch('/customer/:id', customerController.update)
routes.delete('/customer/:id', customerController.delete)

export default routes
