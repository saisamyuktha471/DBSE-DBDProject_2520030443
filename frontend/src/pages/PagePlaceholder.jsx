function PagePlaceholder({ title, description }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon">
          ✓
        </div>

        <h1>{title}</h1>

        <p>{description}</p>

        <span>Page connected successfully</span>
      </div>
    </div>
  );
}

export default PagePlaceholder;