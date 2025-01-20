require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(express.json())



app.use(cors({
  origin: 'https://mybackend.netlify.app',  // Allow your Netlify site
}));

const { API_KEY, AUDIENCE_ID, MAILCHIMP_SERVER_PREFIX, REMOTE_HOST} = process.env;

//email verification setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationURL = `${REMOTE_HOST}/subscribe/verify`

  app.get('/', (req,res) => {
    res.send('serve started succefully')
  } )

// end point to handle sunbcribers
  app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
  
    // Step 1: Verify Email via Nodemailer
    try {
      await transporter.sendMail({
        from: `"Strynder" <${process.env.SMTP_USER}>`,
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
  
    
  });

  // Endpoint to handle email verification and add to Mailchimp
  app.post('/verify-email', async (req, res) => {
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
      res.status(500).json({ error: 'Failed to add email to Mailchimp. Please try again.' });
    }
  });

const PORT = 5000;
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
    }*/