import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/CloseRounded';
import UploadIcon from '@mui/icons-material/Upload';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import { withRouter } from 'react-router';

import { formatFileSize } from '../shared/utils';

function DisplayFileInfo({ file, removeFile }) {
    if (! file) { return null }

    return (
        <Box sx={{
            dispay: 'flex',
            marginTop: '12px',
            alignItems: 'flex-start',
         }}>
            <Typography variant="h4">
                {file.name}
            </Typography>
            
            <Typography variant="subtitle1">
                <strong></strong> {formatFileSize(file.size)}
            </Typography>
            <Typography variant="subtitle1">
                <strong></strong> {file.type}
            </Typography>

            <Button
                type="button"
                color="error"
                variant="contained"
                component="button"
                fullWidth
                sx={{
                    marginTop: '8px'
                }}
                onClick={removeFile}
                startIcon={<CloseIcon />}
            >
                Remove File
            </Button>
        </Box>
    );
}

class UploadButton extends React.Component {
    inputBtnId = 'audio-file';

    constructor (props) {
        super(props);

        this.state = {
            file: null
        };
    }

    handleFile = (e) => {
        this.setState({
            file: e.target.files[0] ?? null
        });
    }

    removeFile = () => {
        this.setState({
            file: null
        });

        window.document.getElementById(this.inputBtnId).value = null;
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (! this.state.file) { return }

        this.props.setAudioFile(this.state.file);

        this.props.history.push('/play-audio');
    };

    getFormStyles = (file) => {
        if (! file) { return { } }

        return {
            border: '2px solid rgba(0, 0, 0, 0.2)',
            margin: '1em',
            padding: '3em 2em',
            borderRadius: '1em',
            boxShadow: '6px 5px rgba(0, 0, 0, 0.07)',
            backgroundColor:"#808080"
        };
    }

    render () {
        const infoMsg = '';

        return (
            <Box sx={{
                display: 'flex',
                minHeight: '50vh',
                alignItems: 'center',
                justifyContent: 'center'
             }}>
                <form onSubmit={this.onSubmit}
                    style={{...this.getFormStyles(this.state.file), transition: "all 0.3s ease"}}
                >
                    <Stack direction="column" alignItems="center" spacing={6}>
                        <label htmlFor={this.inputBtnId}>
                            <input accept=".mp3, .wav, .aac, .wma, .m4a"
                                id={this.inputBtnId} type="file"
                                style={{ display: '-webkit-inline-flex' ,
                                cursor:"pointer",
                                color:"black",
                                backgroundColor:"darkseagreen"
                            }}
                                onChange={this.handleFile}

                            />
                            {/* <Button variant="contained" component="span"  startIcon={<GraphicEqIcon/>}
                                size="large"
                            >
                                Select Audio File
                            </Button> */}
                        </label>
                        <Button type="submit" component="button" variant="contained"
                            size="large"
                            color="success"
                            endIcon={<UploadIcon/>}
                            disabled={this.state.file === null ? true : false}
                        >
                            Upload
                        </Button>
                    </Stack>

                    <Typography variant="subtitle1" mt={1} align="center">
                        {this.state.file === null ? infoMsg : ''}
                    </Typography>

                    <DisplayFileInfo file={this.state.file} removeFile={this.removeFile} />
                </form>
            </Box>
        );
    }
}

export default withRouter(UploadButton);
