import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

// Import jsPDF differently to handle Vite bundling
let jsPDF;

const CertificateViewer = ({ studentName, studentProfession, courseTitle, certificateId }) => {
  const certificateRef = useRef();

  const downloadPDF = async () => {
    alert("Button clicked! Check console for details.");
    console.log("=== DOWNLOAD BUTTON CLICKED ===");
    console.log("Student Name:", studentName);
    console.log("Course Title:", courseTitle);

    if (!studentName || !courseTitle || courseTitle === "Select a Course" || courseTitle === "") {
      toast.warning("Please enter your name and select a course first!");
      return;
    }

    const loadingToast = toast.loading("Generating your PDF certificate...");

    try {
      console.log("Step 1: Loading jsPDF library...");

      // Load jsPDF dynamically
      if (!jsPDF) {
        try {
          const jsPDFModule = await import("jspdf");
          jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
          console.log("jsPDF loaded successfully:", typeof jsPDF);
        } catch (err) {
          console.error("Failed to load jsPDF:", err);
          throw new Error("PDF library failed to load. Please refresh the page.");
        }
      }

      console.log("Step 2: Waiting for rendering...");
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("Step 3: Getting certificate element...");
      const element = certificateRef.current;
      if (!element) {
        throw new Error("Certificate element not found in DOM");
      }
      console.log("Element found:", element.offsetWidth, "x", element.offsetHeight);

      console.log("Step 4: Capturing with html2canvas...");
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff"
      });

      console.log("Step 5: Canvas created:", canvas.width, "x", canvas.height);

      console.log("Step 6: Converting to image data...");
      const imgData = canvas.toDataURL("image/png");
      console.log("Image data length:", imgData.length);

      console.log("Step 7: Creating PDF document...");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      console.log("PDF dimensions:", pdfWidth, "x", pdfHeight);

      console.log("Step 8: Adding image to PDF...");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `Certificate_${studentName.replace(/\s+/g, '_')}.pdf`;
      console.log("Step 9: Saving PDF as:", fileName);
      pdf.save(fileName);

      toast.update(loadingToast, {
        render: "✅ Certificate downloaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      console.log("=== PDF DOWNLOAD COMPLETE ===");

    } catch (error) {
      console.error("=== PDF GENERATION ERROR ===");
      console.error("Error:", error);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);

      toast.update(loadingToast, {
        render: `❌ ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px',
      padding: '20px',
      width: '100%'
    }}>
      {/* Certificate */}
      <div
        ref={certificateRef}
        style={{
          width: '1000px',
          height: '707px',
          background: '#ffffff',
          position: 'relative',
          boxSizing: 'border-box',
          border: '12px solid #1a365d',
          outline: '4px solid #d4af37',
          outlineOffset: '-8px',
          boxShadow: '0 10px 50px rgba(0,0,0,0.3)',
          padding: '45px 55px 55px 55px'
        }}
      >
        {/* Corner Decorations */}
        <div style={{ position: 'absolute', top: '25px', left: '25px', width: '70px', height: '70px', borderTop: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }}></div>
        <div style={{ position: 'absolute', top: '25px', right: '25px', width: '70px', height: '70px', borderTop: '3px solid #d4af37', borderRight: '3px solid #d4af37' }}></div>
        <div style={{ position: 'absolute', bottom: '25px', left: '25px', width: '70px', height: '70px', borderBottom: '3px solid #d4af37', borderLeft: '3px solid #d4af37' }}></div>
        <div style={{ position: 'absolute', bottom: '25px', right: '25px', width: '70px', height: '70px', borderBottom: '3px solid #d4af37', borderRight: '3px solid #d4af37' }}></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{
            fontSize: '46px',
            margin: '0 0 10px 0',
            color: '#1a365d',
            letterSpacing: '6px',
            fontWeight: '900',
            fontFamily: 'Arial, sans-serif'
          }}>
            MERN ACADEMY
          </h1>
          <div style={{
            width: '320px',
            height: '3px',
            background: 'linear-gradient(to right, transparent, #d4af37, transparent)',
            margin: '0 auto 10px auto'
          }}></div>
          <p style={{
            fontSize: '14px',
            color: '#333',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            margin: '0',
            fontFamily: 'Arial, sans-serif'
          }}>
            Certificate of Achievement
          </p>
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <p style={{
            fontSize: '19px',
            fontStyle: 'italic',
            margin: '0 0 12px 0',
            color: '#000',
            fontFamily: 'Georgia, serif'
          }}>
            This is to certify that
          </p>

          <h2 style={{
            fontSize: '50px',
            margin: '8px 0',
            borderBottom: '3px solid #000',
            paddingBottom: '8px',
            display: 'inline-block',
            minWidth: '450px',
            maxWidth: '700px',
            fontFamily: 'Georgia, serif',
            color: '#000',
            fontWeight: '700'
          }}>
            {studentName}
          </h2>

          <p style={{
            fontSize: '16px',
            color: '#d4af37',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            margin: '10px 0 20px 0',
            fontFamily: 'Arial, sans-serif'
          }}>
            {studentProfession || "Full Stack Developer"}
          </p>

          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#000',
            fontWeight: '500',
            margin: '0 auto 18px auto',
            maxWidth: '650px',
            fontFamily: 'Arial, sans-serif'
          }}>
            has successfully completed the comprehensive training program and demonstrated exceptional mastery in
          </p>

          <div style={{
            fontSize: '27px',
            color: '#1a365d',
            fontWeight: '800',
            padding: '12px 25px',
            background: 'rgba(212, 175, 55, 0.12)',
            border: '2px solid #d4af37',
            borderRadius: '6px',
            display: 'inline-block',
            maxWidth: '750px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.3',
            margin: '0 auto'
          }}>
            {courseTitle}
          </div>
        </div>

        {/* Footer - Fixed positioning */}
        <div style={{
          position: 'absolute',
          bottom: '55px',
          left: '55px',
          right: '55px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          {/* Left: Director */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ borderTop: '2px solid #000', paddingTop: '8px' }}>
              <p style={{
                fontSize: '15px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: '#000',
                fontFamily: 'Arial, sans-serif'
              }}>
                Dr. Alan Turing
              </p>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0',
                fontFamily: 'Arial, sans-serif'
              }}>
                Director of Education
              </p>
            </div>
          </div>

          {/* Center: Seal */}
          <div style={{
            width: '95px',
            height: '95px',
            border: '4px double #d4af37',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#d4af37',
            fontWeight: 'bold',
            fontSize: '13px',
            background: '#fff',
            boxShadow: '0 0 12px rgba(212,175,55,0.4)',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.2'
          }}>
            OFFICIAL<br />SEAL
          </div>

          {/* Right: Date */}
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ borderTop: '2px solid #000', paddingTop: '8px' }}>
              <p style={{
                fontSize: '15px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: '#000',
                fontFamily: 'Arial, sans-serif'
              }}>
                {new Date().toLocaleDateString()}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: '0',
                fontFamily: 'Arial, sans-serif'
              }}>
                Date of Issue
              </p>
            </div>
          </div>
        </div>

        {/* Verification ID */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          color: '#999',
          fontFamily: 'Arial, sans-serif'
        }}>
          Verification ID: {certificateId}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPDF}
        type="button"
        style={{
          background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
          color: '#fff',
          padding: '18px 50px',
          borderRadius: '50px',
          border: 'none',
          fontSize: '19px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(26, 54, 93, 0.35)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'Arial, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(26, 54, 93, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(26, 54, 93, 0.35)';
        }}
      >
        <span style={{ fontSize: '24px' }}>📄</span>
        Download Your Certificate (PDF)
      </button>
    </div>
  );
};

export default CertificateViewer;
