
// import express from 'express'
// import sql from 'mssql';
// const app = express()
// import bodyParser from 'body-parser';
// import fileUpload from 'express-fileupload';
// import cors from 'cors'
// import dotenv from 'dotenv'
// import dealerRoute from './routes/Dealer.route.js'

// dotenv.config();
// app.use(bodyParser.json())
// app.use(fileUpload());
// app.use(express.static('uploads'));
// app.use(cors());


// // Routes
// const config = {
//   user: 'sa',
//   password: 'admin@1235',
//   server: '192.9.205.2',
//   database: 'DMS_KNL',  // change if your DB name is different
//   options: {
//     encrypt: false,
//     trustServerCertificate: true
//   }
// };


// // Connect to db


// console.log('Connecting to SQL Server...');
// let pool = await sql.connect(config);
// app.set('db', pool);
// app.get('/', function (req, res) {
//   res.status(200).json({
//     msg: "Welcome to nodejs"
//   })
// })

// app.use('/dealer', dealerRoute)
// const PORT = 500
// app.listen(PORT, () => {
//   console.log(`Server is up and running on port ${PORT}`)
// })

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dealerRoute from './routes/Dealer.route.js';
import adminRouter from './routes/AdminRoute.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use('/dealer', dealerRoute);
app.use('/admin', adminRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on port ${PORT}`);
});
