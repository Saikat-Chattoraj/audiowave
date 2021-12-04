import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import PlayIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffIcon from '@mui/icons-material/VolumeOffOutlined';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import TopMenu from './TopMenu';
import ShowNotes from './ShowNotes';

import WaveSurfer from 'wavesurfer.js';

import { formatTime } from '../shared/utils';

const getLocalItems = (key) => {
    const list = window.localStorage.getItem(key);

    if (list) { return JSON.parse(list) }

    return [];
};

export default class PlayAudio extends React.Component {
    static waveSurfer = null;

    lsKey = 'notes';
    maxAudioSteps = 15;
    audioInterval = undefined;

    constructor(props) {
        super(props);

        this.state = {
            notes: getLocalItems(this.lsKey),
            audio: {
                volume: 4,
                isMute: false,
                duration: 0,
                isPlaying: false,
                currentTime: null
            },
            theme: 'light',
            remark: '',
            isNoteModalOpen: false,
            modalOpenTimestamp: 0
        };
    }

    getTheme = (mode) => {
        return createTheme({
            palette: {
                mode: mode
            }
        });
    }

    toggleTheme = () => {
        if (this.state.theme === 'light') {
            this.setState({
                theme: 'dark'
            });
        } else {
            this.setState({
                theme: 'light'
            });
        }
    }

    displayTimer = (val, defVal = 'Loading ...') => {
        return typeof val === 'undefined' || isNaN(val)
            ? defVal
            : formatTime(val);
    }

    addNote = () => {
        this.handleNoteModalClose();

        if (this.state.remark === '') { return }

        this.setState({
            notes: [
                ...this.state.notes,
                {
                    time: this.state.modalOpenTimestamp,
                    remark: this.state.remark,
                    audioName: this.props.audioFile?.name
                }
            ],
            remark: ''
        });
    }

    toggleMute = () => {
        if (PlayAudio.waveSurfer === null) { return }

        let mute = true;

        if (PlayAudio.waveSurfer.getMute()) {
            mute = false;
        }

        PlayAudio.waveSurfer.setMute(mute);
        this.setState({
            audio: {
                ...this.state.audio,
                isMute: mute
            }
        });
    }

    toggleAudioPlayback = () => {
        if (PlayAudio.waveSurfer === null) { return }

        const refreshRate = 500;
        PlayAudio.waveSurfer.playPause();

        if (PlayAudio.waveSurfer.isPlaying()) {
            this.setState({
                audio: {
                    ...this.state.audio,
                    isPlaying: true
                }
            });

            this.audioInterval = setInterval(() => {
                this.setState({
                    audio: {
                        ...this.state.audio,
                        currentTime: PlayAudio.waveSurfer.getCurrentTime()
                    }
                });
            }, refreshRate);

            return;
        }

        clearInterval(this.audioInterval);

        this.setState({
            audio: {
                ...this.state.audio,
                isPlaying: false
            }
        });
    };

    notesList = () => {
        if (this.state.notes.length !== 0) {
            const notesList = this.state.notes.filter((note) => note.audioName === this.props.audioFile?.name);

            if (notesList.length === 0) { return [] }

            return notesList;
        }

        return [];
    }

    removeNote = (noteData) => {
        const newNotes = this.state.notes.filter(note => {
            if (note.audioName === noteData.audioName && note.time === noteData.time) {
                return false;
            }
            return true;
        });

        this.setState({
            notes: newNotes
        });

        window.localStorage.setItem(this.lsKey, JSON.stringify(newNotes));
    }

    resumeFromTime = (note) => {
        console.log(note);
    }

    handleVolumeChange = (e, value) => {
        if (PlayAudio.waveSurfer === null) { return }

        if (value instanceof Array) {
            value = value.length > 0 ? value[0] : 0;
        }

        PlayAudio.waveSurfer.setVolume(value / this.maxAudioSteps);
        PlayAudio.waveSurfer.setMute(false);

        this.setState({
            audio: {
                ...this.state.audio,
                volume: value,
                isMute: false
            }
        });
    }

    handleNoteModalClose = () => {
        this.setState({
            isNoteModalOpen: false
        });
    }

    handleNoteModalOpen = () => {
        this.setState({
            isNoteModalOpen: true,
            modalOpenTimestamp: PlayAudio.waveSurfer.getCurrentTime()
        });
    }

    updateRemark = (e) => {
        this.setState({
            remark: e.target.value
        });
    }

    componentDidMount() {
        PlayAudio.waveSurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'blue',
            progressColor: 'purple'
        });

        if (typeof this.props.audioFile?.name !== 'string') { return }

        PlayAudio.waveSurfer.loadBlob(this.props.audioFile);

        PlayAudio.waveSurfer.on('ready', () => {
            this.handleVolumeChange(null, this.state.audio.volume);

            this.setState({
                audio: {
                    ...this.state.audio,
                    duration: PlayAudio.waveSurfer.getDuration(),
                    currentTime: 0
                }
            });
        });

        PlayAudio.waveSurfer.on('seek', () => {
            this.setState({
                audio: {
                    ...this.state.audio,
                    currentTime: PlayAudio.waveSurfer.getCurrentTime()
                }
            });

            this.handleNoteModalOpen();
        });

        PlayAudio.waveSurfer.on('error', () => {
            console.log('An error occurred!');
        });

        PlayAudio.waveSurfer.on('finish', () => {
            console.log('Audio clip finished!');

            this.setState({
                audio: {
                    ...this.state.audio,
                    isPlaying: false,
                    currentTime: 0
                }
            });
        });
    }

    componentWillUnmount () {
        clearInterval(this.audioInterval);
        PlayAudio.waveSurfer?.destroy();
    }

    componentDidUpdate (prevProps, prevState) {
        if (typeof this.state.notes?.length === 'undefined' ||
            typeof prevState.notes?.length === 'undefined') { return }

        if (this.state.notes.length > prevState.notes.length) {
            window.localStorage.setItem(this.lsKey, JSON.stringify(this.state.notes));
        }
    }

    render() {
        return (
            <ThemeProvider theme={this.getTheme(this.state.theme)}>
                <CssBaseline />

                <Box mt={0}>
                    <TopMenu title={this.props.audioFile?.name}
                        currentTheme={this.state.theme} toggleTheme={this.toggleTheme}
                    />

                    <Dialog open={this.state.isNoteModalOpen}>
                        <DialogTitle>Add Notes</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin='dense'
                                id='reamrk'
                                label='Note'
                                type='text'
                                fullWidth
                                variant='standard'
                                value={this.state.remark}
                                onChange={this.updateRemark}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button id="closeNoteModal" onClick={this.handleNoteModalClose} component="button">
                                Cancel
                            </Button>
                            <Button onClick={() => this.addNote()}>Add</Button>
                        </DialogActions>
                    </Dialog>

                    <Container sx={{ marginTop: '15em', marginBottom: '20px' }}>
                        <Paper elevation={14} sx={{ padding: '2em 1em 0.6em 1em', borderRadius:"3em" }}>
                            <Box sx={{
                                marginBottom: '2px'
                            }}>
                                <div id="waveform"></div>
                            </Box>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>00:00</div>
                                <div>
                                    {this.state.audio.currentTime == null
                                        ? <span><HourglassBottomIcon/>Loading</span>
                                        : this.displayTimer(this.state.audio.currentTime)}
                                </div>
                                <div>
                                    {this.displayTimer(this.state.audio.duration, '00:00')}
                                </div>
                            </div>
                        </Paper>

                        <Grid container sx={{
                            display: 'flex',
                            justifyContent: 'space-between', alignItems: 'center',
                            padding: '0 1em',
                            marginBottom: '2em',
                            marginTop:"4em"
                        }}>
                            <Grid item xs={4}>
                                <Fab color="primary" size="large"
                                    onClick={this.toggleAudioPlayback}
                                >
                                    {
                                        this.state.audio.isPlaying
                                            ? <PauseIcon fontSize="large" />
                                            : <PlayIcon fontSize="large" />
                                    }
                                </Fab>
                            </Grid>

                            <Grid item md={3} xs={5}>
                                <Stack direction="row" alignItems="center"
                                    spacing={{ xs: 0, lg: 0.5 }} justifyContent='flex-end'
                                >
                                    <Tooltip title="Toggle Mute" placement="left">
                                        <IconButton color="primary" onClick={this.toggleMute}>
                                            {this.state.audio.isMute ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                        </IconButton>
                                    </Tooltip>

                                    <Slider size="small"
                                        min={0} max={this.maxAudioSteps} step={1}
                                        value={this.state.audio.volume}
                                        onChange={this.handleVolumeChange}
                                        valueLabelDisplay="auto"
                                        color="primary"
                                    />
                                </Stack>
                            </Grid>
                        </Grid>

                        <ShowNotes
                            notes={this.notesList()} resumeFromTime={this.resumeFromTime}
                            removeNote={this.removeNote}
                        />
                    </Container>
                </Box>
            </ThemeProvider>
        );
    }
}
