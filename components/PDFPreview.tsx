"use client";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { useState, useEffect } from "react";

interface PDFPreviewProps {
  documentComponent: React.ReactElement;
  fileName: string;
  title: string;
  subtitle?: string;
}

export default function PDFPreview({ 
  documentComponent, 
  fileName, 
  title,
  subtitle 
}: PDFPreviewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {isClient && (
            <PDFDownloadLink
              document={documentComponent}
              fileName={fileName}
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded transition-colors duration-200 inline-flex items-center gap-2"
            >
              {({ loading }) =>
                loading ? 'Preparing...' : 'Download PDF'
              }
            </PDFDownloadLink>
          )}
        </div>

        <div className="bg-white rounded shadow-lg">
          <PDFViewer width="100%" height="900" className="border-0 rounded">
            {documentComponent}
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}