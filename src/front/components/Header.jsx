import { Box, Typography } from "@mui/material";

export const Header = ({
    title = "Title",
    imgUrl,
    imgAlt = "Image",
    imgStyle = {},
    titleStyle = {},
    containerStyle = {}
}) => {


    return (
        <Box sx={containerStyle}>
            <Box component="img" src={imgUrl} alt={imgAlt} sx={imgStyle} />
            <Box>
                <Typography variant="h1" sx={titleStyle}>
                    {title}
                </Typography>
            </Box>
        </Box>
    );
};