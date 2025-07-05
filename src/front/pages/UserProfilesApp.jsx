import React from 'react';
import { Typography } from '@mui/material';
import BrokerProfileCard from './BrokerProfileCard';
import CarrierProfileCard from './CarrierProfileCard';
import { useParams } from 'react-router-dom';


const UserProfilesApp = () => {

  const { role } = useParams();
  console.log(role);
  
  return (
    <>
      {role === 'broker' ? <BrokerProfileCard /> : <CarrierProfileCard />}
    </>
  );
};

export default UserProfilesApp;