"use client";

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-600">
          🔐 Memeriksa izin akses halaman...
        </p>
      </div>
    </div>
  );
}
