export const getRedirectTemplate = (destinationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecting...</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f1f5f9;
          background-image: radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.06) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.06) 0px, transparent 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
        }
        .card {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          padding: 40px 30px;
          border-radius: 24px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
          text-align: center;
          max-width: 440px;
          width: 90%;
          animation: fadeIn 0.5s ease-out;
        }
        h1 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px 0;
        }
        p {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }
        .url-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #2563eb;
          word-break: break-all;
          margin-bottom: 24px;
        }
        .btn {
          background: linear-gradient(to right, #2563eb, #4f46e5);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.15);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Leaving SnapUrl</h1>
        <p>You are being redirected to an external link. Please verify the destination domain is safe before proceeding.</p>
        <div class="url-box">${destinationUrl}</div>
        <a href="${destinationUrl}" class="btn">Proceed to Link</a>
      </div>
    </body>
    </html>
  `;
};
