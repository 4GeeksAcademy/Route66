import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box } from "@mui/material";
import { Header } from "../components/Header.jsx";
import logoImg from "../assets/img/route66logo1.jpg"

export const LoadsBoard = () => {

    // const { store, dispatch } = useGlobalReducer()


    const imageStyle = {
        height: 150,
        width: 150,
        objectFit: 'contain',
    }

    const titleStyle = {
        color: '#1C355E',
        fontWeight: 700,
        fontSize: '5rem'
    }

    const containerStyle = {
        px: 4,
        py: 3,
        bgcolor: '#F9F9F9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderBottom: '1px solid #ddd',
    }


    // useEffect(() => {

    // }, [])

    return (
        <Box>
            <Header containerStyle={containerStyle} title="Loads Board" titleStyle={titleStyle} imgStyle={imageStyle} imgUrl={logoImg} imgAlt="Route66 logo" />
        </Box>
    );
};