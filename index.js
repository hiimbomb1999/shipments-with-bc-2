const express = require('express');
const { resolve } = require('path');
const cors = require('cors'); // Import cors
const axios = require('axios');
const cheerio = require('cheerio');
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
		(async () => {
			const searchQuery = 'The Midwest Sea Salt Company Google Maps';
			const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

			try {
				const { data } = await axios.get(searchUrl, {
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
					},
				});

				const $ = cheerio.load(data);

				// Tìm kiếm số sao (average rating) và số lượng đánh giá
				const rating = $('span.BHMmbe').text(); // Rating (e.g., 4.7)
				const reviewCount = $('span.EymY4b span').last().text(); // Total reviews (e.g., 120 reviews)

				console.log('Average Rating:', rating || 'N/A');
				console.log('Review Count:', reviewCount || 'N/A');
			} catch (err) {
				console.error('Error fetching data:', err.message);
			}
		})();
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data from BigCommerce API' });
  }
});

app.listen(3000, () => console.log('Proxy running on port 3000'));
