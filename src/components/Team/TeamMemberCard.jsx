import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../design/TeamPage.css';

const TeamMemberCard = ({ member }) => {
  return (
    <div className="team-card">
      <img src={member.image} alt={member.name} className="team-img" />
      <h3>{member.name}</h3>
      <p className="role">{member.role}</p>
      <p className="bio">{member.bio}</p>

      <div className="social-links">
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        )}
        {member.twitter && (
          <a href={member.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        )}
        {member.instagram && (
          <a href={member.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
