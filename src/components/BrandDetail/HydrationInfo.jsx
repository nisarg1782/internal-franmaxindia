// src/pages/HydrationInfo.jsx
import React from 'react';
import '../design/HydrationInfo.css';

const sections = [
  {
    title: "Take the guesswork out of how much you should drink",
    text: "Our app calculates a personalized goal for you each day for optimal hydration. There is no one size fits all goal because everyone is different. That’s why your unique information like height, weight, activity level, and more, are all taken into account within our hydration equation. This goal will change from day to day based on the weather, elevation, and activity levels if you enable location services or sync to fitness tracking apps.",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/a21e1cb3-a611-496f-a4b5-e007df3da073.__CR0,0,800,600_PT0_SX800_V1___.png"
  },
  {
    title: "Smart Syncing with Fitness Apps",
    text: "Sync effortlessly with fitness tracking apps like Apple Health, Google Fit, Fitbit, and more. Automatically update your hydration goals based on your workouts and activities.",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/c53cd3a9-23b6-4830-8f47-068eb033c23d.__CR0,0,800,600_PT0_SX800_V1___.png"
  },
  {
    title: "Stay on Track with Reminders",
    text: "Receive smart reminders throughout the day to keep your hydration in check. Our subtle alerts keep you consistent without being annoying.",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f36feda9-9feb-414c-903f-43655ae59bdd.__CR0,0,800,600_PT0_SX800_V1___.png"
  },
  {
    title: "Your Personalized Water Log",
    text: "View detailed insights on your daily, weekly, and monthly water intake. See trends, patterns, and personalized recommendations to improve your hydration habits.",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/9c38be38-22ab-4d73-b403-e3c0cc1d23f4.__CR0,0,800,600_PT0_SX800_V1___.png"
  },
  {
    title: "Take Control of Your Health Today",
    text: "Start your hydration journey now with our smart tracking and powerful insights. Stay healthier, energized, and more productive every day.",
    image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/155fa856-63ae-4870-9f1e-ca2ae8fb1c44.__CR0,0,800,600_PT0_SX800_V1___.png"
  }
];

const HydrationInfo = () => {
  return (
    <div className="hydration-page">
      {sections.map((section, index) => (
        <div className={`hydration-container ${index % 2 !== 0 ? 'reverse' : ''}`} key={index}>
          <div className="hydration-text">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </div>
          <div className="hydration-image">
            <img src={section.image} alt={section.title} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HydrationInfo;
