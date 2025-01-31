const router = require('express').Router();
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');

// Debug middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Get user's playlist
router.get('/', auth, async (req, res) => {
  console.log('GET playlist for user:', req.userId);
  try {
    let playlist = await Playlist.findOne({ userId: req.userId });
    if (!playlist) {
      console.log('Creating new playlist for user');
      playlist = new Playlist({
        userId: req.userId,
        videos: []
      });
      await playlist.save();
    }
    res.json(playlist);
  } catch (err) {
    console.error('Error in GET playlist:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to playlist
router.post('/videos', auth, async (req, res) => {
  console.log('POST video to playlist:', req.body);
  try {
    let playlist = await Playlist.findOne({ userId: req.userId });
    if (!playlist) {
      console.log('Creating new playlist for video add');
      playlist = new Playlist({
        userId: req.userId,
        videos: []
      });
    }
    
    const videoExists = playlist.videos.some(v => v.videoId === req.body.videoId);
    if (!videoExists) {
      playlist.videos.push(req.body);
      await playlist.save();
    }
    
    res.json(playlist);
  } catch (err) {
    console.error('Error in POST video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove video from playlist
router.delete('/videos/:videoId', auth, async (req, res) => {
  console.log('DELETE video from playlist:', req.params.videoId);
  try {
    const playlist = await Playlist.findOne({ userId: req.userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.videos = playlist.videos.filter(v => v.videoId !== req.params.videoId);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    console.error('Error in DELETE video:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 