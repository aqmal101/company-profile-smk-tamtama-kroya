"use client";

import { BaseModal } from "../BaseModal";

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Extract video ID from YouTube URL
  const videoUrl = "https://youtu.be/ZrENGBxv5cg?si=VlwJaA0cye0QKbzK";
  const videoId = videoUrl.split("/").pop()?.split("?")[0];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tutorial Pendaftaran Calon Murid Baru SMK Tamtama Kroya"
      size="full"
      className="z-50"
    >
      <div className="w-full aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Tutorial Pendaftaran Calon Murid Baru SMK Tamtama Kroya"
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </BaseModal>
  );
};
