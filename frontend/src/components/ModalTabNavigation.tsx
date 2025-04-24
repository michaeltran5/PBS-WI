import React from 'react';
import { Container, TabButton } from '../styled/ModalTabNavigation.styled';

interface ModalTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModalTabNavigation: React.FC<ModalTabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <Container>
      <TabButton 
        $isActive={activeTab === 'episodes'} 
        onClick={() => onTabChange('episodes')}
      >
        Episodes & Seasons
      </TabButton>
      
      <TabButton 
        $isActive={activeTab === 'recommended'} 
        onClick={() => onTabChange('recommended')}
      >
        More Like This
      </TabButton>
    </Container>
  );
};

export default ModalTabNavigation;