const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // Assumes your HTML files are in a 'public' folder

// --- MOCK API HANDLER ---
// In a production environment, you would use a library like 'instagram-url-direct' here.
// For this demo, we return mock data so the UI functions perfectly.
app.get('/api', async (req, res) => {
    const url = req.query.url;
    
    // Simulate processing delay (aesthetic)
    setTimeout(() => {
        // Mock Response Structure matching your frontend logic
        res.json({
            data: {
                id: "insta_" + Date.now(),
                title: "Instagram Post Caption #Hashtag",
                cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Placeholder IG image
                origin_cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                play: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder Video
                hdplay: "https://www.w3schools.com/html/mov_bbb.mp4",
                music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder Audio
                music_info: {
                    title: "Trending Audio",
                    cover: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"
                },
                author: {
                    unique_id: "instagram_user",
                    avatar: "https://cdn-icons-png.flaticon.com/512/87/87390.png"
                },
                // For Carousel/Slider logic
                images: [
                    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                ]
            }
        });
    }, 1500);
});

// --- FILE DOWNLOAD PROXY ---
// This forces the browser to download files instead of playing them
app.get('/download', async (req, res) => {
    const fileUrl = req.query.url;
    const id = req.query.id || Date.now();
    const isHd = req.query.hd;
    
    const filename = `InstaSaver-${id}${isHd ? '-HD' : ''}.mp4`;

    try {
        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Error downloading file");
    }
});

// --- MP3 DOWNLOAD PROXY ---
app.get('/mp3', async (req, res) => {
    const fileUrl = req.query.url;
    const id = req.query.id || Date.now();
    const filename = `InstaSaver-Audio-${id}.mp3`;

    try {
        const response = await axios({ url: fileUrl, method: 'GET', responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.data.pipe(res);
    } catch (error) { res.status(500).send("Error"); }
});

// --- IMAGE DOWNLOAD PROXY ---
app.get('/image', async (req, res) => {
    const fileUrl = req.query.url;
    const id = req.query.id || Date.now();
    const index = req.query.index || 1;
    const filename = `InstaSaver-${id}-img-${index}.jpg`;

    try {
        const response = await axios({ url: fileUrl, method: 'GET', responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        response.data.pipe(res);
    } catch (error) { res.status(500).send("Error"); }
});

app.listen(PORT, () => console.log(`InstaSaver running at http://localhost:${PORT}`));
