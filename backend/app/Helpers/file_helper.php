<?php

if (!function_exists('upload_file')) {
    /**
     * Upload a file from a $_FILES-style array.
     *
     * @param  array  $fileArray  Single file from $_FILES
     * @param  string $subdir     Subdirectory under public/uploads/
     * @param  array  $options    ['max_size' => bytes, 'allowed' => [mime...]]
     * @return array  ['path' => '/uploads/...', 'filename' => '...'] or ['error' => '...']
     */
    function upload_file(array $fileArray, string $subdir = 'products', array $options = []): array
    {
        $maxSize  = $options['max_size'] ?? 5 * 1024 * 1024; // 5 MB
        $allowed  = $options['allowed']  ?? ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (empty($fileArray['tmp_name']) || $fileArray['error'] !== UPLOAD_ERR_OK) {
            return ['error' => 'No file uploaded or upload error.'];
        }

        if ($fileArray['size'] > $maxSize) {
            return ['error' => 'File exceeds maximum allowed size of ' . ($maxSize / 1024 / 1024) . 'MB.'];
        }

        // MIME validation via finfo
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = finfo_file($finfo, $fileArray['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowed, true)) {
            return ['error' => 'Invalid file type: ' . $mime];
        }

        // Determine extension from MIME
        $extMap = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/gif'  => 'gif',
        ];
        $ext = $extMap[$mime] ?? 'bin';

        $filename = uniqid('f_', true) . '.' . $ext;
        $uploadDir = FCPATH . 'uploads' . DIRECTORY_SEPARATOR . $subdir . DIRECTORY_SEPARATOR;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $dest = $uploadDir . $filename;

        if (!move_uploaded_file($fileArray['tmp_name'], $dest)) {
            return ['error' => 'Failed to move uploaded file.'];
        }

        return [
            'path'     => '/uploads/' . $subdir . '/' . $filename,
            'filename' => $filename,
        ];
    }
}

if (!function_exists('remove_file')) {
    /**
     * Remove an uploaded file by its relative path.
     * Prevents directory traversal attacks.
     */
    function remove_file(string $relativePath, string $subdir = 'products'): bool
    {
        // Strip leading slash
        $relativePath = ltrim($relativePath, '/');

        // Prevent traversal
        if (strpos($relativePath, '..') !== false) {
            return false;
        }

        $allowed = 'uploads/' . $subdir . '/';
        if (strpos($relativePath, $allowed) !== 0) {
            return false;
        }

        $fullPath = FCPATH . $relativePath;
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        return false;
    }
}
