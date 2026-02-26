import React from 'react';
import {TableCell, TableRow, Skeleton} from '@mui/material';

const LoadingSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <TableRow key={`loading-skeleton-row-${index}`}>
        <TableCell align="center">
          <Skeleton variant="circular" width="32px" height="32px" sx={{mx: 'auto'}} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="90%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="85%" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="70%" />
        </TableCell>
        <TableCell align="center">
          <Skeleton variant="text" width="30px" sx={{mx: 'auto'}} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width="80px" />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width="60px" height="24px" sx={{borderRadius: '12px'}} />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export default LoadingSkeleton;
