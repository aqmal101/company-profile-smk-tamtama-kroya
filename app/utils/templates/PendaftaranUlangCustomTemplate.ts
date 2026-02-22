import {
  PendaftaranUlangTemplate as PackagePendaftaranUlangTemplate,
} from "@tamtama-lab/pdf-templates";
import { createHeaderSection } from "@tamtama-lab/pdf-templates/sections/header";
import type { Content } from "pdfmake/interfaces";

type Registration = ConstructorParameters<typeof PackagePendaftaranUlangTemplate>[0];

export interface CustomSignatureInfo {
  name: string;
  position: string;
  title?: string;
  place?: string;
  date?: string | Date;
  signatureImage?: string;
  stampImage?: string;
  stampSize?: "small" | "big";
  nip?: string | null;
}

export class PendaftaranUlangCustomTemplate extends Array<Content> {
  constructor(
    registration: Registration,
    signature?: CustomSignatureInfo,
  ) {
    super();

    this.push({
      margin: [55, 40, 55, 40],
      font: "Tahoma",
      fontSize: 11,
      stack: [
        createHeaderSection(),
        { text: "", margin: [0, 340, 0, 0] },
        this.createFooterSection(signature),
      ],
    });
  }


  private createFooterSection(signature?: CustomSignatureInfo): Content {
    if (!signature) {
      return {
        stack: [
          {
            absolutePosition: { x: 300, y: 560 },
            columns: [
              {
                width: 220,
                stack: [
                  { text: "Kroya, ............................. 2026", alignment: "center" },
                  { text: "Panitia Sistem Penerimaan Murid Baru", alignment: "center" },
                  {
                    text: "Ketua",
                    alignment: "center",
                    margin: [0, 5, 0, 0],
                  },
                ],
              },
            ],
          },
          {
            absolutePosition: { x: 300, y: 710 },
            columns: [
              {
                width: 220,
                text: "Waluyo Raharjo, S.Pd",
                bold: true,
                decoration: "underline",
                alignment: "center",
              },
            ],
          },
        ],
      };
    }

    const signatureDate = formatSignatureDate(signature.date);
    const hasSignatureDate = signature.place && signatureDate;
    const isBigStamp = signature.stampSize === "big";
    const rightBlockX = 300;
    const textBlockY = 560;
    const signatureImageY = 640;
    const stampImageY = isBigStamp ? 598 : 610;
    const nameY = 710;
    const nipY = 733;

    const signatureStack: Content[] = [];

    if (hasSignatureDate) {
      signatureStack.push({
        text: `${signature.place}, ${signatureDate}`,
        alignment: "center",
      });
    }

    if (signature.title) {
      signatureStack.push({
        text: signature.title,
        alignment: "center",
      });
    }

    signatureStack.push({
      text: signature.position,
      alignment: "center",
      margin: [0, 6, 0, 0],
    });

    return {
      stack: [
        {
          lineHeight: 1.2,
          absolutePosition: { x: rightBlockX, y: textBlockY },
          columns: [
            {
              width: 220,
              stack: signatureStack,
            },
          ],
        },
        ...(signature.signatureImage
          ? [
              {
                image: signature.signatureImage,
                fit: [105, 60],
                absolutePosition: { x: rightBlockX + 70, y: signatureImageY },
              } as Content,
            ]
          : []),
        ...(signature.stampImage
          ? [
              {
                image: signature.stampImage,
                width: isBigStamp ? 112 : 92,
                height: isBigStamp ? 112 : 92,
                absolutePosition: {
                  x: rightBlockX + 20,
                  y: stampImageY,
                },
              } as Content,
            ]
          : []),
        {
          absolutePosition: { x: rightBlockX, y: nameY },
          columns: [
            {
              width: 220,
              text: signature.name,
              bold: true,
              decoration: "underline",
              alignment: "center",
            },
          ],
        },
        ...(signature.nip
          ? [
              {
                absolutePosition: { x: rightBlockX, y: nipY },
                columns: [
                  {
                    width: 220,
                    text: `NIP. ${signature.nip}`,
                    alignment: "center",
                  },
                ],
              } as Content,
            ]
          : []),
      ],
    };
  }
}

function formatSignatureDate(value?: string | Date): string | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
