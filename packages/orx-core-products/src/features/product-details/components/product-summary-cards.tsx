/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Box, Typography, Button} from '@mui/material';

import {ProductSummaryCardsProps} from '../types';

/**
 * ProductSummaryCards component
 * Displays summary cards for product information, relationships, variants, and price list entries
 */
export const ProductSummaryCards: React.FC<ProductSummaryCardsProps> = ({productDetails, onViewDetails}) => {
  const handleViewDetails = (type: 'information' | 'relationship' | 'variant' | 'priceList') => {
    onViewDetails?.(type);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '1220px'
      }}
    >
      {/* First Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px'
        }}
      >
        {/* Product Information Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            padding: '24px',
            width: '598px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBCCCD',
            borderRadius: '10px'
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '76px',
              height: '76px',
              backgroundColor: '#ECFAFC',
              borderRadius: '7px'
            }}
          >
            <Box
              component="svg"
              sx={{width: '32px', height: '39px'}}
              viewBox="0 0 32 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.4375 31.1877V2.9373C2.4375 2.6613 2.6613 2.4375 2.9373 2.4375H22.6564C22.9324 2.4375 23.1562 2.6613 23.1562 2.9373V31.1877C23.1562 31.4637 22.9324 31.6875 22.6564 31.6875H2.9373C2.6612 31.6875 2.4375 31.4637 2.4375 31.1877Z"
                fill="white"
              />
              <path
                d="M28.7501 36.5625H9.03105C8.75505 36.5625 8.53125 36.3387 8.53125 36.0627V34.125H25.0939C25.3699 34.125 25.5938 33.9012 25.5938 33.6252V7.3125H28.7501C29.0261 7.3125 29.25 7.5363 29.25 7.8123V36.0627C29.25 36.3387 29.0262 36.5625 28.7501 36.5625Z"
                fill="white"
              />
              <path
                d="M25.5937 4.875V0.4998C25.5937 0.2238 25.3699 0 25.0939 0H0.499801C0.223801 0 0 0.2238 0 0.4998V33.6252C0 33.9012 0.223801 34.125 0.499801 34.125H6.0937V38.5002C6.0937 38.7762 6.3175 39 6.5935 39H31.1876C31.4636 39 31.6874 38.7762 31.6874 38.5002V5.3748C31.6874 5.0988 31.4636 4.875 31.1876 4.875H25.5937ZM2.4375 31.1877V2.9373C2.4375 2.6613 2.6613 2.4375 2.9373 2.4375H22.6564C22.9324 2.4375 23.1562 2.6613 23.1562 2.9373V31.1877C23.1562 31.4637 22.9324 31.6875 22.6564 31.6875H2.9373C2.6612 31.6875 2.4375 31.4637 2.4375 31.1877ZM28.7501 36.5625H9.031C8.755 36.5625 8.5312 36.3387 8.5312 36.0627V34.125H25.0939C25.3699 34.125 25.5937 33.9012 25.5937 33.6252V7.3125H28.7501C29.0261 7.3125 29.2499 7.5363 29.2499 7.8123V36.0627C29.2499 36.3387 29.0262 36.5625 28.7501 36.5625Z"
                fill="#FF612B"
              />
              <path
                d="M6.0937 18.2812H19.5265C20.1996 18.2812 20.7452 17.7355 20.7452 17.0625C20.7452 16.3894 20.1995 15.8438 19.5265 15.8438H6.0937C5.4206 15.8438 4.875 16.3895 4.875 17.0625C4.8749 17.7356 5.4206 18.2812 6.0937 18.2812Z"
                fill="#002677"
              />
              <path
                d="M6.19209 25.5938H19.6249C20.298 25.5938 20.8436 25.0481 20.8436 24.3751C20.8436 23.702 20.2979 23.1564 19.6249 23.1564H6.19209C5.51899 23.1564 4.97339 23.7021 4.97339 24.3751C4.97339 25.0481 5.51899 25.5938 6.19209 25.5938Z"
                fill="#002677"
              />
              <path
                d="M6.0937 10.9688H19.5265C20.1996 10.9688 20.7452 10.4231 20.7452 9.75007C20.7452 9.07697 20.1995 8.53137 19.5265 8.53137H6.0937C5.4206 8.53137 4.875 9.07707 4.875 9.75007C4.8749 10.4231 5.4206 10.9688 6.0937 10.9688Z"
                fill="#002677"
              />
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F'
                }}
              >
                Product Information
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '32px',
                    lineHeight: '38.4px',
                    color: '#000000'
                  }}
                >
                  {productDetails?.productAttributes?.length ?? 0}
                </Typography>
                <Box
                  sx={{
                    width: '0px',
                    height: '23px',
                    borderLeft: '1px solid #CBCCCD'
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '14.4px',
                    color: '#4B4D4F'
                  }}
                >
                  {productDetails?.productAttributes?.length ?? 0} Attributes
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={() => {
                handleViewDetails('information');
              }}
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#0C55B8',
                textDecoration: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                minWidth: 'auto',
                padding: 0,
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>

        {/* Product Relationship Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            padding: '24px',
            flex: 1,
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBCCCD',
            borderRadius: '10px'
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '76px',
              height: '76px',
              backgroundColor: '#ECFAFC',
              borderRadius: '7px'
            }}
          >
            <Box
              component="svg"
              sx={{width: '48px', height: '48px'}}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M37.4124 24H10.4331"
                stroke="#002677"
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M37.4128 9.38477C29.7128 9.38477 23.4707 15.6269 23.4707 23.3269V24.673C23.4707 32.373 29.7128 38.6151 37.4128 38.6151"
                stroke="#002677"
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M38.4659 14.549C41.2409 14.549 43.4904 12.2995 43.4904 9.5245C43.4904 6.74955 41.2409 4.5 38.4659 4.5C35.6909 4.5 33.4414 6.74955 33.4414 9.5245C33.4414 12.2995 35.6909 14.549 38.4659 14.549Z"
                fill="#FF612B"
              />
              <path
                d="M38.4659 29.0245C41.2409 29.0245 43.4904 26.7749 43.4904 24C43.4904 21.225 41.2409 18.9755 38.4659 18.9755C35.6909 18.9755 33.4414 21.225 33.4414 24C33.4414 26.7749 35.6909 29.0245 38.4659 29.0245Z"
                fill="#FF612B"
              />
              <path
                d="M38.4659 43.5C41.2409 43.5 43.4904 41.2505 43.4904 38.4755C43.4904 35.7006 41.2409 33.451 38.4659 33.451C35.6909 33.451 33.4414 35.7006 33.4414 38.4755C33.4414 41.2505 35.6909 43.5 38.4659 43.5Z"
                fill="#FF612B"
              />
              <path
                d="M9.52792 29.0245C12.3029 29.0245 14.5524 26.7749 14.5524 24C14.5524 21.225 12.3029 18.9755 9.52792 18.9755C6.75296 18.9755 4.50342 21.225 4.50342 24C4.50342 26.7749 6.75296 29.0245 9.52792 29.0245Z"
                fill="#FF612B"
              />
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              flex: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F'
                }}
              >
                Product Relationship(s)
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '38.4px',
                  color: '#000000'
                }}
              >
                0
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleViewDetails('relationship');
              }}
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#0C55B8',
                textDecoration: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                minWidth: 'auto',
                padding: 0,
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Second Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px'
        }}
      >
        {/* Product Variant Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            padding: '24px',
            flex: 1,
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBCCCD',
            borderRadius: '10px'
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '76px',
              height: '76px',
              backgroundColor: '#ECFAFC',
              borderRadius: '7px'
            }}
          >
            <Box
              component="svg"
              sx={{width: '38.99px', height: '34.69px'}}
              viewBox="0 0 39 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.0799 2C35.6799 2 36.9899 3.3 36.9899 4.91C36.9899 6.52 35.6899 7.82 34.0799 7.82C32.4699 7.82 31.1699 6.52 31.1699 4.91C31.1699 3.3 32.4799 2 34.0799 2ZM34.0799 0C31.3699 0 29.1699 2.2 29.1699 4.91C29.1699 7.62 31.3699 9.82 34.0799 9.82C36.7899 9.82 38.9899 7.62 38.9899 4.91C38.9899 2.2 36.7899 0 34.0799 0Z"
                fill="#FF612B"
              />
              <path
                d="M34.0799 26.86C35.6799 26.86 36.9899 28.16 36.9899 29.77C36.9899 31.38 35.6899 32.68 34.0799 32.68C32.4699 32.68 31.1699 31.38 31.1699 29.77C31.1699 28.16 32.4799 26.86 34.0799 26.86ZM34.0799 24.86C31.3699 24.86 29.1699 27.06 29.1699 29.77C29.1699 32.48 31.3699 34.68 34.0799 34.68C36.7899 34.68 38.9899 32.48 38.9899 29.77C38.9899 27.06 36.7899 24.86 34.0799 24.86Z"
                fill="#FF612B"
              />
              <path
                d="M34.0798 21.61C33.3898 21.61 32.8298 21.05 32.8298 20.36V13.59C32.8298 12.9 33.3898 12.34 34.0798 12.34C34.7698 12.34 35.3298 12.9 35.3298 13.59V20.36C35.3298 21.05 34.7698 21.61 34.0798 21.61Z"
                fill="#002677"
              />
              <path
                d="M14.63 2C16.23 2 17.54 3.3 17.54 4.91C17.54 6.52 16.24 7.82 14.63 7.82C13.02 7.82 11.72 6.52 11.72 4.91C11.72 3.3 13.03 2 14.63 2ZM14.63 0C11.92 0 9.71997 2.2 9.71997 4.91C9.71997 7.62 11.92 9.82 14.63 9.82C17.34 9.82 19.54 7.62 19.54 4.91C19.54 2.2 17.34 0 14.63 0Z"
                fill="#FF612B"
              />
              <path
                d="M14.63 26.86C16.23 26.86 17.54 28.16 17.54 29.77C17.54 31.38 16.24 32.68 14.63 32.68C13.02 32.68 11.72 31.38 11.72 29.77C11.72 28.16 13.03 26.86 14.63 26.86ZM14.63 24.86C11.92 24.86 9.71997 27.06 9.71997 29.77C9.71997 32.48 11.92 34.68 14.63 34.68C17.34 34.68 19.54 32.48 19.54 29.77C19.54 27.06 17.34 24.86 14.63 24.86Z"
                fill="#FF612B"
              />
              <path
                d="M14.6299 21.61C13.9399 21.61 13.3799 21.05 13.3799 20.36V13.59C13.3799 12.9 13.9399 12.34 14.6299 12.34C15.3199 12.34 15.8799 12.9 15.8799 13.59V20.36C15.8799 21.05 15.3199 21.61 14.6299 21.61Z"
                fill="#002677"
              />
              <path
                d="M24.3599 9.83006C23.6699 9.83006 23.1099 9.27006 23.1099 8.58006V1.81006C23.1099 1.12006 23.6699 0.560059 24.3599 0.560059C25.0499 0.560059 25.6099 1.12006 25.6099 1.81006V8.58006C25.6099 9.27006 25.0499 9.83006 24.3599 9.83006Z"
                fill="#002677"
              />
              <path
                d="M24.3599 34.69C23.6699 34.69 23.1099 34.13 23.1099 33.44V26.67C23.1099 25.98 23.6699 25.42 24.3599 25.42C25.0499 25.42 25.6099 25.98 25.6099 26.67V33.44C25.6099 34.13 25.0499 34.69 24.3599 34.69Z"
                fill="#002677"
              />
              <path
                d="M24.36 14.3601C25.96 14.3601 27.27 15.6601 27.27 17.2701C27.27 18.8801 25.97 20.1801 24.36 20.1801C22.75 20.1801 21.45 18.8801 21.45 17.2701C21.45 15.6601 22.76 14.3601 24.36 14.3601ZM24.36 12.3601C21.65 12.3601 19.45 14.5601 19.45 17.2701C19.45 19.9801 21.65 22.1801 24.36 22.1801C27.07 22.1801 29.27 19.9801 29.27 17.2701C29.27 14.5601 27.07 12.3601 24.36 12.3601Z"
                fill="#FF612B"
              />
              <path
                d="M4.90991 9.83006C4.21991 9.83006 3.65991 9.27006 3.65991 8.58006V1.81006C3.65991 1.12006 4.21991 0.560059 4.90991 0.560059C5.59991 0.560059 6.15991 1.12006 6.15991 1.81006V8.58006C6.15991 9.27006 5.59991 9.83006 4.90991 9.83006Z"
                fill="#002677"
              />
              <path
                d="M4.90991 34.69C4.21991 34.69 3.65991 34.13 3.65991 33.44V26.67C3.65991 25.98 4.21991 25.42 4.90991 25.42C5.59991 25.42 6.15991 25.98 6.15991 26.67V33.44C6.15991 34.13 5.59991 34.69 4.90991 34.69Z"
                fill="#002677"
              />
              <path
                d="M4.91 14.3601C6.51 14.3601 7.82 15.6601 7.82 17.2701C7.82 18.8801 6.52 20.1801 4.91 20.1801C3.3 20.1801 2 18.8801 2 17.2701C2 15.6601 3.31 14.3601 4.91 14.3601ZM4.91 12.3601C2.2 12.3601 0 14.5601 0 17.2701C0 19.9801 2.2 22.1801 4.91 22.1801C7.62 22.1801 9.82 19.9801 9.82 17.2701C9.82 14.5601 7.62 12.3601 4.91 12.3601Z"
                fill="#FF612B"
              />
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F'
                }}
              >
                Product Variant(s)
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '38.4px',
                  color: '#000000'
                }}
              >
                {productDetails?.productVariants?.length ?? 0}
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleViewDetails('variant');
              }}
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#0C55B8',
                textDecoration: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                minWidth: 'auto',
                padding: 0,
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>

        {/* Price List Entry Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            padding: '24px',
            flex: 1,
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBCCCD',
            borderRadius: '10px'
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '76px',
              height: '76px',
              backgroundColor: '#ECFAFC',
              borderRadius: '7px'
            }}
          >
            <Box
              component="svg"
              sx={{width: '48px', height: '48px'}}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M43 21.8889H39.8079C38.0277 18.1481 34.2242 15.5556 29.8055 15.5556H18.38C17.9976 13.1651 15.9427 11.3334 13.4445 11.3334V16.6364C10.8019 17.894 8.7409 20.1608 7.7554 22.9445H6.3128C5.5878 22.9444 5 23.532 5 24.2572V26.8646C5 27.6372 5.4699 28.3325 6.1868 28.6206L7.3965 29.1066C8.3291 33.2015 11.525 36.4259 15.6022 37.4047L16.9666 40.8889H20.8334V37.7222H29.8056C29.9838 37.7222 30.1572 37.7036 30.3334 37.6954V40.8889H33.8137L35.7304 35.9946C38.8275 34.0288 40.889 30.5787 40.889 26.6389C40.889 26.0359 40.8277 25.4488 40.7351 24.8721L43 21.8889ZM13.0292 23.5269C13.0292 23.0136 13.4451 22.5976 13.9582 22.5976C14.4713 22.5976 14.8872 23.0135 14.8872 23.5269C14.8872 24.0397 14.4713 24.4557 13.9582 24.4557C13.4451 24.4556 13.0292 24.0397 13.0292 23.5269Z"
                fill="#002677"
              />
              <path
                d="M31.3994 16.925C32.0583 15.9261 32.4444 14.7309 32.4444 13.4444C32.4444 9.94678 29.6089 7.11108 26.1111 7.11108C22.6133 7.11108 19.7778 9.94688 19.7778 13.4444C19.7778 14.7309 20.1638 15.9261 20.8228 16.925H31.3994Z"
                fill="#FF612B"
              />
              <path
                d="M13.0293 23.527C13.0293 23.0137 13.4452 22.5977 13.9583 22.5977C14.4714 22.5977 14.8873 23.0136 14.8873 23.527C14.8873 24.0398 14.4714 24.4558 13.9583 24.4558C13.4452 24.4557 13.0293 24.0398 13.0293 23.527Z"
                fill="white"
              />
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F'
                }}
              >
                Price List Entry(s)
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '38.4px',
                  color: '#000000'
                }}
              >
                0
              </Typography>
            </Box>
            <Button
              onClick={() => {
                handleViewDetails('priceList');
              }}
              sx={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#0C55B8',
                textDecoration: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                minWidth: 'auto',
                padding: 0,
                textTransform: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
