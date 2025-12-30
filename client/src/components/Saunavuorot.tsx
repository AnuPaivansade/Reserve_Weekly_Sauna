import React, { useState, useEffect}from 'react';
import { Container, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Grid, Divider, Button, Backdrop, CircularProgress } from '@mui/material';
import { useNavigate, NavigateFunction} from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { getWeek, format } from 'date-fns';

interface Kayttaja {
  kayttajatunnus : string
}

interface Saunavuoro {
  id: number
  paivamaara : Date
  kellonaika : string
  kayttajaId? : number | null
  kayttaja : Kayttaja
}

interface Viikot {
    viikot : number[]
    virhe : string
}

interface ApiData {
    saunavuorot : Saunavuoro[]
    virhe : string
    haettu : boolean
};

interface fetchAsetukset {
    method : string
    headers? : any
    body? : string
};

interface Props {
    token: string | null
    kirjautunut: boolean
    sahkopostiosoite: string
    kayttajaId : number | null
    kayttajatunnus : string
};

const Saunavuorot: React.FC<Props> = (props : Props) : React.ReactElement => {


  //Komponentin vakiot
    const navigate : NavigateFunction = useNavigate();
    const [viikotData, setViikotData] = useState<Viikot>({
        viikot : [],
        virhe : ""
    });
    const [valittuViikko, setValittuViikko] = useState<number | string>("");
    const [valittuVuoro, setValittuVuoro] = useState<number | string>("");

    const [apiData, setApiData] = useState<ApiData>({
        saunavuorot : [],
        virhe : "",
        haettu: false
      });

  //Komponentin funktiot
    const lahetaVaraus = async (kayttajaId : number | null) => {
      setApiData({
            ...apiData,
            haettu: false
          });

      const varattavaVuoro = apiData.saunavuorot.find((saunavuoro : Saunavuoro) => {
        return saunavuoro.id === valittuVuoro
      });

      
      if (!varattavaVuoro) {
        console.error("Vuoroa ei löydy");
        return;
}
      const paivitettyVuoro : Saunavuoro = {
        ...varattavaVuoro, 
        kayttajaId : kayttajaId
      }

      await apiKutsu("PUT", paivitettyVuoro);
      
      await apiKutsu();

      setValittuVuoro("");

    };



    const viikonHaku = async () : Promise<void> => {
  
      let asetukset : fetchAsetukset = {
          method: "GET"
      }

      try {
  
        const yhteys : Response = await fetch("http://localhost:3110/api/saunavuorot/viikot", asetukset);
  
        if (yhteys.status === 200) {
  
          setViikotData({
              viikot : await yhteys.json(),
              virhe : ""
          });
        
          apiKutsu();
  
        } else {
  
          let virheteksti :string = "";
  
          switch (yhteys.status) {
  
            case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
            case 401 : navigate("/login"); break;
            default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
  
          }
  
          setViikotData({
            ...viikotData,
            virhe : virheteksti
          });
  
        }
  
      } catch (e : any) {
  
        setViikotData({
          ...viikotData,
          virhe : "Palvelimeen ei saada yhteyttä"
        });
      }

    }


    const valintaViikko = (e : any) => {
      setValittuViikko(Number(e.target.value));
    }


    const valintaVuoro = (e : any) => {
      setValittuVuoro(Number(e.target.value));
    }

    
    const apiKutsu = async (metodi? : string, saunavuoro? : Saunavuoro) : Promise<void> => {
      
      let url : string = "http://localhost:3110/api/saunavuorot";

   
      let asetukset : fetchAsetukset = { 
        method : metodi || "GET",
        headers : {
          'Authorization' : `Bearer ${props.token}`
        } 
      };

      if (metodi === "PUT") {

        url = `http://localhost:3110/api/saunavuorot/${valittuVuoro}`;

        asetukset = {
          ...asetukset,
          headers : {
            ...asetukset.headers,
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(saunavuoro)
        }
      }
      
      try {
  
        const yhteys : Response = await fetch(url, asetukset);
  
        if (yhteys.status === 200) {

          const data = await yhteys.json();

              setApiData({
                ...apiData,
                saunavuorot: data,
                haettu: true
              });
   
      
        } else {
  
          let virheteksti :string = "";
  
          switch (yhteys.status) {
  
            case 400 : virheteksti = "Virhe pyynnön tiedoissa"; break;
            case 401 : navigate("/login"); break;
            default : virheteksti = "Palvelimella tapahtui odottamaton virhe"; break;
  
          }
  
           
          setApiData({
            ...apiData,
            virhe: virheteksti,
            haettu: true
          });
          
        }
  
      } catch (e : any) {
  
        setApiData({
          ...apiData,
          virhe: "Palvelimeen ei saada yhteyttä",
          haettu: true
        });
      }
    }
  

  //useEffect-hook
    useEffect(() => {
      viikonHaku();
    }, []);

    return (
        <Container disableGutters>
            <Typography 
                    sx={{
                        marginTop: "100px", 
                        marginBottom: "50px", 
                        textAlign: "center", 
                        textTransform: "uppercase",
                        fontWeight: "bold"}}
                    variant="h5"
            >
                As Oy Metsämäen saunavuorot
            </Typography>
            <FormControl fullWidth>
                <InputLabel id="viikonValinta">Valitse viikko</InputLabel>
                <Select
                        labelId = "viikonValinta"
                        value = {valittuViikko}
                        label = "Valitse viikko"
                        onChange={(e : any) => (valintaViikko(e))}
                >
                 {viikotData.viikot.map((viikko : number, idx: number) => (
                    <MenuItem key={idx} value={viikko}>
                        {`Viikko ${viikko}`}
                    </MenuItem>
                 ))}           
                </Select>
            </FormControl>
            <Divider sx={{my: 2}}/>
            
            {!apiData.haettu
            ? (<Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>)
            : (<>
                <Typography variant="h6" sx={{marginTop: "30px", marginBottom: "10px", textAlign: "center"}}>Viikon saunavuorot</Typography>
                <Typography variant="body2" sx={{marginBottom: "50px", textAlign: "center"}}>1 vuoro / vko / talous </Typography>
                <Grid 
                    container 
                    spacing={2} 
                    display="flex" 
                    justifyContent="center"
                >
                    {apiData.saunavuorot
                        .filter((saunavuoro : Saunavuoro) => {
                            const saunaVuoroViikko : number = getWeek(new Date(saunavuoro.paivamaara), {weekStartsOn: 1});
                        return saunaVuoroViikko === valittuViikko
                    })
                        .map((saunavuoro : Saunavuoro, idx: number) => (
                            <Grid key={idx}>
                                <Card 
                                    key={idx}
                                    sx={{ 
                                          padding: 2,
                                          backgroundColor: saunavuoro.kayttajaId ?  "#ffe6f0" : "#e6f7e6"
                                          }}>
                                <CardContent>
                                    <Typography variant="body1" fontWeight="bold">
                                    {format(saunavuoro.paivamaara, "d.M.yyyy")}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    Klo: {saunavuoro.kellonaika}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {saunavuoro.kayttaja?.kayttajatunnus 
                                      ?`Varattu: ${saunavuoro.kayttaja?.kayttajatunnus}` 
                                      : "Ei varattu."}
                                    </Typography>
                                </CardContent>
                              </Card>
                          </Grid>    
                      ))}
                  </Grid>
                

              {!props.kirjautunut
              ? <Typography sx={{marginTop: "50px", marginBottom: "50px", textAlign: "center"}}>Kirjaudu sisään varataksesi saunavuoro.</Typography>
              : (<>
              <Divider sx={{my: 2}}/>
              <Typography variant="h6" sx={{marginTop: "30px", marginBottom: "50px", textAlign: "center"}}>Varaa saunavuoro</Typography>
                <FormControl fullWidth>
                  <InputLabel id="vuoronValinta">Valitse vuoro</InputLabel>
                  <Select
                          labelId = "vuoronValinta"
                          value = {valittuVuoro}
                          label = "Valitse vuoro"
                          onChange={(e : any) => (valintaVuoro(e))}
                  >
                  {apiData.saunavuorot
                  .filter((saunavuoro : Saunavuoro) => {
                          const saunaVuoroViikko : number = getWeek(new Date(saunavuoro.paivamaara), {weekStartsOn: 1});
                      return (saunaVuoroViikko === valittuViikko && !saunavuoro.kayttajaId);
                  })
                  .map((saunavuoro : Saunavuoro, idx: number) => (
                      <MenuItem key={idx} value={saunavuoro.id}>
                          {`${format(saunavuoro.paivamaara, "d.M.yyyy")} ${saunavuoro.kellonaika}`}
                      </MenuItem>
                  ))}           
                  </Select>
              </FormControl>
              <Button
                    variant="contained"
                    onClick={() => {lahetaVaraus(props.kayttajaId)}}
                    disabled={!valittuVuoro}
                    fullWidth
                    sx={{marginTop: "20px"}}>
                Varaa vuoro
              </Button>
              </>
              )}
            </>
          )}
        </Container>
            
    );
};


export default Saunavuorot