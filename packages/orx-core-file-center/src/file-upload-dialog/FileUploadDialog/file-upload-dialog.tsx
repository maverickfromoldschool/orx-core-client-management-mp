'use client';

import React, {useRef, useState, useEffect} from 'react';
import {Dialog, DialogContent, Button, Box, Typography, Alert, IconButton} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// eslint-disable-next-line import/no-extraneous-dependencies
import CloseIcon from '@mui/icons-material/Close';
// eslint-disable-next-line import/no-extraneous-dependencies
import WarningIcon from '@mui/icons-material/Warning';
// eslint-disable-next-line import/no-extraneous-dependencies
import FlagIcon from '@mui/icons-material/Flag';
// eslint-disable-next-line import/no-extraneous-dependencies
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
// eslint-disable-next-line import/no-extraneous-dependencies
import CancelIcon from '@mui/icons-material/Cancel';

import {useFileUploadDialog} from '../useFileUploadDialog/use-file-upload-dialog';

import {FileUploadDialogProps} from './file-upload-dialog.types';

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  isUploading = false,
  onClearError,
  title = 'Upload Client',
  acceptedTypes = ['XLSX', 'XLS'],
  maxFileSize = 10,
  maxFiles = 1,
  text,
  uploadType = 'client'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const {upload, isUploading: hookUploading, clearError: hookClearError} = useFileUploadDialog({text, uploadType});

  const clearError =
    onClearError ??
    hookClearError ??
    (() => {
      /* no-op */
    });

  // clear internal state when dialog is closed so reopening shows a fresh dialog
  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setDragOver(false);
      // clear any previous error when dialog is closed so reopening shows a fresh dialog
      try {
        clearError();
      } catch {
        // ignore
      }
    }
  }, [open]);

  const effectiveUploading = isUploading || hookUploading;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    // always prevent default so the drop is allowed, but only set visual drag state
    // when there is no file already selected
    event.preventDefault();
    if (selectedFiles.length === 0) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    // prevent default and clear drag state
    event.preventDefault();
    setDragOver(false);
    // if a file is already selected, ignore additional drops
    if (selectedFiles.length > 0) {
      return;
    }
    const {files} = event.dataTransfer;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const result = await upload(selectedFiles);
    try {
      // forward notification to consumer
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment
      onUpload?.(selectedFiles, result);
    } catch {
      // ignore
    }

    if (result.success) {
      // clear selected files and close on success
      setSelectedFiles([]);
      onClose();
    }
  };

  const handleBrowseFiles = () => {
    // reset the input value so selecting the same file again will trigger onChange
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = '';
      } catch {
        // ignore
      }
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
  };

  const handleClose = () => {
    if (!effectiveUploading) {
      setSelectedFiles([]);
      // clear error immediately when user closes dialog
      try {
        clearError();
      } catch {
        // ignore
      }
      onClose();
    }
  };

  const escapeHtml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const handlePreview = () => {
    const file = selectedFiles[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (['csv', 'txt', 'json'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = () => {
        const {result} = reader;
        const content = typeof result === 'string' ? result : JSON.stringify(result);
        const newWindow = window.open();
        if (newWindow?.document?.body) {
          newWindow.document.body.innerHTML = `<pre>${escapeHtml(content)}</pre>`;
          newWindow.document.title = file.name;
        }
      };
      reader.readAsText(file);
      return;
    }

    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  const selectedFile = selectedFiles[0];
  const maxBytes = (maxFileSize || 10) * 1024 * 1024;
  const isTooLarge = !!selectedFile && selectedFile.size > maxBytes;
  const ext = selectedFile ? (selectedFile.name.split('.').pop()?.toLowerCase() ?? '') : '';
  const isInvalidType = !!selectedFile && !(ext === 'xls' || ext === 'xlsx');
  const isUploadDisable = isInvalidType || isTooLarge || isUploading || !selectedFile || effectiveUploading;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{sx: {borderRadius: '12px'}}}>
      <DialogContent sx={{p: 0}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 2}}>
          <Typography sx={{fontSize: '24px', fontWeight: 700, color: '#002677'}}>{text ?? title}</Typography>
          <IconButton onClick={handleClose} disabled={effectiveUploading} aria-label="close" sx={{color: '#6E7072'}}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{px: 3, pb: 3}}>
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{mb: 3, backgroundColor: '#FFF8E1', border: '1px solid #C9730D', borderRadius: '12px'}}
          >
            <Typography sx={{fontWeight: 700, fontSize: '16px', color: '#323334'}}>Important!</Typography>
            <Typography sx={{fontWeight: 400, fontSize: '16px', color: '#4B4D4F'}}>
              If you upload a file that contains records already present in a previously uploaded file, those records
              will be updated with the values from the new file.
            </Typography>
          </Alert>

          <Typography sx={{mb: 3, color: '#4B4D4F'}}>
            Accepted file types: {acceptedTypes.join(', ')}. Maximum file size: {maxFileSize} MB. Maximum number of
            files: {maxFiles}.
          </Typography>

          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: dragOver ? '1px solid #0C55B8' : '1px solid #4B4D4F',
              borderRadius: '8px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: '#D9F6FA',
              cursor: selectedFiles.length === 0 ? 'pointer' : 'not-allowed',
              mb: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              // only open file browser from the drop area when no file is already selected
              if (selectedFiles.length === 0) {
                handleBrowseFiles();
              }
            }}
          >
            <CloudUploadIcon sx={{fontSize: 64, color: '#4B4D4F', mb: 2}} />
            <Typography sx={{fontSize: '16px', fontWeight: 400, color: '#323334', mb: 2}}>
              Place file in the drop area to upload
            </Typography>
            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseFiles();
              }}
              disabled={selectedFiles.length > 0}
              sx={{
                borderRadius: '99px',
                padding: '8px 24px',
                fontWeight: 700,
                fontSize: '16px',
                color: isInvalidType || isTooLarge || selectedFile ? '#929496' : '#002677',
                backgroundColor: isInvalidType || isTooLarge || selectedFile ? '#F3F3F3' : '#FFFFFF'
              }}
            >
              Select File
            </Button>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{display: 'none'}}
          />

          {selectedFiles.length > 0 &&
            (() => {
              const file = selectedFiles[0];
              if (!file) return null;

              let statusText: string;
              if (isTooLarge) {
                statusText = 'File size exceed';
              } else if (isInvalidType) {
                statusText = 'Invalid file type';
              } else {
                statusText = 'Ready to upload';
              }

              const statusColor = isTooLarge || isInvalidType ? '#D32F2F' : '#224AA0';

              return (
                <Box sx={{border: '1px solid #CBCCCD', borderRadius: '4px', p: 2, mb: 3}}>
                  <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Box sx={{flex: 1}}>
                      <Typography sx={{fontSize: '14px', fontWeight: 700, mb: 0.5}}>{file.name}</Typography>
                      <Typography sx={{fontSize: '12px', fontWeight: 400, color: '#4B4D4F', mb: 1}}>
                        File size: {formatFileSize(file.size)}
                      </Typography>
                      <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        {isTooLarge || isInvalidType ? (
                          <CancelIcon sx={{fontSize: 16, color: statusColor}} />
                        ) : (
                          <FlagIcon sx={{fontSize: 16, color: statusColor}} />
                        )}
                        <Typography sx={{color: statusColor, fontWeight: 500}}>{statusText}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{display: 'flex', gap: 1}}>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon />}
                        onClick={handlePreview}
                        sx={{
                          borderColor: '#002677',
                          borderRadius: '46px',
                          color: '#002677',
                          fontWeight: 700,
                          fontSize: '14px',
                          textTransform: 'none'
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleRemoveFile}
                        disabled={effectiveUploading}
                        sx={{
                          borderColor: '#002677',
                          borderRadius: '46px',
                          color: '#002677',
                          fontWeight: 700,
                          fontSize: '14px',
                          textTransform: 'none'
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })()}

          <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
            <Button
              onClick={handleUpload}
              disabled={isUploadDisable}
              variant="contained"
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                borderRadius: '46px',
                backgroundColor: isUploadDisable ? '#F2F2F2 !important' : '#002677',
                color: isUploadDisable ? '#4B4D4F' : '#FBF9F4'
              }}
            >
              {effectiveUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
