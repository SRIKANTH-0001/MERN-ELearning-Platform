import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllCourses } from "../api/courseApi";
import "../styles/landing.css";

const LandingPage = () => {
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getAllCourses();
        setTrendingCourses(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching trending courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="landing-wrapper">
      <Navbar />

      {/* PREMIUM HERO SECTION */}
      <section className="hero-premium">
        <div className="hero-overlay"></div>
        <div className="hero-content-v2">
          <span className="hero-tag">The Future of Online Education</span>
          <h1>
            Master New Skills with<br />
            <span>Next-Gen</span> MERN Platform
          </h1>
          <p>
            Access premium courses from <strong>Guvi, Udemy, and Edureka</strong>.
            Join 10,000+ students in a real-time learning environment built for
            professionals and beginners alike.
          </p>
          <div className="hero-action-group">
            <Link to="/register" className="glass-btn primary">Start Learning Now</Link>
            <Link to="/courses" className="glass-btn secondary">View Catalog</Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
            alt="Collaborative Learning"
            className="floating-hero-img"
          />
        </div>
      </section>

      {/* IMPACT STATISTICS */}
      <section className="stats-bar">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat-item">
          <h3>500+</h3>
          <p>Premium Lessons</p>
        </div>
        <div className="stat-item">
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Expert Mentors</p>
        </div>
      </section>

      {/* INDUSTRY PARTNERS */}
      <section className="partners-section">
        <p>Trusted by industry leaders worldwide</p>
        <div className="logo-cloud">
          <span>Microsoft</span>
          <span>Google</span>
          <span>Amazon</span>
          <span>META</span>
          <span>Netflix</span>
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="categories-section">
        <div className="section-header-v2">
          <h2>Master Trending Categories</h2>
          <p>Expert-led programs designed for high-demand career paths</p>
        </div>
        <div className="category-grid">
          <div className="category-card dev">
            <div className="cat-icon-v3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            </div>
            <h4>Web Development</h4>
            <p>Master modern frameworks like React, Node, and Python for full-stack excellence.</p>
            <span className="cat-count">120+ Courses</span>
          </div>

          <div className="category-card data">
            <div className="cat-icon-v3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h4>Data Science</h4>
            <p>Dive deep into AI, Machine Learning, and Big Data with hands-on projects.</p>
            <span className="cat-count">85+ Courses</span>
          </div>

          <div className="category-card design">
            <div className="cat-icon-v3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
            </div>
            <h4>UI/UX Design</h4>
            <p>Create stunning user experiences and master design tools used by top agencies.</p>
            <span className="cat-count">64+ Courses</span>
          </div>

          <div className="category-card business">
            <div className="cat-icon-v3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
            <h4>Digital Marketing</h4>
            <p>Scale businesses with SEO, Social Media, and Performance Marketing strategies.</p>
            <span className="cat-count">92+ Courses</span>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-section">
        <div className="section-header-v2">
          <h2>Why Choose Our Platform?</h2>
          <p>We provide more than just courses; we build successful careers.</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon-circle">📜</div>
            <div className="why-info">
              <h5>Official Certification</h5>
              <p>Get recognized globally with certificates from the world's leading tech platform.</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon-circle">👨‍🏫</div>
            <div className="why-info">
              <h5>Expert Mentors</h5>
              <p>Learn directly from industry professionals working at top Silicon Valley firms.</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon-circle">♾️</div>
            <div className="why-info">
              <h5>Lifetime Access</h5>
              <p>Enroll once and get unlimited access to course materials anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING COURSES */}
      <section className="trending-section-v2">
        <div className="section-header-v2">
          <h2>Explore Trending Courses</h2>
          <p>The most popular skills our students are learning right now</p>
        </div>

        <div className="landing-course-grid-v2">
          {loading ? (
            <div className="loading-v2">Loading Top Courses...</div>
          ) : (
            trendingCourses.map((course) => (
              <div key={course._id} className="trending-card-v2">
                <div className="trending-thumb-v2">
                  <img src={course.thumbnailUrl || "/ai_ml_course.png"} alt={course.title} />
                  <div className="course-level-tag">{course.level || "Beginner"}</div>
                </div>
                <div className="trending-body-v2">
                  <h3>{course.title}</h3>
                  <p className="course-description-v2">
                    {course.description || "Master the latest industry skills with our comprehensive, project-based curriculum designed for both beginners and experts."}
                  </p>
                  <div className="course-meta-v2">
                    <span className="meta-item-badge meta-rating">
                      ⭐️ {course.rating || "4.8"}
                    </span>
                    <span className="meta-item-badge meta-students">
                      👥 {course.studentsEnrolled?.length || 0} Students
                    </span>
                  </div>
                  <Link to="/courses" className="trending-btn-v2">Start Learning Now</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="section-header-v2">
          <h2>Success Stories</h2>
          <p>Join the community of 10,000+ satisfied learners</p>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="user-top">
              <img src="https://i.pravatar.cc/150?u=1" alt="User" />
              <div>
                <h5>Siddharth R.</h5>
                <span>MERN Stack Student</span>
              </div>
            </div>
            <p>"The curriculum is exceptionally well-structured. I went from zero to building full-scale applications in just a few months."</p>
          </div>
          <div className="testimonial-card">
            <div className="user-top">
              <img src="https://i.pravatar.cc/150?u=2" alt="User" />
              <div>
                <h5>Ananya K.</h5>
                <span>UI/UX Designer</span>
              </div>
            </div>
            <p>"The hands-on projects and mentor support were game-changers for my career transition into tech!"</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta-section">
        <div className="cta-bg-gradient"></div>
        <div className="cta-content-v3">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of students and start your learning journey today. Get unlimited access to premium courses.</p>
          <div className="hero-action-group">
            <Link to="/register" className="glass-btn primary">Get Started for Free</Link>
            <Link to="/courses" className="glass-btn secondary">Explore All Courses</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
