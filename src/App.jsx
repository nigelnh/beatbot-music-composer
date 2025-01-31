import { useState } from 'react'
import { searchVideos } from './services/youtube'
import './App.css'

function App() {
  const [videoUrl, setVideoUrl] = useState('')
  const [videos, setVideos] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const results = await searchVideos(videoUrl, 20)
      if (results && Array.isArray(results)) {
        setVideos(results)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message || 'Failed to fetch videos. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getVideoUrl = (videoId) => `https://www.youtube.com/watch?v=${videoId}`

  const togglePlaylist = (video) => {
    const isInPlaylist = playlist.some(item => item.id.videoId === video.id.videoId)
    
    if (isInPlaylist) {
      setPlaylist(playlist.filter(item => item.id.videoId !== video.id.videoId))
      if (isPlaying && playlist.length <= 1) {
        setIsPlaying(false)
        setCurrentVideoIndex(0)
      }
    } else {
      setPlaylist([...playlist, video])
    }
  }

  const isVideoInPlaylist = (videoId) => {
    return playlist.some(item => item.id.videoId === videoId)
  }

  const togglePlayback = () => {
    if (playlist.length === 0) return
    
    if (!isPlaying) {
      setIsPlaying(true)
      window.open(getVideoUrl(playlist[currentVideoIndex].id.videoId), '_blank')
    } else {
      setIsPlaying(false)
      setCurrentVideoIndex(0)
    }
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <h1>BeatBot - Music Mood Analyzer</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter search keywords"
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <div className="video-list">
          {videos.map((video) => (
            <div key={video.id.videoId} className="video-item-container">
              <a 
                href={getVideoUrl(video.id.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="video-item"
              >
                <div className="video-thumbnail">
                  <img 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}
                  />
                  <div className="play-icon">▶</div>
                </div>
                <div className="video-info">
                  <h3>{video.snippet.title}</h3>
                  <p className="channel-title">{video.snippet.channelTitle}</p>
                </div>
              </a>
              <button 
                className={`playlist-toggle ${isVideoInPlaylist(video.id.videoId) ? 'remove' : 'add'}`}
                onClick={() => togglePlaylist(video)}
              >
                {isVideoInPlaylist(video.id.videoId) ? '−' : '+'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="playlist-sidebar">
        <h2>Playlist ({playlist.length})</h2>
        <div className="playlist-items">
          {playlist.length === 0 ? (
            <p className="playlist-empty">Add some videos to your playlist!</p>
          ) : (
            playlist.map((video, index) => (
              <div key={video.id.videoId} className="playlist-item">
                <a 
                  href={getVideoUrl(video.id.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="playlist-item-link"
                >
                  <img 
                    src={video.snippet.thumbnails.default.url} 
                    alt={video.snippet.title}
                  />
                  <div className="playlist-item-info">
                    <h4>{video.snippet.title}</h4>
                    <p>{video.snippet.channelTitle}</p>
                  </div>
                </a>
                <button 
                  className="playlist-remove"
                  onClick={() => togglePlaylist(video)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        {playlist.length > 0 && (
          <div className="playlist-controls">
            <button 
              className={`playlist-play-button ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlayback}
            >
              {isPlaying ? 'Stop' : 'Play Playlist'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
