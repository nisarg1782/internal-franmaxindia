import React, { useState } from 'react';
import '../design/brandDetail.css';

const DEFAULT_IMAGE =
  'data:image/png;base64,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';

const BrandImageGallery = ({ images = [], videoFile }) => {
  const defaultImage = images[0] || DEFAULT_IMAGE;
  const [mainMedia, setMainMedia] = useState({ src: defaultImage, type: 'image' });
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  const handleThumbnailClick = (src, type = 'image') => {
    setMainMedia({ src, type });
  };

  return (
    <>
      <div className="gallery">
        <div className="main-img-wrapper" onClick={() => setShowZoomModal(true)}>
          {mainMedia.type === 'image' ? (
            <img
              className="main-img"
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSCaEI62pvjHAFeLb2-iHnW6ZDJMZqPAR4_7cS75lwKtLSe_b1O7TUpDEGLil5j8utboVByz_3H4gxapwapT5fn9bJMilEuDF6pauBfQUeLUw"
              alt="Main Brand"
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
          ) : (
            <video controls className="main-video">
              <source src={mainMedia.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="thumbnail-row">
          {(images.length ? images : [DEFAULT_IMAGE]).map((img, idx) => (
            <img
              key={idx}
              className="thumb"
              src={img || DEFAULT_IMAGE}
              alt={`Thumbnail ${idx}`}
              onClick={() => handleThumbnailClick(img || DEFAULT_IMAGE, 'image')}
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
          ))}

          {videoFile && (
            <div
              className="thumb video-thumb"
              onClick={() => handleThumbnailClick(videoFile, 'video')}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/play-button-circled--v1.png"
                alt="Play"
              />
              <span>Watch Video</span>
            </div>
          )}
        </div>

        <button className="view-all-btn" onClick={() => setShowAllModal(true)}>
          View All Images
        </button>
      </div>

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="media-modal" onClick={() => setShowZoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowZoomModal(false)}>✖</button>
            {mainMedia.type === 'image' ? (
              <img
                src={mainMedia.src || DEFAULT_IMAGE}
                alt="Zoomed"
                className="zoomed-img"
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
              />
            ) : (
              <video controls autoPlay className="zoomed-video">
                <source src={mainMedia.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {/* All Images Modal */}
      {showAllModal && (
        <div className="media-modal" onClick={() => setShowAllModal(false)}>
          <div className="modal-content all-grid-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAllModal(false)}>✖</button>
            <h3 style={{ marginBottom: '10px' }}>All Media</h3>
            <div className="all-media-grid">
              {(images.length ? images : [DEFAULT_IMAGE]).map((img, idx) => (
                <img
                  key={idx}
                  src={img || DEFAULT_IMAGE}
                  alt={`Grid ${idx}`}
                  className="grid-thumb"
                  onClick={() => {
                    setMainMedia({ src: img || DEFAULT_IMAGE, type: 'image' });
                    setShowAllModal(false);
                  }}
                  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                />
              ))}

              {videoFile && (
                <div
                  className="grid-thumb video-thumb"
                  onClick={() => {
                    setMainMedia({ src: videoFile, type: 'video' });
                    setShowAllModal(false);
                  }}
                >
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/play-button-circled--v1.png"
                    alt="Play Video"
                  />
                  <span>Video</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandImageGallery;
