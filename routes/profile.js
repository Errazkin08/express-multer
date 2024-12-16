var express = require('express');
var router = express.Router();
const multer  = require('multer')
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath ='public/uploads';
        console.log(uploadPath) // Path to public/uploads directory
    
        // Check if the directory exists; if not, create it
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true }); // Creates the directory recursively
        }
    
        cb(null, uploadPath); // Specify the upload directory
      },
    filename: function (req, file, cb) {
      // Extract the original name without the extension
      const originalName = path.parse(file.originalname).name;
      // Extract the extension from the original file
      const extension = path.extname(file.originalname);
      // Generate a unique suffix
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Combine them to form the new file name
      const newFileName = `${originalName}-${uniqueSuffix}${extension}`;
      cb(null, newFileName);
    }
  });
  const fileFilter=(req,file,cb)=>{
    const allowedExtensions=/png|jpg|jpeg/
    const extension=path.extname(file.originalname).toLowerCase()
    if(allowedExtensions.test(extension)){
        cb(null,true)
    }
    else{
        cb(new Error('Only .png and .jpg files are allowed'))
    }
  }
const upload = multer({ 
    storage: storage,
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:fileFilter
 })

/* GET home page. */
router.get('/', function(req, res, next) {
   res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    const name = req.body.izena; // Get the name entered in the form
    const filePath = path.join('/uploads', req.file.filename); // Relative path to the uploaded file

    // Dynamically generate the full URL
    const fileUrl = `${req.protocol}://${req.get('host')}${filePath}`;

    // Log the name and file link in the specified format
    console.log(`Zure izena: ${name}. Fitxategia: ${fileUrl}`);

    // Send a response with the full file URL
    res.send(`File uploaded successfully! Zure izena: ${name}. Fitxategia: <a href="${fileUrl}" target="_blank">${fileUrl}</a>`);
});

router.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      res.status(400).send(err.message);
    } else if (err) {
      // Handle other errors
      res.status(400).send(err.message);
    } else {
      next();
    }
  });



module.exports = router;
