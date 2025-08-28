// src/components/YouTubeBlogSection.jsx
import React from 'react';
import Slider from 'react-slick';

import './design/YouTubeBlogSection.css';

const YouTubeBlogSection = () => {
  const youtubeVideos = [
    {
      id: '1',
      title: 'Franchise Tips 2024',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg'
    },
    {
      id: '2',
      title: 'Expand Your Brand',
      url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/0.jpg'
    },
    {
      id: '3',
      title: 'Franchise Planning',
      url: 'https://www.youtube.com/watch?v=abc123',
      thumbnail: 'https://img.youtube.com/vi/abc123/0.jpg'
    },
    {
      id: '4',
      title: 'Growth Hacks',
      url: 'https://www.youtube.com/watch?v=xyz456',
      thumbnail: 'https://img.youtube.com/vi/xyz456/0.jpg'
    }
  ];

  const blogs = [
    {
      id: '1',
      title: 'Top Franchise Models in India',
      excerpt: 'Explore models for new investors.',
      image: 'https://via.placeholder.com/100x100',
      link: '#'
    },
    {
      id: '2',
      title: 'Brand Expansion 2024',
      excerpt: 'Guide to scale your business.',
      image: 'https://via.placeholder.com/100x100',
      link: '#'
    },
    {
      id: '3',
      title: 'Location Strategy Tips',
      excerpt: 'Choosing right place to grow.',
      image: 'https://via.placeholder.com/100x100',
      link: '#'
    },
    {
      id: '4',
      title: 'Retail Franchising Guide',
      excerpt: 'What to expect in 2025.',
      image: 'https://via.placeholder.com/100x100',
      link: '#'
    }
  ];
  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <div className="ytb-section">
      <h2 className="ytb-heading">Latest News & Updates</h2>
      <p className="ytb-subheading">Stay informed with our recent updates</p>

      <div className="ytb-carousel-block">
        <h3 className="ytb-subtitle">Videos</h3>
        <Slider {...carouselSettings}>
          {youtubeVideos.map(video => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ytb-video-card"
            >
              <img src={video.thumbnail} alt={video.title} />
              <p>{video.title}</p>
            </a>
          ))}
        </Slider>
      </div>

      <div className="ytb-carousel-block">
        <h3 className="ytb-subtitle">Blogs</h3>
        <Slider {...carouselSettings}>
          {blogs.map(blog => (
            <div className="ytb-blog-card" key={blog.id}>
              <img src={blog.image} alt={blog.title} />
              <div className="ytb-blog-content">
                <h4>{blog.title}</h4>
                <p>{blog.excerpt}</p>
                <a href={blog.link} className="ytb-readmore-btn">Read More</a>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default YouTubeBlogSection;
