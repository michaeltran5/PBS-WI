import React from 'react';
import { Container, TabButton } from '../styled/TabNavigation.styled';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, onTabChange 
}) => {
  return (
    <Container>
      <TabButton isActive={activeTab === 'about'} onClick={() => onTabChange('about')}>About This Episode</TabButton>
      
      <TabButton isActive={activeTab === 'episodes'} onClick={() => onTabChange('episodes')}>More Episodes</TabButton>
      
      <TabButton isActive={activeTab === 'recommended'} onClick={() => onTabChange('recommended')}>You May Also Like</TabButton>
    </Container>
  );
};

export default TabNavigation;