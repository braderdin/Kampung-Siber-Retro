"use client";

import { useRef } from 'react';
import { CyberICMetadata, formatICNumber } from '@/types/cyberIC';

interface CyberIcPrintFrameProps {
  metadata: CyberICMetadata;
  className?: string;
}

export default function CyberIcPrintFrame({ metadata, className }: CyberIcPrintFrameProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    
    const printContent = printRef.current?.outerHTML || '';
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cyber IC - ${metadata.citizenName}</title>
        <style>
          @media print {
            @page {
              size: 3in 2in;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .print-card {
              width: 3in;
              height: 2in;
              padding: 0.15in;
              box-sizing: border-box;
              font-family: monospace;
              font-size: 6px;
              border: 1px solid #000;
              background: #f5f5f5;
            }
            .print-header {
              text-align: center;
              font-weight: bold;
              font-size: 8px;
              margin-bottom: 0.1in;
              border-bottom: 1px solid #000;
              padding-bottom: 0.05in;
            }
            .print-row {
              margin-bottom: 0.05in;
            }
            .print-label {
              font-weight: bold;
              display: inline-block;
              width: 0.8in;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-card">
          <div class="print-header">KAMPUNG SIBER RETRO</div>
          <div class="print-row"><span class="print-label">Nama:</span> ${metadata.citizenName}</div>
          <div class="print-row"><span class="print-label">IC:</span> ${formatICNumber(metadata.icNumber)}</div>
          <div class="print-row"><span class="print-label">Jawatan:</span> ${metadata.activeTitle}</div>
          <div class="print-row"><span class="print-label">Zon:</span> ${metadata.villageZone}</div>
          <div class="print-row"><span class="print-label">Tarikh:</span> ${metadata.registrationDate}</div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className={`print-preview-container ${className || ''}`}>
      <button
        onClick={handlePrint}
        className="retro-btn-secondary text-xs px-2 py-1 flex items-center gap-1"
      >
        <span>🖨️</span>
        <span>Cetak Fizikal</span>
      </button>
      
      <div ref={printRef} className="hidden print-card-for-reference">
        <div className="print-header">KAMPUNG SIBER RETRO</div>
        <div className="print-row"><span className="print-label">Nama:</span> {metadata.citizenName}</div>
        <div className="print-row"><span className="print-label">IC:</span> {formatICNumber(metadata.icNumber)}</div>
        <div className="print-row"><span className="print-label">Jawatan:</span> {metadata.activeTitle}</div>
        <div className="print-row"><span className="print-label">Zon:</span> {metadata.villageZone}</div>
        <div className="print-row"><span className="print-label">Tarikh:</span> {metadata.registrationDate}</div>
      </div>
    </div>
  );
}
