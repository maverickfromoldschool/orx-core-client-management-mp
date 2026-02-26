import React from 'react';
import {Box, Tab, Tabs} from '@mui/material';

import {COLORS, TAB_LABELS} from '../constants';
import {TabValue} from '../types';

interface ProductViewTabsProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

/**
 * ProductViewTabs component
 * Tab navigation for Product Information and Transaction Fields
 */
export const ProductViewTabs: React.FC<ProductViewTabsProps> = ({activeTab, onTabChange}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        padding: '16px 0px 0px',
        width: '100%'
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        sx={{
          minHeight: '56px',
          '& .MuiTabs-indicator': {
            height: '3px',
            backgroundColor: COLORS.PRIMARY_ORANGE
          },
          '& .MuiTabs-flexContainer': {
            gap: 0
          }
        }}
      >
        <Tab
          value="product-information"
          label={TAB_LABELS.PRODUCT_INFORMATION}
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '1.33em',
            textTransform: 'none',
            padding: '0px 16px',
            minHeight: '56px',
            color: activeTab === 'product-information' ? COLORS.TEXT_HEADINGS : COLORS.TEXT_LINK,
            '&.Mui-selected': {
              color: COLORS.TEXT_HEADINGS
            }
          }}
        />
        <Tab
          value="transaction-fields"
          label={TAB_LABELS.TRANSACTION_FIELDS}
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '1.33em',
            textTransform: 'none',
            padding: '0px 16px',
            minHeight: '56px',
            color: activeTab === 'transaction-fields' ? COLORS.TEXT_HEADINGS : COLORS.TEXT_LINK,
            '&.Mui-selected': {
              color: COLORS.TEXT_HEADINGS
            }
          }}
        />
      </Tabs>
    </Box>
  );
};
