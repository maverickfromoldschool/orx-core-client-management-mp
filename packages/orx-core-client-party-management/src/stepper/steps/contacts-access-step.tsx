import React, {useState} from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  Button,
  Switch
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import {Controller} from 'react-hook-form';
import type {Control, FieldErrors, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId} from 'react-hook-form';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {FormTextField} from '../../components/form-text-field';
import {FormSelectField} from '../../components/form-select-field';
import type {AddClientCombinedFormData} from '../schemas';
import {CONTACT_TYPE_OPTIONS, STATUS_OPTIONS} from '../../data/lookup';

interface ContactsAccessStepProps {
  control: Control<AddClientCombinedFormData>;
  errors: FieldErrors<AddClientCombinedFormData>;
  contactFields: FieldArrayWithId<AddClientCombinedFormData, 'contacts'>[];
  appendContact: UseFieldArrayAppend<AddClientCombinedFormData, 'contacts'>;
  removeContact: UseFieldArrayRemove;
}

export const ContactsAccessStep: React.FC<ContactsAccessStepProps> = ({
  control,
  errors,
  contactFields,
  appendContact,
  removeContact
}) => {
  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const handleAddContact = () => {
    appendContact({
      contactType: '',
      firstName: '',
      lastName: '',
      email: '',
      status: '',
      sendEmailNotification: false
    });
  };

  const handleRemoveContact = (index: number) => {
    if (contactFields.length > 1 && index > 0) {
      removeContact(index);
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionChange}
      sx={{
        border: '1px solid #CBCCCD',
        borderRadius: '12px !important',
        boxShadow: 'none',
        '&:before': {
          display: 'none'
        },
        '&.Mui-expanded': {
          margin: 0
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
          padding: '16px 24px',
          '& .MuiAccordionSummary-content': {
            margin: 0,
            flexDirection: 'column',
            gap: '4px'
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: 0
          }
        }}
      >
        <Typography
          sx={{
            fontSize: '23px',
            fontWeight: 700,
            color: '#323334',
            lineHeight: 1.2
          }}
        >
          Contacts & Access
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            color: '#4B4D4F',
            lineHeight: 1.4,
            my: 2
          }}
        >
          Complete the fields below.
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 24px 30px 24px'
        }}
      >
        {contactFields.map((field, index) => (
          <React.Fragment key={field.id}>
            {/* Separator line between contact entries */}
            {index > 0 && (
              <Box sx={{mt: '56px', mb: 3}}>
                {/* Horizontal divider */}
                <Divider
                  sx={{
                    borderColor: '#AAAAAA'
                  }}
                />
                {/* Delete button positioned below the line on the right */}
                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleRemoveContact(index);
                    }}
                    aria-label={`Delete contact ${index + 1}`}
                    disableRipple
                    sx={{
                      padding: 0,
                      color: '#0C55B8',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#002677'
                      }
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Contact Entry Fields */}
            <div>
              {/* Row 1: Contact Type, First Name, Last Name */}
              <Grid container spacing={3} sx={{mb: 3}}>
                <Grid item xs={12} md={4}>
                  <FormSelectField
                    name={`contacts.${index}.contactType`}
                    control={control}
                    label="Contact Type"
                    required
                    options={CONTACT_TYPE_OPTIONS}
                    placeholder="Select contact type"
                    error={errors.contacts?.[index]?.contactType}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`contacts.${index}.firstName`}
                    control={control}
                    label="First Name"
                    required
                    placeholder="Enter first name"
                    error={errors.contacts?.[index]?.firstName}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`contacts.${index}.lastName`}
                    control={control}
                    label="Last Name"
                    required
                    placeholder="Enter last name"
                    error={errors.contacts?.[index]?.lastName}
                  />
                </Grid>
              </Grid>

              {/* Row 2: Email, Status, Send email Notification */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormTextField
                    name={`contacts.${index}.email`}
                    control={control}
                    label="Email"
                    required
                    placeholder="Enter email"
                    error={errors.contacts?.[index]?.email}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormSelectField
                    name={`contacts.${index}.status`}
                    control={control}
                    label="Status"
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                    error={errors.contacts?.[index]?.status}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{display: 'flex', alignItems: 'center', height: '100%', mt: 1.5}}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#323334',
                        mr: 1.5
                      }}
                    >
                      Send email Notification
                    </Typography>
                    <Controller
                      name={`contacts.${index}.sendEmailNotification`}
                      control={control}
                      render={({field: switchField}) => (
                        <>
                          <Switch
                            checked={switchField.value}
                            onChange={(e) => {
                              switchField.onChange(e.target.checked);
                            }}
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
                                      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"/></svg>')`,
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'center',
                                      backgroundSize: '12px 12px'
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
                          {switchField.value && (
                            <Typography
                              sx={{
                                fontSize: '16px',
                                fontWeight: 400,
                                color: '#323334',
                                ml: 1.5
                              }}
                            >
                              Yes
                            </Typography>
                          )}
                        </>
                      )}
                    />
                    {errors.contacts?.[index]?.sendEmailNotification && (
                      <Typography
                        sx={{
                          color: '#C40000',
                          fontSize: '12px',
                          mt: 0.5
                        }}
                      >
                        {errors.contacts?.[index]?.sendEmailNotification?.message}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        ))}

        {/* Add another contact button */}
        <Box sx={{mt: 3}}>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddContact}
            sx={{
              color: '#0C55B8',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'none',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(12, 85, 184, 0.08)'
              }
            }}
          >
            Add another contact
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ContactsAccessStep;
