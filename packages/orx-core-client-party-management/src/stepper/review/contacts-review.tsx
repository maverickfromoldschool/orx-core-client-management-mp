import React from 'react';
import {Box, Grid, Divider, Switch, Typography} from '@mui/material';

import {ReadOnlyField} from '../../components/read-only-field';
import {ReadOnlySelectField} from '../../components/read-only-select-field';
import {CONTACT_TYPE_OPTIONS, STATUS_OPTIONS} from '../../data/lookup';
import type {AddClientCombinedFormData, Contact} from '../schemas';

interface ContactsReviewProps {
  formData: AddClientCombinedFormData;
}

export const ContactsReview: React.FC<ContactsReviewProps> = ({formData}) => {
  const getLabel = (value: string | undefined, options: {value: string; label: string}[]) => {
    return value ? options.find((opt) => opt.value === value)?.label || value : undefined;
  };

  return (
    <div>
      {formData.contacts &&
        formData.contacts.length > 0 &&
        formData.contacts.map((contact: Contact, index: number) => {
          const uniqueKey = `contact-${contact.email}-${contact.firstName}-${contact.lastName}`;
          return (
            <Box key={uniqueKey}>
              {/* Separator between contacts */}
              {index > 0 && <Divider sx={{my: 3, borderColor: '#CBCCCD'}} />}

              {/* Contact Fields - Row 1 */}
              <Grid container spacing={3} sx={{mb: 3}}>
                <Grid item xs={12} md={4}>
                  <ReadOnlySelectField
                    label="Contact Type"
                    value={getLabel(contact.contactType, CONTACT_TYPE_OPTIONS)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="First Name" value={contact.firstName} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Last Name" value={contact.lastName} />
                </Grid>
              </Grid>

              {/* Contact Fields - Row 2 */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <ReadOnlyField label="Email" value={contact.email} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ReadOnlySelectField label="Status" value={getLabel(contact.status, STATUS_OPTIONS)} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{display: 'flex', alignItems: 'center', height: '100%', mt: 1.5}}>
                    <Typography sx={{fontSize: '16px', fontWeight: 700, color: '#323334', mr: 1.5, lineHeight: 1}}>
                      Send email Notification
                    </Typography>
                    <Switch
                      checked={contact.sendEmailNotification}
                      disabled
                      sx={{
                        width: 36,
                        height: 20,
                        padding: 0,
                        '& .MuiSwitch-switchBase': {
                          padding: 0,
                          margin: 0,
                          transitionDuration: '300ms',
                          '&.Mui-checked': {
                            transform: 'translateX(16px)',
                            '& + .MuiSwitch-track': {
                              backgroundColor: '#FFFFFF',
                              opacity: 1,
                              border: '2px solid #0C55B8'
                            },
                            '& .MuiSwitch-thumb': {
                              backgroundColor: '#0C55B8',
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backgroundImage:
                                  'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>\')',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                backgroundSize: '12px 12px',
                                left: 0,
                                top: 0
                              }
                            }
                          }
                        },
                        '& .MuiSwitch-thumb': {
                          boxSizing: 'border-box',
                          width: 20,
                          height: 20,
                          backgroundColor: '#0C55B8',
                          boxShadow: 'none',
                          position: 'relative'
                        },
                        '& .MuiSwitch-track': {
                          borderRadius: '41px',
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #0C55B8',
                          opacity: 1
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          );
        })}
    </div>
  );
};

export default ContactsReview;
