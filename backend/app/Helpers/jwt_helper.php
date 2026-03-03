<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (!function_exists('jwt_issue')) {
    /**
     * Issue a signed JWT token for a user.
     */
    function jwt_issue(array $user, int $ttl = 0): string
    {
        if ($ttl === 0) {
            $ttl = (int) env('JWT_TTL', 21600);
        }
        $secret = env('JWT_SECRET', '');
        $now    = time();

        $payload = [
            'iat'   => $now,
            'exp'   => $now + $ttl,
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }
}

if (!function_exists('jwt_decode_token')) {
    /**
     * Decode and validate a JWT token, returning the payload as array.
     * Throws exception on invalid/expired token.
     */
    function jwt_decode_token(string $token): array
    {
        $secret  = env('JWT_SECRET', '');
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        return (array) $decoded;
    }
}
