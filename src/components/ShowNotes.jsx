import React from 'react';

import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteForeverRounded';
import NoteAltIcon from '@mui/icons-material/NoteAltRounded';
import PlayCircleIcon from '@mui/icons-material/PlayCircleRounded';
import DescriptionIcon from '@mui/icons-material/Description';

import { formatTime } from '../shared/utils';

export default class ShowNotes extends React.PureComponent {
    render() {
        const iconStyle = { marginLeft: '2px' };
        const emptyList = <Typography variant="subtitle1" style={{color:"darkgoldenrod"}}
            sx={{
                marginTop: '1em'
            }}
        >
            No notes to display!
        </Typography>;

        const noteList = <List sx={{ width: '100%', bgcolor: 'background.paper' , borderRadius: '1em' }}>
            {this.props.notes.map(note => {
                return (
                    <ListItem key={note.time} secondaryAction={
                        <div>
                            <Tooltip title="Resume" placement="bottom-end">
                                <IconButton color="success" edge="end" style={iconStyle}
                                    onClick={() => this.props.resumeFromTime(note)}
                                >
                                    <PlayCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <IconButton edge="end" style={iconStyle} disabled>
                                <EditIcon />
                            </IconButton>
                            <Tooltip title="Delete" placement="bottom-end">
                            <IconButton color="error" style={iconStyle} edge="end"
                                onClick={() => this.props.removeNote(note)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            </Tooltip>
                        </div>
                    }>
                        <ListItemAvatar>
                            <Avatar>
                                < DescriptionIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={note.remark} secondary={formatTime(note.time)}
                            sx={{
                                textTransform: 'capitalize'
                            }}
                        />
                    </ListItem>
                );
            })}
        </List>;

        return (
            <Paper elevation={24} sx={{
                margin: '0 1em 20px 1em',
                padding: '1em',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor:"purple",
                borderRadius: '1em',
            }}>
                
                <Typography variant="h5" style={{color:"white"}}>
                    Click on the waveform to add a note at that particular timestamp.
                </Typography>

                {this.props.notes.length === 0 ? emptyList : noteList}
            </Paper>
        );
    }
}
