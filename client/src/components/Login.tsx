import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { useNavigate, NavigateFunction, Link } from 'react-router-dom';
import { API_URL } from "../config";

interface Props {
    setToken : Dispatch<SetStateAction<string | null>>
    setKirjautunut : Dispatch<SetStateAction<boolean>>
    setSahkopostiosoite : Dispatch<SetStateAction<string>>
    setKayttajatunnus : Dispatch<SetStateAction<string>>
    setKayttajaId : Dispatch<SetStateAction<number | null>>
};


const Login: React.FC<Props> = (props : Props) : React.ReactElement => {

    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>(null);

    const logIn = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if ((lomakeRef.current?.sahkopostiosoite.value) && (lomakeRef.current?.salasana.value)) {
            const yhteys = await fetch(`${API_URL}/api/auth/login`, {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    sahkopostiosoite : lomakeRef.current?.sahkopostiosoite.value,
                    salasana : lomakeRef.current?.salasana.value
                })
            });
                
            if (yhteys.status === 200) {

                let {token, kayttajaId, kayttajatunnus} = await yhteys.json();

                props.setToken(token);
                props.setKirjautunut(true);
                props.setSahkopostiosoite(lomakeRef.current?.sahkopostiosoite.value);
                props.setKayttajaId(kayttajaId);
                props.setKayttajatunnus(kayttajatunnus);

                localStorage.setItem("sahkopostiosoite", lomakeRef.current?.sahkopostiosoite.value);
                localStorage.setItem("token", token);

                navigate("/"); 
        }
    }

    }; 

    return (
        <Container disableGutters sx={{marginTop: "100px"}}>
            <Box
                component="form"
                onSubmit={logIn}
                ref={lomakeRef}
                style={{
                        width: 300,
                        backgroundColor : "#fff",
                        padding : 20,
                        margin: "auto"
                        }}
                    >
                <Typography 
                        variant="h6" 
                        sx={{ 
                            marginBottom: "50px", 
                            textAlign: "center", 
                            textTransform: "uppercase",
                            fontWeight: "bold"}}
                >
                    Kirjaudu sisään
                </Typography>
                <Stack spacing={2}>
                    <TextField 
                        label="Sähköpostiosoite" 
                        name="sahkopostiosoite"
                    />
                    <TextField 
                        label="Salasana"
                        name="salasana"
                        type="password" 
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                    >
                        Kirjaudu
                    </Button>
                    <Button  
                        variant="contained" 
                        size="large"
                        component={Link}
                        to="/"
                    >
                        Peruuta
                    </Button>
                </Stack>             
            </Box>
        </Container>
    );
};

export default Login;
