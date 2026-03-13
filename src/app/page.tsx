'use client'

import { FileUploader } from '@/components/upload/file-uploader'

export default function UploadPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">파일 업로드</h1>
      <FileUploader />
    </div>
  )
}
