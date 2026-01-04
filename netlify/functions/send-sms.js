```javascript
const twilio = require('twilio');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const barberPhone = process.env.BARBER_PHONE_NUMBER;
  
  const client = twilio(accountSid, authToken);

  try {
    // Send SMS to customer
    await client.messages.create({
      body: `Hi ${data.name}! Your appointment at Kay's Barbers is confirmed.\n\nDate: ${data.date}\nTime: ${data.time}\nService: ${data.service}\n\nLocation: London Road, Grays, RM17 5DD\n\nFree cancellation up to 24hrs before. Call 01375 375566`,
      from: twilioPhone,
      to: data.phone
    });

    // Send SMS to barber shop
    await client.messages.create({
      body: `NEW BOOKING\n\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.service}\nDate: ${data.date}\nTime: ${data.time}\nPostcode: ${data.postcode}`,
      from: twilioPhone,
      to: barberPhone
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Twilio error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```
