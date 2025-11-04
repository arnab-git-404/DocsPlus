
// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { PDFViewer } from '@react-pdf/renderer';
// import { InvoiceDocument } from '@/components/templates/Invoice';
// import { OfferLetterDocument } from '@/components/templates/OfferLetter';
// import { SalarySlipDocument } from '@/components/templates/SalarySlip';


// export default function InvoicePDFPage() {
//   const params = useParams();
//   const [data, setData] = useState<any>(null);

//   useEffect(() => {
//     fetch(`/api/invoice/${params.id}`)
//       .then(res => res.json())
//       .then(result => setData(result.invoice));
//   }, [params.id]);

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
//           <p className="mt-4">Loading invoice...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-screen">
//       <PDFViewer width="100%" height="100%" showToolbar={true}>
//         <InvoiceDocument data={data} />
//       </PDFViewer>
//     </div>
//   );
// }



"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/components/templates/Invoice';
import { OfferLetterDocument } from '@/components/templates/OfferLetter';
import { SalarySlipDocument } from '@/components/templates/SalarySlip';

function PDFPreviewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'invoice', 'offer-letter', 'salary-slip'
  const id = searchParams.get('id');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type || !id) {
      setError('Missing type or id parameter');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        
        switch (type) {
          case 'invoice':
            endpoint = `/api/invoice/${id}`;
            break;
          case 'offer-letter':
            endpoint = `/api/offer-letters/${id}`;
            break;
          case 'salary-slip':
            endpoint = `/api/salary-slips/${id}`;
            break;
          default:
            setError('Invalid document type');
            setLoading(false);
            return;
        }

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch document');
        
        const result = await response.json();
        
        // Extract data based on type
        switch (type) {
          case 'invoice':
            setData(result.invoice);
            break;
          case 'offer-letter':
            setData(result.offerLetter);
            break;
          case 'salary-slip':
            setData(result.salarySlip);
            break;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document');
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-4">
            {error || 'Document not found'}
          </p>
          <button 
            onClick={() => window.close()} 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const renderPDFDocument = () => {
    switch (type) {
      case 'invoice':
        return <InvoiceDocument data={data} />;
      
      case 'offer-letter':
        return <OfferLetterDocument data={data} />;
      
      case 'salary-slip':
        return <SalarySlipDocument data={data} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen">
      <PDFViewer width="100%" height="100%" showToolbar={true}>
        {renderPDFDocument()}
      </PDFViewer>
    </div>
  );
}

export default function PDFPreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    }>
      <PDFPreviewContent />
    </Suspense>
  );
}