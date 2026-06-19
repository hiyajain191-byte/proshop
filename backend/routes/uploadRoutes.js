import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// STORAGE
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// FILE FILTER
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// ROUTE
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',

      // ✅ FIXED PATH
      image: `/${req.file.path.replace(/\\/g, '/')}`,
    });
  });
});

export default router;