import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import "aos/dist/aos.css";
import AOS from "aos";

const Home = () => {


    useEffect(() => {
        AOS.init({
            duration: 1200,
            easing: "ease-in-out",
            once: true,
        });

    }, []);


    return (

        <div className="home-container">
            <section className="hero-banner" data-aos="fade-up">
                <div className="hero-section">
                    <h1>Welcome to the Wanderstay</h1>
                    <p>your go to place for solo travel stays. safe simple affordable and stress free.</p>
                    <Link to="/bookings" className="cta-button">Browse Available Rooms</Link>
                </div>
            </section>

            <section className="trust-bar">
                <div className="stats" data-aos="zoom-in-up">
                    <h3>7k+</h3>
                    <p>solo travelers Helped</p>
                </div>


                <div className="stats" data-aos="zoom-in-up">
                    <h3>95%</h3>
                    <p>of our customers are satisfied</p>
                </div>

                <div className="stats" data-aos="zoom-in-up">
                    <h3>4.7/5</h3>
                    <p> our average rating</p>
                </div>
            </section>

            <section className="feature-section" data-aos="fade-right">
                <h2>Why choose WanderStay</h2>
                <div className="feature-grid">
                    <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
                        <h3>Easy bookings</h3>
                        <p>We can get you booked up in just a few clicks</p>
                    </div>
                    <div className="feature-card" data-aos="fade-up" data-aos-delay="1000">
                        <h3>made for solo travelers</h3>
                        <p>All rooms and options are curated with solo travelrs in mind</p>
                    </div>
                    <div className="feature-card" data-aos="fade-up" data-aos-delay="1500">
                        <h3>Affordable and reliable</h3>
                        <p>Find a room for your budget</p>
                    </div>
                </div>
            </section >


            <section className="testimonial-section">
                <h2> whar traverlers are saying</h2>
                <div className="testimonial-grid">
                    <div className="testimonial-card" data-aos="flip-up" data-aos-delay="400">
                        <p>"WanderStay made my solo trip so much easier! The booking process was a breeze, and I felt safe and comfortable throughout my stay. Highly recommend!"</p>
                        <h4>- Sarah J, Canada</h4>
                        <div className="testimonial-card" data-aos="flip-left">
                            <p>"I loved my experience with WanderStay! The room was perfect for solo travelers, and the staff were incredibly helpful. I will definitely be using them again!"</p>
                            <h4>- Mark T, Spain</h4>
                        </div>
                        <div className="testimonial-card" data-aos="flip-right">
                            <p> safe, clean , and perfect for us budget traverlers</p>
                            <h4>- Emily R Jay, Mexico</h4>
                        </div>
                    </div>
                </div>
            </section>




















            <section className="get-started-section">
                <h2>Ready to book</h2>
                <p>Head over to our bookings page and start your easy and fun solo adventure</p>
                <Link to="/bookings" className="cta-button">start Booking</Link>
            </section>

        </div >


    );


};

export default Home;