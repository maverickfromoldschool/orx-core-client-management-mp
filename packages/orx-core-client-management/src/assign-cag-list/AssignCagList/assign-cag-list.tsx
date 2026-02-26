'use client';

import React from 'react';
import {Grid, Typography, Button, Accordion, AccordionSummary, AccordionDetails, Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {useAssignCagList} from '../useAssignCagList/use-assign-cag-list';

import {AssignCagListProps} from './assign-cag-list.types';

export function AssignCagList(props: AssignCagListProps) {
  const {value, onClick} = useAssignCagList(props);
  const {text} = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent accordion from toggling when button is clicked
    onClick();
  };

  return (
    <Grid>
      <Accordion expanded={expanded} onChange={handleAccordionChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="assign-cag-content"
          id="assign-cag-header"
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '12px 0'
            }
          }}
        >
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#002677'
            }}
          >
            {text || 'Assign CAG List'}
          </Typography>
          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              marginRight: 2,
              textTransform: 'none',
              backgroundColor: '#0C55B8',
              '&:hover': {
                backgroundColor: '#094A9F'
              }
            }}
          >
            Add CAG
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{p: 2}}>
            <Typography>{value}</Typography>
            {/* Add your content here */}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}

export default AssignCagList;
