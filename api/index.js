require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
//const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(express.json())


app.use(
  cors({
    origin: [
      'https://lively-rabanadas-5f4f57.netlify.app,', 'https://strynder.com'
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:['Content-Type'],
    optionSuccessStatus:200,
    credentials: true,
  })
);


// Handle preflight requests
app.options('*', cors());

const { API_KEY, AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX, } = process.env;

app.get('', (req, res) => {
  res.send('This is the home page')
})



  // Endpoint to handle email verification and add to Mailchimp
 app.post('/subscribe', async (req, res) => {
  
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
  
    try {
      console.log("try block");
      console.log(MAILCHIMP_SERVER_PREFIX, AUDIENCE_ID, API_KEY);
      
      // Add email to Mailchimp
      const response = await axios.post(
        `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
        {
          email_address: email,
          status: 'subscribed',
        },
        {
          headers: {
            Authorization: `apikey ${API_KEY}`,
          },
        }
      );
  
      console.log('Email added to Mailchimp:', response.data);
      res.status(200).json({ message: 'Email verified and added to Mailchimp.' });
    } catch (error) {
      console.error('Error adding to Mailchimp:', error.response?.data || error.message);
      if (error.response) {
        const { title, status, detail } = error.response.data;
        if (title === 'Member Exists') {
          return res.status(400).json({ error: 'This email is already subscribed to the newsletter.' });
        }
      }
      res.status(500).json({ error: 'Failed to add email to Mailchimp. Please try again.' });
    }
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


  // Step 2: Add to Mailchimp if email is valid
      /*const response = await axios.post(
        `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
        {
          email_address: email,
          status: 'subscribed',
        },
        {
          headers: {
            Authorization: `apikey ${API_KEY}`,
          },
        }
      );

      console.log('Added to Mailchimp:', mailchimpResponse.data);*/
  
      //res.status(200).json({ message: 'Email added to Mailchimp and verification email sent.' });
    /*} catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to subscribe. Please try again.' });


      API_KEY, AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX,
    }*/

  /*if (!SMTP_HOST && !SMTP_PORT && !SMTP_USER && !SMTP_PASS && !REMOTE_HOST) {
  console.error("Missing required environment variables");
  process.exit(1);
}*/

//email verification setup
/*const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });


  const verificationURL = `http://localhost:5173//subscribe/verify`

  /*app.get('/', (req,res) => {
    res.send('serve started succefully')
   })

// end point to handle sunbcribers
  app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
  
    // Step 1: Verify Email via Nodemailer
    try {
      await transporter.sendMail({
        from: `"Strynder" <${SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        text: `Click the link to verify your email: ${verificationURL}?email=${email}`,
        html: `<p>Click the link to verify your email:</p>
               <a href="${verificationURL}?email=${email}">Verify your Email</a>
               <p>If you didn't subscribe, <a href="${verificationURL}/unsubscribe?email=${email}">click here to unsubscribe</a>.</p>`,
      }
    );
  
      console.log('Verification email sent. kindly check your mail');
      res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }
  
    
  });*/