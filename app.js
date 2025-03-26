//mailing through nodemailer
// require('dotenv').config();
// const app= require('express')();

// // const nodemailer=require("nodemailer")
// // const transporter=nodemailer.createTransport({
// //     host:"smtp.gmail.com",
// //     secure:true,
// //     sender:"gmail",
// //     auth:{
// //         user:"vikashojha18oct90@gmail.com",
// //         pass:"zlpjaqvnmxznxdvs"
// //     }
// // })
// // // async..await is not allowed in global scope, must use a wrapper
// // async function sendMail(to,subject,text,html) {
// //     // send mail with defined transport object
// //     const info = await transporter.sendMail({
// //       from: '<vikashojha18oct1990@gmail.com>', // sender address
// //       to: "vikashojha16oct@gmail.com", // list of receivers
// //       subject: "Hello ✔", // Subject line
// //       text: "Hello world?", // plain text body
// //       html: "<b>Hello world?</b>", // html body
// //     });

// //     console.log("Message sent: %s", info.messageId);
// //     // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// //   }

// //   main().catch(console.error);

//  app.get("/",(req,res)=>{
//   res.send("Hello World");})
// //     var mailOptions={
// //         from:"vikashojha16oct@gmail.com",
// //         to:"vikas"
// //     }
// // })
// const PORT=process.env.PORT || 4000;
// app.listen(4000,()=>{

//        console.log("app is runnning")
//    })
// // })


//######step 2 mail with the help of env
// require("dotenv").config();// dot env config
// const express = require("express");// express package
// const nodemailer = require("nodemailer");// nodemailer

// const app = express();//express app use

// // Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587, // Use 465 for SSL or 587 for TLS
//     secure: false, // Use `true` for port 465
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//     },
// });

// app.get("/", async (req, res) => {
//     res.send("Hello India");

//     // Mail options
//     const mailOptions = {
//         from: process.env.EMAIL, // Sender address
//         to: process.env.TO_EMAIL, // Receiver email
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // Plain text body
//         // html: "<b>Hello world?</b>", // HTML body (optional)
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error("Error sending email:", error);
//         } else {
//             console.log("Email sent: " + info.response);
//         }
//     });
// });

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`App is running on port ${PORT}`);
// });



//####step 3 include app and app2
// require("dotenv").config();
// const express = require("express");
// const Mail = require("./app2"); // Import Mail class

// const app = express();

// app.get("/", async (req, res) => {
//     res.send("Hello Ravindera");

//     // Send email
//     const mail = new Mail();
//     mail.setTo(process.env.TO_EMAIL);
//     mail.setSubject("Welcome Email Service");
//     mail.setText("✅Hello, welcome Ravinder kumar");

//     await mail.send(); // Wait for email to be sent
//     console.log("✅ Email process completed.");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });

require("dotenv").config(); // Load environment variables
const express = require("express");
const path = require("path"); // Path module to resolve file paths
const Mail = require("./app2"); // Mail class (as created before)

const app = express();
app.use(express.json()); // Enable JSON parsing for POST requests

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store OTPs in memory (for simplicity, could be a database for persistence)
const otpStore = {};

// Generate OTP (6-digit number)
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  return otp.toString();
}

// Route to send OTP to email
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const otp = generateOTP();
    otpStore[email] = otp; // Store OTP temporarily (in-memory store)

    // Generate the OTP verification URL with the email and OTP
    const verificationUrl = `http://localhost:5500/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`;

    // Prepare the mail object
    const mail = new Mail();
    mail.setTo(email);
    mail.setText(`Your OTP code is: ${otp}. Click the following link to verify: ${verificationUrl}`);

    // Send OTP email with verification link
    await mail.send();

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "❌ Error sending OTP." });
  }
});

// Route to handle OTP verification when the user clicks the link
app.get("/verify-otp", (req, res) => {
  const { email, otp } = req.query;
  if (!email || !otp) {
    return res.status(400).send("Email or OTP missing.");
  }

  // Check if OTP matches
  if (otpStore[email] === otp) {
    delete otpStore[email]; // Delete OTP after verification (for security)
    res.redirect("/next-page"); // Redirect to the next page after successful OTP verification
  } else {
    res.status(400).send("❌ Invalid OTP.");
  }
});

// Route for the next page after OTP verification
app.get("/next-page", (req, res) => {
  res.send("<h1>Welcome! OTP verified successfully.</h1>");
});

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


//####step4

// require("dotenv").config(); // Load environment variables
// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const Mail = require("./app2");

// const app = express();
// app.use(express.json()); // Enable JSON parsing for POST requests

// // Test route to check server
// app.get("/", (req, res) => {
//     res.send("✅ Server is running now.");
// });

// // Route to send a simple text email
// app.get("/send-email", async (req, res) => {
//     try {
//         const mail = new Mail();
//         mail.setTo(process.env.TO_EMAIL);
//         mail.setSubject("Welcome Email");
//         mail.setText("Hello, welcome to our mail project!");

//         await mail.send(); // Wait for email to be sent
//         res.send("✅ Email sent successfully.");
//     } catch (error) {
//         console.error("❌ Error:", error);
//         res.status(500).send("❌ Error sending email.");
//     }
// });

// // Route to send an email with an HTML template
// app.post("/mail2", async (req, res) => {
//     try {
//         console.log("📩 Received Request:", req.body);

//         let { receiver_id, subject, text } = req.body;

//         // Check if HTML template exists
//         const htmlFilePath = path.join(__dirname, "mail.html");
//         let htmlData = "";
//         if (fs.existsSync(htmlFilePath)) {
//             htmlData = fs.readFileSync(htmlFilePath, "utf8");
//         } else {
//             console.warn("⚠️ mail.html not found, sending plain text instead.");
//         }

//         const mail = new Mail();
//         mail.setTo(receiver_id);
//         mail.setSubject(subject);
//         mail.setText(text);
//         mail.setHTML(htmlData || text); // Fallback to text if HTML not found

//         await mail.send(); // Wait for email to be sent
//         res.send("✅ Email sent successfully.");
//     } catch (error) {
//         console.error("❌ Error:", error);
//         res.status(500).send("❌ Error sending email.");
//     }
// });

// // Start server
// const PORT = process.env.PORT || 5500;
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });


// 

// require("dotenv").config();
// const express=require("express");
// const crypto=require("crypto");
// const fs=require("fs");
// const path=require("path");
// const app=express();
// const Mail=("./app2");
// const otpStorage=require('./otpStorage');
// var cookieParser=require("cookie-parser");
// const { error } = require("console");

// app.use(express.json());
// app.set("view engine","ejs");
// app.set("views",path.resolve("./views"))
// app.use(express.urlencoded({extended:false}));
// let db=[
//     {
//         email:'vikashojha18oct90@gmail.com',password:'ojha@9568',name:'vikash ojha'
//     }
// ];
// let generateOTP=()=>{
//     return crypto.randomInt(100000,999999);
// }
// app.get('/',(req,res)=>{
//     let cookie=req.cookies['isLoggedOn'] ? JSON.parse(req.cookies['isLoggedOn']):null;
//     if(!cookie){
// return res.redirect("/login");
//     }
//     res.render('index');
// });

// app.route('/login').get((req,res)=>{
//     res.render('login');
// })
// .post((req,res)=>{
//     const{email,password}=req.body;
//     const user=db.find(user=>user.email===email && user.password===password);
//  if(user){
//     console.log('User found',user);
//     res.cookie('isLoggedIn','true');
//     return res.redirect('/');
//  }else{
//     console.log('Invalid Credentials');
//     return res.status(401).send('Invalid Credentials');
//  }

// });
// app.get('/logout',(req,res)=>{
//     res.clearCookie('isLoggedIn');
//     res.redirect('login');
// });
// app.get('/forgot-password',(req,res)=>{
//     res.render('forget-password');
// });
// app.get('verify-otp',(req,res)=>{
//     const email=req.query.email;
//     const error=req.query.error;
//     res.render('verify-otp',{email,error});
// });

// app.post('/forgot-password',(req,res)=>{
//     const {email}=req.body;
//     if (email && db.find(user => user.email == email)) {
//         let otp = generateOTP();
//         otpStorage.set(email, otp);
//         let forget_pass_template = fs.readFileSync(path.join(__dirname,'forgotPassword.html'),'utf-8');
// forget_pass_template = forget_pass_template.replace("{{user_name}}", email);
// forget_pass_template = forget_pass_template.replace("{{OTP_CODE}}", otp);
// let mail = new Mail();
// mail.setReceiver(email);
// mail.setSubject("Password Reset");
// mail.setHTML(forget_pass_template);
// mail.send().then((result)=>{
//     res.render('verifyotp',{email:email}); 
// })
// .catch((error)=>{
//     console.log(error);
//     res.status(500).send("Internal Server Error");
// });
//     }else{
//         res.status(400).json({message:"Invalid Email"});
//     }

// });
// setInterval(()=>{
//     console.log(otpStorage.getAll())},10000)
// app.post('/verify-otp',(req,res)=>{
//     const { email, otp } = req.body;
// console.log(email, otp);
// if (otpStorage.verify(email, otp)) {
//     console.log('verified');
//     res.cookie('isLoggedIn', 'true');
//     res.redirect('/');
// }else {
//     const error = 'Invalid OTP';
//     res.redirect(`/verify-otp?email=${email}&error=${encodeURIComponent(error)}`);
// }

// });



// require("dotenv").config();
// const express = require("express");
// const crypto = require("crypto");
// const fs = require("fs");
// const path = require("path");
// const cookieParser = require("cookie-parser");

// const Mail = require("./app2");  // Ensure this is correctly implemented
// const otpStorage = require("./otpStorage");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// // Mock Database
// let db = [
//     { email: 'vikashojha18oct90@gmail.com', password: 'ojha@9568', name: 'vikash ojha' }
// ];

// // Generate 6-digit OTP
// const generateOTP = () => crypto.randomInt(100000, 999999);

// // Home Route (Requires Login)
// app.get('/', (req, res) => {
//     let cookie = req.cookies['isLoggedIn'];
//     if (!cookie) {
//         return res.redirect("/login");
//     }
//     res.render('index');
// });

// // Login Routes
// app.route('/login')
//     .get((req, res) => {
//         res.render('login');
//     })
//     .post((req, res) => {
//         const { email, password } = req.body;
//         const user = db.find(user => user.email === email && user.password === password);

//         if (user) {
//             console.log('User found:', user);
//             res.cookie('isLoggedIn', 'true');
//             return res.redirect('/');
//         } else {
//             console.log('Invalid Credentials');
//             return res.status(401).send('Invalid Credentials');
//         }
//     });

// // Logout Route
// app.get('/logout', (req, res) => {
//     res.clearCookie('isLoggedIn');
//     res.redirect('/login');
// });

// // Forgot Password Route (Page)
// app.get('/forgot-password', (req, res) => {
//     res.render('forgot-password');
// });

// // OTP Verification Page
// app.get('/verify-otp', (req, res) => {
//     const { email, error } = req.query;
//     res.render('verify-otp', { email, error });
// });

// // Forgot Password (OTP Generation & Email Sending)
// app.post('/forgot-password', (req, res) => {
//     const { email } = req.body;
    
//     if (email && db.find(user => user.email === email)) {
//         let otp = generateOTP();
//         otpStorage.set(email, otp);
        
//         let templatePath = path.join(__dirname, 'forgotPassword.html');
//         let forget_pass_template = fs.readFileSync(templatePath, 'utf-8');
//         forget_pass_template = forget_pass_template.replace("{{user_name}}", email);
//         forget_pass_template = forget_pass_template.replace("{{OTP_CODE}}", otp);

//         let mail = new Mail();
//         mail.setReceiver(email);
//         mail.setSubject("Password Reset");
//         mail.setHTML(forget_pass_template);

//         mail.send()
//             .then(() => {
//                 res.render('verify-otp', { email: email });
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.status(500).send("Internal Server Error");
//             });
//     } else {
//         res.status(400).json({ message: "Invalid Email" });
//     }
// });

// // OTP Verification
// app.post('/verify-otp', (req, res) => {
//     const { email, otp } = req.body;
//     console.log(email, otp);

//     if (otpStorage.verify(email, otp)) {
//         console.log('OTP Verified');
//         res.cookie('isLoggedIn', 'true');
//         res.redirect('/');
//     } else {
//         const error = 'Invalid OTP';
//         res.redirect(`/verify-otp?email=${email}&error=${encodeURIComponent(error)}`);
//     }
// });

// // Periodically Log OTP Storage (for debugging)
// setInterval(() => {
//     console.log(otpStorage.getAll());
// }, 10000);

// // Start Server
// const PORT = process.env.PORT || 4004;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
