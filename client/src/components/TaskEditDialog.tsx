import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Task } from '../types';
import { formatTag } from '../utils/taskUtils';
import TaskDependencySelector from './TaskDependencySelector';

interface TaskEditDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  open,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '' as 'H' | 'M' | 'L' | '',
    assignee: '',
    dueDate: '',
    project: '',
    tags: [] as string[],
    depends: [] as string[],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || '',
        assignee: task.assignee || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Convert to YYYY-MM-DD format
        project: task.project || '',
        tags: task.tags || [],
        depends: task.depends || [],
      });
    }
  }, [task]);

  const handleChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      assignee: formData.assignee || undefined,
      dueDate: formData.dueDate && formData.dueDate.trim() !== '' ? formData.dueDate : undefined,
      project: formData.project || undefined,
      tags: formData.tags,
      depends: formData.depends,
    };

    onSave(updatedTask);
    onClose();
  };

  const handleDependenciesChange = (newDependencies: string[]) => {
    setFormData(prev => ({
      ...prev,
      depends: newDependencies
    }));
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="task edit tabs"
          >
            <Tab label="Basic Info" />
            <Tab label="Dependencies" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="L">Low</MenuItem>
                    <MenuItem value="M">Medium</MenuItem>
                    <MenuItem value="H">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Project"
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                  fullWidth
                  placeholder="Enter project name"
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Assignee"
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  fullWidth
                  placeholder="Enter assignee name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Tags"
              value={formData.tags.join(', ')}
              onChange={(e) => {
                const tagsString = e.target.value;
                const tagsArray = tagsString
                  .split(',')
                  .map(tag => formatTag(tag))
                  .filter(tag => tag !== '');
                handleChange('tags', tagsArray);
              }}
              fullWidth
              placeholder="Enter tags separated by commas"
              helperText="Example: Important, Work, Meeting"
            />
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ pt: 1 }}>
            <TaskDependencySelector
              taskId={task.id}
              dependencies={formData.depends}
              onChange={handleDependenciesChange}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskEditDialog;
