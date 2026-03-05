type FormHeaderProps = {
  title: string;
  subtitle: string;
  step?: number;
  totalSteps?: number;
};

export function FormHeader({ title, subtitle, step, totalSteps }: FormHeaderProps) {
  const showProgress = step !== undefined && totalSteps !== undefined && totalSteps > 0;
  const progressPct = showProgress ? Math.round((step / totalSteps) * 100) : 0;

  return (
    <header className="form-header">
      <h1 className="heading" style={{ fontFamily: "var(--font-heading), sans-serif" }}>
        {title}
      </h1>
      <p className="subheading">{subtitle}</p>
      {showProgress && (
        <>
          <div className="form-progress">
            <div className="form-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="form-step-label">
            Step {step} of {totalSteps}
          </p>
        </>
      )}
    </header>
  );
}
