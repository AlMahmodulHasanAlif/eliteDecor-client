import React from 'react';
import Hero from './Hero';
import ServiceCoverage from './ServiceCoverage';
import DynamicServices from './DynamicServices';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <DynamicServices></DynamicServices>
            <ServiceCoverage></ServiceCoverage>
        </div>
    );
};

export default Home;