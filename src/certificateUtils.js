export function generateCertificateId(courseId, studentName) {
  const cleanName = (studentName || "STU").replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `EDU-${year}-C${courseId}-${cleanName}-${randomSuffix}`;
}

export function downloadCertificatePNG(course, studentName, issueDate, certificateId) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");

  // Background Parchment / Luxury Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
  bgGrad.addColorStop(0, "#ffffff");
  bgGrad.addColorStop(0.3, "#fcfbf7");
  bgGrad.addColorStop(0.7, "#f9f6ed");
  bgGrad.addColorStop(1, "#f4efe2");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1100);

  // Subtle Watermark pattern / Guilloche circle
  ctx.save();
  ctx.strokeStyle = "rgba(217, 119, 6, 0.05)";
  ctx.lineWidth = 1.5;
  for (let r = 80; r <= 380; r += 30) {
    ctx.beginPath();
    ctx.arc(800, 550, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Outer Deep Navy Border
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, 1520, 1020);

  // Inner Gold Border
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, 1480, 980);

  // Fine Inner Accent Line
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(74, 74, 1452, 952);

  // Corner Ornaments
  const drawCorner = (x, y, dx, dy) => {
    ctx.save();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 35);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 35, y);
    ctx.stroke();

    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.arc(x + dx * 14, y + dy * 14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(85, 85, 1, 1);
  drawCorner(1515, 85, -1, 1);
  drawCorner(85, 1015, 1, -1);
  drawCorner(1515, 1015, -1, -1);

  // Academy Header
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("EDULEARN GLOBAL ACADEMY OF TECHNOLOGY", 800, 145);

  ctx.fillStyle = "#64748b";
  ctx.font = "600 13px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("ACCREDITED PROFESSIONAL ONLINE EDUCATION & SKILL MASTERY", 800, 172);

  // Decorative divider
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(620, 195);
  ctx.lineTo(980, 195);
  ctx.stroke();

  // Certificate Title
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 46px Georgia, 'Times New Roman', serif";
  ctx.fillText("CERTIFICATE OF COMPLETION", 800, 260);

  ctx.fillStyle = "#b45309";
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("WITH ACADEMIC DISTINCTION", 800, 295);

  ctx.fillStyle = "#475569";
  ctx.font = "italic 22px Georgia, serif";
  ctx.fillText("This is proudly and officially conferred upon", 800, 360);

  // Recipient / Student Name
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 54px Georgia, 'Times New Roman', serif";
  ctx.fillText(studentName || "Student Learner", 800, 435);

  // Name underline
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, 460);
  ctx.lineTo(1250, 460);
  ctx.stroke();

  // Description
  ctx.fillStyle = "#334155";
  ctx.font = "20px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(
    "for having successfully completed all coursework, interactive modules, practical labs,",
    800,
    510
  );
  ctx.fillText(
    "and rigorous knowledge evaluations to master:",
    800,
    540
  );

  // Course Name
  ctx.fillStyle = "#1d4ed8";
  ctx.font = "bold 44px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(course.name, 800, 615);

  // Category and duration
  ctx.fillStyle = "#64748b";
  ctx.font = "600 18px 'Segoe UI', Arial, sans-serif";
  ctx.fillText(
    `Specialization in ${course.category} • Official Duration: ${course.duration}`,
    800,
    660
  );

  // Golden Verified Seal in Center
  ctx.save();
  const sealX = 800;
  const sealY = 780;
  const sealRadius = 65;

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
  sealGrad.addColorStop(0, "#fef08a");
  sealGrad.addColorStop(0.5, "#f59e0b");
  sealGrad.addColorStop(1, "#b45309");
  ctx.fillStyle = sealGrad;
  ctx.fill();

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Seal inner ring
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealRadius - 8, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(120, 53, 15, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#78350f";
  ctx.font = "bold 32px Arial";
  ctx.fillText("★", sealX, sealY - 10);

  ctx.font = "bold 13px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("VERIFIED", sealX, sealY + 16);
  ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("COMPLETION", sealX, sealY + 32);
  ctx.restore();

  // Left Footer: Date & Certificate ID
  ctx.textAlign = "left";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Issue Date:", 160, 915);
  ctx.font = "16px 'Segoe UI', Arial, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.fillText(issueDate || new Date().toLocaleDateString(), 270, 915);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Certificate ID:", 160, 950);
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = "#2563eb";
  ctx.fillText(certificateId, 290, 950);

  // Right Footer: Academic Signatures
  ctx.textAlign = "center";
  
  // Instructor signature line
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(1100, 910);
  ctx.lineTo(1420, 910);
  ctx.stroke();

  ctx.fillStyle = "#1e3a8a";
  ctx.font = "italic bold 28px Georgia, serif";
  ctx.fillText("Sarah Jenkins, Ph.D.", 1260, 895);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Dr. Sarah Jenkins", 1260, 935);

  ctx.fillStyle = "#64748b";
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("Director of Academic Curriculum", 1260, 955);

  // Trigger file download
  const cleanStudent = (studentName || "Student").replace(/[^a-zA-Z0-9]/g, "_");
  const cleanCourse = (course.name || "Course").replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${cleanStudent}_${cleanCourse}_Certificate.png`;

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printCertificateWindow(course, studentName, issueDate, certificateId) {
  const printWindow = window.open("", "_blank", "width=1000,height=750");
  if (!printWindow) {
    alert("Please allow popups to print your certificate.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Certificate - ${course.name} - ${studentName}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 20px;
            font-family: 'Georgia', serif;
            background: #ffffff;
            color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cert-container {
            width: 95%;
            max-width: 900px;
            border: 8px solid #0f172a;
            outline: 3px solid #d97706;
            outline-offset: -12px;
            padding: 40px;
            text-align: center;
            background: #fffdfa;
            box-sizing: border-box;
            position: relative;
          }
          .cert-academy {
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 3px;
            color: #334155;
            margin-bottom: 6px;
          }
          .cert-sub {
            font-family: 'Segoe UI', sans-serif;
            font-size: 10px;
            letter-spacing: 1.5px;
            color: #64748b;
            margin-bottom: 24px;
          }
          .cert-title {
            font-size: 32px;
            font-weight: 700;
            color: #0f172a;
            margin: 10px 0 5px;
          }
          .cert-distinction {
            font-family: 'Segoe UI', sans-serif;
            font-size: 11px;
            font-weight: 700;
            color: #b45309;
            letter-spacing: 2px;
            margin-bottom: 25px;
          }
          .cert-presented {
            font-style: italic;
            font-size: 16px;
            color: #475569;
            margin-bottom: 15px;
          }
          .cert-name {
            font-size: 36px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 2px solid #cbd5e1;
            display: inline-block;
            padding: 0 40px 8px;
            margin-bottom: 20px;
          }
          .cert-desc {
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            color: #334155;
            max-width: 600px;
            margin: 0 auto 15px;
            line-height: 1.5;
          }
          .cert-course {
            font-family: 'Segoe UI', sans-serif;
            font-size: 26px;
            font-weight: 800;
            color: #1d4ed8;
            margin-bottom: 8px;
          }
          .cert-meta {
            font-family: 'Segoe UI', sans-serif;
            font-size: 12px;
            color: #64748b;
            margin-bottom: 30px;
          }
          .cert-seal {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: radial-gradient(circle, #fde047, #d97706);
            border: 3px solid #78350f;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #78350f;
            font-weight: 800;
            font-size: 9px;
            font-family: 'Segoe UI', sans-serif;
            margin-bottom: 20px;
          }
          .cert-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 12px;
            text-align: left;
          }
          .cert-sign-line {
            text-align: center;
          }
          .cert-sign {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 20px;
            font-weight: 700;
            color: #1e3a8a;
            border-bottom: 1px solid #475569;
            padding-bottom: 4px;
            margin-bottom: 4px;
          }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="cert-academy">EDULEARN GLOBAL ACADEMY OF TECHNOLOGY</div>
          <div class="cert-sub">ACCREDITED PROFESSIONAL ONLINE EDUCATION</div>
          <div class="cert-title">CERTIFICATE OF COMPLETION</div>
          <div class="cert-distinction">WITH ACADEMIC DISTINCTION</div>
          <div class="cert-presented">This is proudly and officially conferred upon</div>
          <div class="cert-name">${studentName || "Student Learner"}</div>
          <div class="cert-desc">for having successfully fulfilled all curriculum modules, practical projects, and rigorous assessments for:</div>
          <div class="cert-course">${course.name}</div>
          <div class="cert-meta">Specialization in ${course.category} • Duration: ${course.duration}</div>
          <div class="cert-seal">
            <span style="font-size:16px;">★</span>
            <span>VERIFIED</span>
          </div>
          <div class="cert-footer">
            <div>
              <div><strong>Issue Date:</strong> ${issueDate || new Date().toLocaleDateString()}</div>
              <div><strong>Certificate ID:</strong> ${certificateId}</div>
            </div>
            <div class="cert-sign-line">
              <div class="cert-sign">Sarah Jenkins, Ph.D.</div>
              <div><strong>Dr. Sarah Jenkins</strong></div>
              <div style="color: #64748b; font-size: 10px;">Academic Director</div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
