import { v4 as uuidv4 } from 'uuid'
import multer from 'multer'
import { Request } from 'express'

interface MulterRequestInterface extends Request {
  avatarError?: string
  userError?: string | undefined
}

export default function UploadFile () {
  const DIR = './uploads'

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-')
      cb(null, `${uuidv4()}-${fileName}`)
    }
  })

  const upload = multer({
    storage,
    fileFilter: async (req: MulterRequestInterface, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } else {
        cb(null, false)
        // return cb(new Error('Somente os formatos PNG e JPEG e são permitidos!'))
        req.avatarError = 'Somente os formatos PNG e JPEG e são permitidos!'
      }
    }
  })
  return upload
}
