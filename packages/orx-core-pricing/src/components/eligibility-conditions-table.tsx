import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import type {EligibilityCondition} from '../services';

export interface EligibilityConditionsTableProps {
  conditions: EligibilityCondition[];
  onView?: (condition: EligibilityCondition, index: number) => void;
}

/**
 * Empty state component for eligibility conditions
 */
const EmptyState: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2
    }}
  >
    <Typography variant="h6" sx={{color: 'text.secondary', mb: 1}}>
      No Eligibility Conditions
    </Typography>
    <Typography variant="body2" sx={{color: 'text.secondary'}}>
      There are no eligibility conditions defined for this price list.
    </Typography>
  </Box>
);

/**
 * EligibilityConditionsTable component displays eligibility conditions in a table format
 */
export const EligibilityConditionsTable: React.FC<EligibilityConditionsTableProps> = ({conditions, onView}) => {
  if (conditions.length === 0) {
    return <EmptyState />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{bgcolor: 'grey.50'}}>
            <TableCell sx={{fontWeight: 600, color: 'text.primary', width: 60}}>Seq No</TableCell>
            <TableCell sx={{fontWeight: 600, color: 'text.primary', minWidth: 200}}>Condition Description</TableCell>
            <TableCell sx={{fontWeight: 600, color: 'text.primary', minWidth: 150}}>If Condition True</TableCell>
            <TableCell sx={{fontWeight: 600, color: 'text.primary', minWidth: 150}}>If Condition False</TableCell>
            <TableCell sx={{fontWeight: 600, color: 'text.primary', minWidth: 120}}>Condition Type</TableCell>
            {onView && (
              <TableCell sx={{fontWeight: 600, color: 'text.primary', width: 100, textAlign: 'center'}}>
                Action
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {conditions.map((condition, index) => (
            <TableRow
              // eslint-disable-next-line react/no-array-index-key
              key={`condition-${index}`}
              sx={{
                '&:hover': {bgcolor: 'grey.50'},
                '&:last-child td': {borderBottom: 0}
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{condition.conditionDescription}</TableCell>
              <TableCell>{condition.ifConditionTrue}</TableCell>
              <TableCell>{condition.ifConditionFalse}</TableCell>
              <TableCell>{condition.conditionType}</TableCell>
              {onView && (
                <TableCell sx={{textAlign: 'center'}}>
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() => {
                        onView(condition, index);
                      }}
                      sx={{color: '#0C55B8'}}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
