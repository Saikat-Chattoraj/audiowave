import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default class TopMenu extends React.Component {
    render () {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Link to="/" style={{ color: '#fff' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="back"
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackIosNewIcon />
                            </IconButton>
                        </Link>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {this.props.title}
                        </Typography>

                        <IconButton
                            color="inherit"
                            onClick={this.props.toggleTheme}
                        >
                            {this.props.currentTheme === 'dark'
                                ? <WbSunnyIcon/>
                                : <DarkModeIcon/>
                            }

                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}
