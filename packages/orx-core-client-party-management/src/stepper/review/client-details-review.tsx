import React from 'react';
import {Box, Grid} from '@mui/material';

import type {AddClientCombinedFormData, ClientDetailsAddressData} from '../schemas';
import {ReadOnlyField} from '../../components/read-only-field';
import {ReadOnlySelectField} from '../../components/read-only-select-field';

interface ClientDetailsReviewProps {
  formData: AddClientCombinedFormData;
}

// Label mappings for dropdown values

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  billing: 'Billing',
  mailing: 'Mailing',
  physical: 'Physical'
};

export const ClientDetailsReview: React.FC<ClientDetailsReviewProps> = ({formData}) => {
  const getAddressTypeLabel = (value: string | undefined) => {
    return value ? ADDRESS_TYPE_LABELS[value] || value : undefined;
  };

  return (
    <div>
      {/* Client Info Fields - Row 1 */}
      <Grid container spacing={3} sx={{mb: 3}}>
        <Grid item xs={12} md={4}>
          <ReadOnlyField
            label="Client ID"
            value={formData.clientDetails.clientReferenceId}
            placeholder=""
            helpTooltip="Unique identifier for the client"
          />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <ReadOnlyField label="Client ID" value={formData.clientDetails.clientId} placeholder="" />
        </Grid> */}
        <Grid item xs={12} md={4}>
          <ReadOnlyField label="Client Name" value={formData.clientDetails.clientName} placeholder="" required />
        </Grid>
      </Grid>

      {/* Addresses Section */}
      {formData.clientDetails.addresses?.map((address: ClientDetailsAddressData, index: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} sx={{mb: 3}}>
          {/* Address Row 1 */}
          <Grid container spacing={3} sx={{mb: 3}}>
            <Grid item xs={12} md={4}>
              <ReadOnlySelectField
                label="Address Type"
                value={getAddressTypeLabel(address.addressType)}
                placeholder=""
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="Address 1" value={address.address1} placeholder="" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="Address 2" value={address.address2} placeholder="" />
            </Grid>
          </Grid>

          {/* Address Row 2 */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="State" value={address.state} placeholder="" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="City" value={address.city} placeholder="" required />
            </Grid>
            <Grid item xs={12} md={4}>
              <ReadOnlyField label="Zip" value={address.zip} placeholder="" required />
            </Grid>
          </Grid>
        </Box>
      ))}
    </div>
  );
};

export default ClientDetailsReview;
