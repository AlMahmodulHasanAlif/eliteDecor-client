import React from "react";
import Hero from "./Hero";
import ServiceCoverage from "./ServiceCoverage";
import DynamicServices from "./DynamicServices";
import TopDecorators from "./TopDecorators";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <DynamicServices></DynamicServices>
      <TopDecorators></TopDecorators>
      <ServiceCoverage></ServiceCoverage>
    </div>
  );
};

export default Home;
