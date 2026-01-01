import React, { useRef, useState } from "react";
import { Box, Button, Container, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction, Link } from 'react-router-dom';
import { API_URL } from "../config";


const Register: React.FC = () : React.ReactElement => {

    const [viesti, setViesti] = useState<string>("");
    
    const navigate : NavigateFunction = useNavigate();

    const lomakeRef = useRef<HTMLFormElement>(null);

    const register = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if ((lomakeRef.current?.taloyhtio.value) && (lomakeRef.current?.sahkopostiosoite.value) && (lomakeRef.current?.kayttajatunnus.value) && (lomakeRef.current?.salasana.value)) {

                const yhteys = await fetch(`${API_URL}/api/auth/register`, {
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        taloyhtio : lomakeRef.current?.taloyhtio.value,
                        kayttajatunnus : lomakeRef.current?.kayttajatunnus.value,
                        sahkopostiosoite : lomakeRef.current?.sahkopostiosoite.value,
                        salasana : lomakeRef.current?.salasana.value
                    })
                });
                
                if (yhteys.status === 200) {

                    const data = await yhteys.json();

                    setViesti(data.viesti);

                    setTimeout(() => {
                        navigate("/")
                    }, 2000);

                } else {
                    let {virhedata} = await yhteys.json();
                    setViesti(virhedata.virhe || "Uuden käyttäjätunnuksen rekisteröinti epäonnistui.")
                }
            }
        };

    return (
        <Container disableGutters sx={{marginTop: "100px"}}>
            <Box
                component="form"
                onSubmit={register}
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
                    Rekisteröidy
                </Typography>
                <Stack spacing={2}>
                    <TextField 
                        label="Taloyhtiö" 
                        name="taloyhtio"
                        placeholder="Kirjoita taloyhtiösi nimi."
                    />
                    <TextField 
                        label="Käyttäjätunnus" 
                        name="kayttajatunnus"
                        placeholder="Kirjoita julkinen käyttäjätunnuksesi."
                    />
                    <TextField 
                        label="Sähköpostiosoite" 
                        name="sahkopostiosoite"
                        placeholder="Kirjoita sähköpostiosoitteesi."
                    />
                    <TextField 
                        label="Salasana"
                        name="salasana"
                        type="password" 
                    />
                    {viesti && <Typography sx={{textAlign: "center"}}>{viesti}</Typography>}
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large"
                    >
                        Rekisteröidy
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

export default Register;