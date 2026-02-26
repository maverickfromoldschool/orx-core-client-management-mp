import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import SearchIcon from '@mui/icons-material/Search';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

export interface JsonConfigEditorProps {
  open: boolean;
  value: object | null;
  onChange: (value: object | null) => void;
  onClose: () => void;
  title?: string;
  readOnly?: boolean;
  height?: string | number;
  maxHeight?: string | number;
}

export function JsonConfigEditor(props: JsonConfigEditorProps) {
  const {
    open,
    value,
    onChange,
    onClose,
    title = 'JSON Editor',
    readOnly = false,
    height = '400px',
    maxHeight = '600px'
  } = props;

  const [jsonText, setJsonText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedKeys, setExpandedKeys] = React.useState<Set<string>>(new Set());

  // Initialize jsonText when dialog opens or value changes
  React.useEffect(() => {
    if (open) {
      try {
        const text = value ? JSON.stringify(value, null, 2) : '{}';
        setJsonText(text);
        setError(null);
        // Auto-expand first level
        setExpandedKeys(new Set(['root']));
      } catch {
        setJsonText('{}');
        setError('Invalid JSON value');
      }
    }
  }, [open, value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);

    // Validate JSON
    try {
      JSON.parse(newText);
      setError(null);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Invalid JSON');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Cannot format invalid JSON');
    }
  };

  const handleExpandAll = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const keys = new Set<string>();
      const collectKeys = (obj: unknown, path: string): void => {
        keys.add(path);
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach((key) => {
            const objAsRecord = obj as Record<string, unknown>;
            collectKeys(objAsRecord[key], `${path}.${key}`);
          });
        }
      };
      collectKeys(parsed, 'root');
      setExpandedKeys(keys);
    } catch {
      // Ignore
    }
  };

  const handleCollapseAll = () => {
    setExpandedKeys(new Set(['root']));
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChange(parsed);
      onClose();
    } catch {
      setError('Cannot save invalid JSON');
    }
  };

  const handleCancel = () => {
    setError(null);
    setSearchQuery('');
    onClose();
  };

  const renderJsonTree = (obj: unknown, path: string, level: number): React.ReactNode => {
    const isExpanded = expandedKeys.has(path);
    const indent = level * 20;

    if (obj === null) {
      return <Box sx={{pl: `${indent}px`, color: 'text.secondary'}}>null</Box>;
    }

    if (typeof obj !== 'object') {
      let color = 'warning.main';
      if (typeof obj === 'string') {
        color = 'success.main';
      } else if (typeof obj === 'number') {
        color = 'info.main';
      }
      return <Box sx={{pl: `${indent}px`, color, fontFamily: 'monospace'}}>{JSON.stringify(obj)}</Box>;
    }

    const isArray = Array.isArray(obj);
    const keys = Object.keys(obj);
    const matchesSearch = !searchQuery || JSON.stringify(obj).toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return null;

    return (
      <Box key={path} sx={{pl: `${indent}px`}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {backgroundColor: 'action.hover'},
            py: 0.5,
            fontFamily: 'monospace'
          }}
          onClick={() => {
            const newExpanded = new Set(expandedKeys);
            if (isExpanded) {
              newExpanded.delete(path);
            } else {
              newExpanded.add(path);
            }
            setExpandedKeys(newExpanded);
          }}
        >
          <Typography sx={{mr: 1, fontSize: '12px'}}>{isExpanded ? '▼' : '▶'}</Typography>
          <Typography sx={{fontWeight: 600, fontSize: '14px'}}>
            {isArray ? `Array[${keys.length}]` : `Object{${keys.length}}`}
          </Typography>
        </Box>
        {isExpanded && (
          <div>
            {keys.map((key) => {
              const objAsRecord = obj as Record<string, unknown>;
              return (
                <Box key={key} sx={{display: 'flex', pl: 2}}>
                  <Typography
                    sx={{color: 'primary.main', fontFamily: 'monospace', fontSize: '14px', minWidth: '120px'}}
                  >
                    {key}:
                  </Typography>
                  {renderJsonTree(objAsRecord[key], `${path}.${key}`, level + 1)}
                </Box>
              );
            })}
          </div>
        )}
      </Box>
    );
  };

  const renderTreeView = () => {
    try {
      const parsed = JSON.parse(jsonText);
      return renderJsonTree(parsed, 'root', 0);
    } catch {
      return <Box sx={{p: 2, color: 'error.main'}}>Invalid JSON - switch to Code view to fix</Box>;
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{p: 0}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider', px: 2}}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => {
              setActiveTab(v);
            }}
            TabIndicatorProps={{
              sx: {
                backgroundColor: '#FF612B',
                height: 3
              }
            }}
          >
            <Tab
              label="Tree View"
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0C55B8',
                '&.Mui-selected': {
                  color: '#002677'
                }
              }}
            />
            <Tab
              label="Code View"
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0C55B8',
                '&.Mui-selected': {
                  color: '#002677'
                }
              }}
            />
          </Tabs>
        </Box>

        <Box sx={{p: 2}}>
          {/* Search and Controls */}
          <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{flex: 1}}
            />
            {activeTab === 0 && (
              <>
                <IconButton onClick={handleExpandAll} size="small" title="Expand All">
                  <UnfoldMoreIcon />
                </IconButton>
                <IconButton onClick={handleCollapseAll} size="small" title="Collapse All">
                  <UnfoldLessIcon />
                </IconButton>
              </>
            )}
            {activeTab === 1 && !readOnly && (
              <IconButton onClick={handleFormat} size="small" title="Format JSON">
                <FormatAlignLeftIcon />
              </IconButton>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{mb: 2}}>
              {error}
            </Alert>
          )}

          {/* Content */}
          <Paper variant="outlined" sx={{height, maxHeight, overflow: 'auto', p: 2}}>
            {activeTab === 0 ? (
              <div>{renderTreeView()}</div>
            ) : (
              <TextField
                fullWidth
                multiline
                value={jsonText}
                onChange={handleTextChange}
                disabled={readOnly}
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  },
                  '& fieldset': {border: 'none'}
                }}
                placeholder='{\n  "key": "value"\n}'
              />
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button
          onClick={handleCancel}
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#323334',
            borderRadius: '46px',
            border: '1px solid #323334',
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        {!readOnly && (
          <Button
            onClick={handleSave}
            disabled={!!error}
            sx={{
              backgroundColor: '#002677',
              fontSize: '16px',
              fontWeight: 700,
              color: '#FBF9F4',
              borderRadius: '46px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                backgroundColor: '#001a52'
              },
              '&.Mui-disabled': {
                backgroundColor: '#cccccc',
                color: '#666666'
              }
            }}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default JsonConfigEditor;
