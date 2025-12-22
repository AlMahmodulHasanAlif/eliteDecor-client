import React from "react";
import { motion } from "framer-motion";
import heroImg from "../../assets/hero.jpg";


const Hero = () => {
  return (
    <div>
      <section className="relative bg-black text-white min-h-screen flex items-center py-5">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col-reverse md:flex-row items-center justify-between">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 mt-8 md:mt-0"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Home into a Masterpiece
            </h1>
            <p className="text-gray-300 mb-8">
              Elite Decor offers premium home and event decoration services to
              make your spaces truly extraordinary.
            </p>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/services"
              className="inline-block rounded-xl bg-white text-black px-8 py-4 font-semibold shadow-lg hover:bg-gray-200 transition"
            >
              Book Decoration Service
            </motion.a>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <img
              src={heroImg}
              alt="Luxury Home Decoration"
              className="rounded-2xl shadow-2xl border border-white"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
