export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}> = ({ title, subtitle, align = "center" }) => {
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <div
      className={`${alignClass} w-full h-fit mb-8 sm:mb-10 lg:mb-12 space-y-2 sm:space-y-3 lg:space-y-4`}
    >
      <div className="w-full h-fit">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <h2
            className="text-sm sm:text-base lg:text-lg text-gray-600"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
    </div>
  );
};
