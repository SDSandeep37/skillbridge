import "./banner.css";

const Banner = () => {
  return (
    <div className="banner__container flex items-center justify-center">
      <div className="banner__container-image">
        <img src="/banner.png" alt="Skill Bridge" />
      </div>
      <div className="banner__container-content">
        <h1>Welcome to SkillBridge</h1>
        <p>Connect, Learn, and Grow with Mentors and Students</p>
        <article>
          Bridge the gap between knowledge and opportunity. Join our community
          of passionate learners and experienced mentors dedicated to your
          success.
        </article>
        <div className="banner__container-buttons">
          <button>Get Started</button>
          <button>Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
