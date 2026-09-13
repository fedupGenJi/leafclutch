import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from '../components/ProfileMenu';
import CourseIcon from '../components/CourseIcon';
import CourseModal from '../components/CourseModal';
import BrandIcon from '../components/BrandMark';
import { COURSES, randomPrice } from '../data/courses';
import '../styles/dashboard.css';
import { isLoggedIn } from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  const prices = useMemo(
    () => Object.fromEntries(COURSES.map((c) => [c.slug, randomPrice()])),
    []
  );

  useEffect(() => {
    const token = localStorage.getItem('leaftech_token');
    const stored = localStorage.getItem('leaftech_user');
    if (!token || !stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-nav">
        <div className="container dashboard-nav-inner">
          <Link to={isLoggedIn() ? '/dashboard' : '/'} className="brand">
            <BrandIcon />
            LeafClutch
          </Link>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="container dashboard-main">
        <p className="dashboard-greeting">Welcome back, {user.name.split(' ')[0]}</p>
        <h1 className="dashboard-heading">Available courses</h1>

        <div className="course-grid">
          {COURSES.map((course) => (
            <button
              key={course.slug}
              type="button"
              className="course-card"
              onClick={() => setActiveCourse(course)}
            >
              <div className="course-icon">
                <CourseIcon slug={course.slug} />
              </div>
              <h3 className="course-name">{course.name}</h3>
              <p className="course-teaser">{course.teaser}</p>
            </button>
          ))}
        </div>
      </main>

      {activeCourse && (
        <CourseModal
          course={activeCourse}
          price={prices[activeCourse.slug]}
          onClose={() => setActiveCourse(null)}
        />
      )}
    </div>
  );
}
