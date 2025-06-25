import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Box } from "@mui/material";
import { Header } from "../components/Header.jsx";
import logoImg from "../assets/img/Route66logo.png"
import { FilterBar } from "../components/FilterBar.jsx";

export const LoadsBoard = () => {

    // const { store, dispatch } = useGlobalReducer()


    const imageStyle = {
        height: '300px',
        width: '200px',
        objectFit: 'contain',
        position: 'relative',
        bottom: '-4px',
    }

    const titleStyle = {
        color: '#1C355E',
        fontWeight: 700,
        fontSize: '5rem'
    }

    const containerStyle = {
        px: 4,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        borderBottom: '1px solid #ddd',
        height: "120px"
    }


    // useEffect(() => {

    // }, [])

    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Header containerStyle={containerStyle} title="Loads Board" titleStyle={titleStyle} imgStyle={imageStyle} imgUrl={logoImg} imgAlt="Route66 logo" />
            <FilterBar />
        </Box>
    );
};