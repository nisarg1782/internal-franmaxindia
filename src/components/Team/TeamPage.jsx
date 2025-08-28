import React from 'react';
import '../design/TeamPage.css';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import VipulImage from '../../assets/logo/vipul.jpg'
import PriyaImage from '../../assets/logo/priya.jpg'

const team = [
  {
    name: 'Vipul Panchal',
    role: 'Founder & CEO',
    image: VipulImage,
    description: 'Leading the vision of Franmax India with innovation and commitment.',
    linkedin: 'https://www.linkedin.com/in/vipulpanchalfranmaxindia/',
    email: 'cmd@franmaxindia.com',
  },
  {
    name: 'Priya Panchal',
    role: 'Co-Founder & CTO',
    image: PriyaImage,
    description: 'Transforming technology into value for franchising growth.',
    linkedin: 'https://www.linkedin.com/in/priyanka-panchal-3a9b94232/',
    // email: 'cmd@franmax',
  }
];

const TeamSplit = () => {
  return (
    <div className="team-split-section">
      <h2 className="team-split-heading">Our Core Team</h2>
      {team.map((member, idx) => (
        <div className={`team-split-row ${idx % 2 !== 0 ? 'reverse' : ''}`} key={idx}>
          <img src={member.image} alt={member.name} className="team-split-img" />
          <div className="team-split-content">
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="desc">{member.description}</p>
            <div className="social">
              <a href={member.linkedin}><FaLinkedin /></a>
              <a href={`mailto:${member.email}`}><FaEnvelope /></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamSplit;
