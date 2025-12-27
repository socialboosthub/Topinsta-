const axios = require('axios');

module.exports = async (req, res) => {
    // Allows your website to talk to this backend
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url, id, hd, index } = req.query;
    const path = req.url.split('?')[0];

    // --- ROUTE: DATA FETCHING ---
    if (path === '/api') {
        // This is where you'd put your Scraper API logic
        return res.json({
            data: {
                id: "ig_" + Date.now(),
                title: "Instagram Post",
                cover: "https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=500",
                play: "https://www.w3schools.com/html/mov_bbb.mp4",
                hdplay: "https://www.w3schools.com/html/mov_bbb.mp4",
                author: { unique_id: "insta_user", avatar: "https://cdn-icons-png.flaticon.com/512/87/87390.png" },
                images: ["https://images.unsplash.com/photo-1611267254323-4db7b39c732c?w=500"]
            }
        });
    }

    // --- ROUTE: PROXY DOWNLOADER ---
    // This forces the file to download as "InstaSaver.mp4" instead of opening in the browser
    if (path === '/download' || path === '/image' || path === '/mp3') {
        try {
            const response = await axios({ url: url, method: 'GET', responseType: 'arraybuffer' });
            const ext = path === '/mp3' ? 'mp3' : (path === '/image' ? 'jpg' : 'mp4');
            
            res.setHeader('Content-Disposition', `attachment; filename="InstaSaver-${id || 'video'}.${ext}"`);
            res.setHeader('Content-Type', response.headers['content-type']);
            return res.send(response.data);
        } catch (e) {
            return res.status(500).send("Download Error");
        }
    }
};
