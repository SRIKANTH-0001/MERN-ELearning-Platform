/**
 * Certificate HTML template
 * @param {String} studentName
 * @param {String} courseTitle
 * @param {String} certificateId
 * @param {String} date
 * @returns {String} HTML
 */
const certificateTemplate = (
  studentName,
  courseTitle,
  certificateId,
  date
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
          border: 10px solid #2c3e50;
        }
        h1 {
          color: #2c3e50;
        }
        .certificate-id {
          margin-top: 20px;
          font-size: 12px;
          color: gray;
        }
      </style>
    </head>
    <body>
      <h1>Certificate of Completion</h1>
      <p>This is to certify that</p>
      <h2>${studentName}</h2>
      <p>has successfully completed the course</p>
      <h3>${courseTitle}</h3>
      <p>Date: ${date}</p>
      <div class="certificate-id">
        Certificate ID: ${certificateId}
      </div>
    </body>
    </html>
  `;
};

module.exports = certificateTemplate;
