// src/components/YoutubeSection.jsx
import React, { useState, useEffect } from 'react';
import YoutubeModal from './YoutubeModal';
import './design/YoutubeSection.css';

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
  { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE' },
  { id: '3JZ_D3ELwOQ', title: 'Charlie Puth - Attention' },
  { id: 'RgKAFK5djSk', title: 'Wiz Khalifa - See You Again' },
  { id: 'kXYiU_JCYtU', title: 'Numb - Linkin Park' },
];

const YoutubeSection = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % videos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleVideos = [
    videos[startIndex % videos.length],
    videos[(startIndex + 1) % videos.length],
    videos[(startIndex + 2) % videos.length],
  ];

  return (
    <div className="youtube-section">
      <h2 className="youtube-section-title">Featured Videos</h2>
      <div className="video-cards">
        {visibleVideos.map((video, index) => (
          <div key={index} className="video-card">
            <img
              src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
              alt={video.title}
              className="thumbnail"
            />
            <h4>{video.title}</h4>
            <button onClick={() => setSelectedVideo(video)}>Know More</button>
          </div>
        ))}
      </div>
      {selectedVideo && (
        <YoutubeModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default YoutubeSection;
