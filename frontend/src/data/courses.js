export const COURSES = [
  {
    slug: 'ai-ml',
    name: 'AI and ML',
    teaser: 'Build and train real machine learning models.',
    description:
      'Go from the fundamentals of machine learning to building, training and deploying your own models. Work with real datasets, learn neural networks, and finish with a capstone project you can show employers.'
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    teaser: 'Ship full-stack apps with modern tools.',
    description:
      'Learn HTML, CSS, JavaScript, a modern frontend framework, and a backend stack end to end. You will design, build and deploy a full-stack web application from scratch by the end of the course.'
  },
  {
    slug: 'cybersecurity',
    name: 'CyberSecurity',
    teaser: 'Think like an attacker, defend like a pro.',
    description:
      'Cover network security, ethical hacking, and common attack techniques through hands-on labs. You will practice on real vulnerable systems in a safe environment and learn how to secure them.'
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    teaser: 'Design products people enjoy using.',
    description:
      'Learn user research, wireframing, prototyping and visual design. You will design a complete product from a blank page to a polished, testable prototype using industry-standard tools.'
  },
  {
    slug: 'graphic-designing',
    name: 'Graphic Designing',
    teaser: 'Craft visuals with a real design system.',
    description:
      'Master typography, color theory, layout and branding. Build a portfolio of real design work including posters, social media assets and a complete brand identity project.'
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    teaser: 'Turn raw data into real decisions.',
    description:
      'Learn statistics, data cleaning, visualization and predictive modeling with Python. You will work through real-world datasets and present findings the way working data scientists do.'
  }
];

export function randomPrice() {
  return Math.floor(Math.random() * (12000 - 5000 + 1)) + 5000;
}

export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}
