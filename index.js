const express = require('express');
const { resolve } = require('path');
const cors = require('cors'); // Import cors

const app = express();

// Sử dụng middleware cors để cho phép tất cả các nguồn (origins) truy cập
app.use(cors()); // Nếu bạn muốn cho phép tất cả các nguồn, bạn chỉ cần gọi cors() mà không cần thêm cấu hình.

app.use(express.json());
app.get('/proxy', async (req, res) => {
  const orderId = req.query.orderId;
  const token = req.headers['x-auth-token'];
  const storeHash = req.query.storeHash;
  if (!orderId || !token) {
    return res.status(400).json({
      error: 'Missing orderId or X-Auth-Token in the request',
    });
  }

  try {
    const response = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}/shipments`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Auth-Token': token,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch data from BigCommerce API. Status: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data from BigCommerce API' });
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
