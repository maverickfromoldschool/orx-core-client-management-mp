import React from 'react';
import {Card, CardContent, Typography, Box, Chip} from '@mui/material';

export interface SectionCardProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * SectionCard component provides a consistent card layout for sections
 */
export const SectionCard: React.FC<SectionCardProps> = ({title, count, children, action}) => (
  <Card
    sx={{
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: 2,
      mb: 3
    }}
  >
    <Box
      sx={{
        p: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
        <Typography variant="h6" sx={{fontWeight: 600, color: '#002677'}}>
          {title}
        </Typography>
        {count !== undefined && (
          <Chip
            label={count}
            size="small"
            sx={{
              bgcolor: '#E8F0FE',
              color: '#002677',
              fontWeight: 600,
              height: 24,
              minWidth: 32
            }}
          />
        )}
      </Box>
      {action}
    </Box>
    <CardContent sx={{p: 3}}>{children}</CardContent>
  </Card>
);
