import React from 'react';
import './CrawlerPage.css';
import LeftSidebar from '../components/Crawler/LeftSidebar';
import CenterPipeline from '../components/Crawler/CenterPipeline';
import RightSidebar from '../components/Crawler/RightSidebar';

const CrawlerPage: React.FC = () => {
  return (
    <div className="crawler-layout">
      <LeftSidebar />
      <CenterPipeline />
      <RightSidebar />
    </div>
  );
};

export default CrawlerPage;
