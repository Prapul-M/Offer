const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const xml2js = require('xml2js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Salesforce Marketing Cloud credentials
const CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const SUBDOMAIN = process.env.SALESFORCE_SUBDOMAIN;

// Function to get access token
async function getAccessToken() {
  const tokenUrl = `https://${SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`;
  try {
    const response = await axios.post(tokenUrl, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });
    console.log('Access token generated successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to obtain access token');
  }
}

// API endpoint to create/update offer
app.post('/api/offers', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const endpoint = `https://${SUBDOMAIN}.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:16412822-6346-4D4D-978F-481689E129B0/rows`;
    
    console.log('Creating offer with data:', req.body);
    
    const response = await axios.post(endpoint, {
      items: [req.body]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Salesforce API response:', response.data);

    res.json({ success: true, message: 'Offer created/updated successfully' });
  } catch (error) {
    console.error('Error creating/updating offer:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Failed to create/update offer' });
  }
});

// API endpoint to retrieve offers
app.get('/api/offers', async (req, res) => {
  try {
    console.log('Fetching offers...');
    const accessToken = await getAccessToken();
    console.log('Access token obtained');
    
    const soapUrl = `https://${SUBDOMAIN}.soap.marketingcloudapis.com/Service.asmx`;
    console.log('SOAP URL:', soapUrl);

    const dataExtensionName = 'Offer';
    console.log('Data Extension Name:', dataExtensionName);

    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Header>
          <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </soapenv:Header>
        <soapenv:Body>
          <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
              <ObjectType>DataExtensionObject[${dataExtensionName}]</ObjectType>
              <Properties>name</Properties>
              <Properties>clientName</Properties>
              <Properties>ctaText</Properties>
              <Properties>startDate</Properties>
              <Properties>endDate</Properties>
              <Properties>redirectUrl</Properties>
              <Properties>backgroundImageUrl</Properties>
              <Properties>clientLogoUrl</Properties>
              <Properties>textLine1</Properties>
              <Properties>textLine2</Properties>
              <Properties>textLine3</Properties>
            </RetrieveRequest>
          </RetrieveRequestMsg>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    console.log('Sending SOAP request...');
    const response = await axios.post(soapUrl, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'Retrieve'
      }
    });

    console.log('SOAP response received');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Parse the XML response
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    const result = await parser.parseStringPromise(response.data);

    console.log('Parsed SOAP Response:', JSON.stringify(result, null, 2));

    // Extract the offers from the parsed result
    const offers = result['soap:Envelope']['soap:Body']['RetrieveResponseMsg']['Results'];

    console.log('Extracted Offers:', JSON.stringify(offers, null, 2));

    // Transform the offers to match the expected format in the frontend
    const transformedOffers = Array.isArray(offers) ? offers.map(offer => ({
      id: offer.Properties.Property.find(prop => prop.Name === 'CustomerKey').Value,
      name: offer.Properties.Property.find(prop => prop.Name === 'name').Value,
      clientName: offer.Properties.Property.find(prop => prop.Name === 'clientName').Value,
      startDate: offer.Properties.Property.find(prop => prop.Name === 'startDate').Value,
      endDate: offer.Properties.Property.find(prop => prop.Name === 'endDate').Value,
      status: new Date(offer.Properties.Property.find(prop => prop.Name === 'endDate').Value) >= new Date() ? 'Active' : 'Completed'
    })) : [];

    console.log('Transformed Offers:', JSON.stringify(transformedOffers, null, 2));

    res.json(transformedOffers);
  } catch (error) {
    console.error('Error retrieving offers:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    res.status(500).json({ success: false, message: 'Failed to retrieve offers', error: error.message });
  }
});

// API endpoint to delete an offer
app.delete('/api/offers/:id', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const endpoint = `https://${SUBDOMAIN}.rest.marketingcloudapis.com/data/v1/customobjectdata/key/Offer/rowset`;
    
    await axios.delete(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        keys: [{ id: req.params.id }]
      }
    });

    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ success: false, message: 'Failed to delete offer' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/test-soap', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const soapUrl = `https://${SUBDOMAIN}.soap.marketingcloudapis.com/Service.asmx`;

    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Header>
          <fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth>
        </soapenv:Header>
        <soapenv:Body>
          <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <RetrieveRequest>
              <ObjectType>DataExtension</ObjectType>
              <Properties>CustomerKey</Properties>
              <Properties>Name</Properties>
            </RetrieveRequest>
          </RetrieveRequestMsg>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const response = await axios.post(soapUrl, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'Retrieve'
      }
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error testing SOAP:', error);
    res.status(500).json({ success: false, message: 'SOAP test failed', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
