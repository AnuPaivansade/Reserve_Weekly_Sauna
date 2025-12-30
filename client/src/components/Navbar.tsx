import { AppBar, Box, Button, Toolbar } from '@mui/material';
import React from 'react'
import { Link } from 'react-router-dom';

interface Props {
    kirjautunut : boolean
}

const Navbar: React.FC<Props> = (props : Props) : React.ReactElement => {

    const valilehdet : string[] = (!props.kirjautunut)
    ? ["Varaa vuoro", "Rekisteröidy", "Kirjaudu"]
    : ["Varaa vuoro", "Rekisteröidy", "Kirjaudu ulos"];


    const reitit : string[] = (!props.kirjautunut)
    ? ["/", "register", "login"]
    : ["/", "register", "logout"]
    
    return (
    <AppBar position="fixed" sx={{top: 0, left: 0}}>
        <Box sx={{width: "100%"}}>
            <Toolbar>
                <Box sx={{flexGrow: 1, display: "flex", justifyContent: "center", gap: "20px"}}>
                    {valilehdet.slice(0,2).map((valilehti : string, idx : number) => (
                        <Button 
                                key = {idx} 
                                sx = {{my: 2, color: "white", display: "block"}}
                                component={Link}
                                to={reitit[idx]}>
                            {valilehti}
                        </Button>
                    ))}
                </Box>
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button 
                        sx={{my: 2, color: "white", display: "block"}}
                        component={Link}
                        to={reitit[2]}>
                        {valilehdet[2]}
                    </Button>
                </Box>
            </Toolbar>
        </Box>
    </AppBar>
    );
};

export default Navbar