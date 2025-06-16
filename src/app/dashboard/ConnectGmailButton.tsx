'use client';

export default function ConnectGmailButton() {
  const handleClick = () => {
    window.location.href = '/api/gmail/auth-url';
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
    >
      Verbind met Gmail
    </button>
  );
}
