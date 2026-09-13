const PATHS = {
  'ai-ml': (
    <>
      <circle cx="17" cy="17" r="4" />
      <circle cx="31" cy="17" r="4" />
      <circle cx="24" cy="31" r="4" />
      <path d="M20 19l4 8M28 19l-4 8M21 17h6" />
    </>
  ),
  'web-development': (
    <>
      <path d="M17 15l-8 9 8 9" />
      <path d="M31 15l8 9-8 9" />
      <path d="M27 12l-6 24" />
    </>
  ),
  cybersecurity: (
    <>
      <path d="M24 8l14 6v10c0 9-6 15-14 18-8-3-14-9-14-18V14z" />
      <path d="M18 24l4 4 8-8" />
    </>
  ),
  'ui-ux-design': (
    <>
      <rect x="10" y="12" width="28" height="20" rx="3" />
      <path d="M10 19h28" />
      <circle cx="20" cy="30" r="1.4" fill="currentColor" stroke="none" />
      <path d="M26 30h8" />
    </>
  ),
  'graphic-designing': (
    <>
      <path d="M12 34l4-11 16-16 7 7-16 16-11 4z" />
      <path d="M27 11l7 7" />
    </>
  ),
  'data-science': (
    <>
      <path d="M12 34V22M22 34V14M32 34v-8" />
      <path d="M8 34h32" />
    </>
  )
};

export default function CourseIcon({ slug }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {PATHS[slug]}
    </svg>
  );
}
