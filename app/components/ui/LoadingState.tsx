import { LuLoader } from "react-icons/lu";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Memuat data...",
}) => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4px)] bg-gray-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <LuLoader className="animate-spin text-4xl text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
