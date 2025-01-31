const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // Ensure one playlist per user
  },
  videos: [{
    videoId: String,
    title: String,
    thumbnail: String,
    channelTitle: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema); 