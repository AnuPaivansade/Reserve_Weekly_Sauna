import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

interface Props {
    setKirjautunut : Dispatch<SetStateAction<boolean>>
    setKayttajaId : Dispatch<SetStateAction<number | null>>
    setKayttajatunnus : Dispatch<SetStateAction<string>>
}

const Logout: React.FC<Props> = (props: Props) : React.ReactElement => {
    const navigate : NavigateFunction = useNavigate();

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("sahkopostiosoite");
        props.setKirjautunut(false);
        props.setKayttajaId(-1);
        props.setKayttajatunnus("");
        navigate("/");
    }

    useEffect(() => {
       logOut(); 
    }, [])
    
    return (
        <>
        </>
    );
};

export default Logout