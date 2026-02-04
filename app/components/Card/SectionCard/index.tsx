import { TextButton } from "@/components/Buttons/TextButton";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  leftButton?: React.ReactNode;
  isCancelButton?: boolean;
  handleSaveChanges: () => void;
}

export const SectionCard = ({
  title = "",
  children,
  leftButton,
  isCancelButton = false,
  handleSaveChanges,
}: SectionCardProps) => {
  return (
    <div className="w-1/2 shadow-lg rounded-md">
      {title && (
        <div className="w-full h-fit border-b border-b-gray-400 px-4">
          <h3 className="font-semibold text-gray-800 py-3">{title}</h3>
        </div>
      )}
      <div className="w-full h-fit">{children}</div>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        {isCancelButton ? (
          <TextButton
            variant="primary"
            text="Simpan Perubahan"
            onClick={handleSaveChanges}
          />
        ) : (
          leftButton
        )}

        <TextButton
          variant="primary"
          text="Simpan Perubahan"
          onClick={handleSaveChanges}
        />
      </div>
    </div>
  );
};
