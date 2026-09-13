const COURSES = [
  { slug: 'ai-ml', name: 'AI and ML' },
  { slug: 'web-development', name: 'Web Development' },
  { slug: 'cybersecurity', name: 'CyberSecurity' },
  { slug: 'ui-ux-design', name: 'UI/UX Design' },
  { slug: 'graphic-designing', name: 'Graphic Designing' },
  { slug: 'data-science', name: 'Data Science' }
];

function findCourse(slug) {
  return COURSES.find((c) => c.slug === slug) || null;
}

module.exports = { COURSES, findCourse };