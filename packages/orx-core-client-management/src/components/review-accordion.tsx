import React from 'react';
import {Accordion, AccordionSummary, AccordionDetails, Box, Typography, IconButton} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface ReviewAccordionProps {
  title: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}

export const ReviewAccordion: React.FC<ReviewAccordionProps> = ({
  title,
  subtitle,
  defaultExpanded = false,
  onEdit,
  children
}) => {
  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit();
  };

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        '&:before': {
          display: 'none'
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{
              color: '#002677',
              fontSize: '24px'
            }}
          />
        }
        sx={{
          padding: '30px 24px',
          minHeight: 'auto',
          '& .MuiAccordionSummary-content': {
            margin: 0,
            flexDirection: 'column',
            gap: subtitle ? '4px' : 0
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            alignSelf: 'flex-start',
            marginTop: '4px'
          }
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#000000',
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={handleEditClick}
            size="small"
            aria-label={`Edit ${title}`}
            sx={{
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 38, 119, 0.08)'
              }
            }}
          >
            <EditOutlinedIcon
              sx={{
                width: '24px',
                height: '24px',
                color: '#002677'
              }}
            />
          </IconButton>
        </Box>
        {subtitle && (
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#4B4D4F',
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: subtitle ? '24px 24px 30px 24px' : '10px 24px 30px 24px'
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default ReviewAccordion;
