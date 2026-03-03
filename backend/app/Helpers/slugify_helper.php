<?php

if (!function_exists('generate_unique_slug')) {
    /**
     * Generate a URL-safe slug from a name and ensure it is unique in the DB.
     */
    function generate_unique_slug(string $name, string $table, string $field = 'slug', int $maxLen = 200): string
    {
        $db = \Config\Database::connect();

        // 1. Normalize whitespace
        $slug = trim(preg_replace('/\s+/', ' ', $name));

        // 2. Transliterate UTF-8 → ASCII
        if (function_exists('iconv')) {
            $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $slug) ?: $slug;
        }

        // 3. Lowercase
        $slug = strtolower($slug);

        // 4. Replace non-alphanumeric with hyphen
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);

        // 5. Trim + collapse hyphens
        $slug = trim(preg_replace('/-+/', '-', $slug), '-');

        // 6. Max length
        if (strlen($slug) > $maxLen) {
            $slug = substr($slug, 0, $maxLen);
        }

        // 7. Fallback
        if ($slug === '') {
            $slug = 'item';
        }

        // 8. Check uniqueness
        $candidate = $slug;
        $counter   = 2;
        while ($db->table($table)->where($field, $candidate)->countAllResults() > 0) {
            $candidate = $slug . '-' . $counter;
            $counter++;
        }

        return $candidate;
    }
}
