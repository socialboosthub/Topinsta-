const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    const { url, id, hd, index } = req.query;
    const path = req.url.split('?')[0];

    // 1. DATA API ROUTE
    if (path.includes('/api')) {
        // Mocking the response for the UI vibe - Replace with your RapidAPI/Scraper URL
        return res.json({
            data: {
                id: "ig_" + Date.now(),
                title: "Instagram Reel Content",
                cover: "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=500",
                play: "https://www.w3schools.com/html/mov_bbb.mp4",
                hdplay: "https://www.w3schools.com/html/mov_bbb.mp4",
                author: { unique_id: "insta_user", avatar: "https://cdn-icons-png.flaticon.com/512/87/87390.png" },
                images: [
                    "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=500",
                    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500"
                ]
            }
        });
    }

    // 2. DOWNLOAD PROXY ROUTE (Forces browser to download)
    if (path.includes('/download') || path.includes('/image')) {
        try {
            const response = await axios({ url: url, method: 'GET', responseType: 'arraybuffer' });
            const filename = `InstaSaver-${id || 'file'}.${path.includes('/image') ? 'jpg' : 'mp4'}`;
            
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', response.headers['content-type']);
            return res.send(response.data);
        } catch (e) {
            return res.status(500).send("Proxy Error");
        }
    }
};
