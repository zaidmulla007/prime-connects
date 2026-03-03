<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\InquiriesModel;
use CodeIgniter\HTTP\ResponseInterface;

class Inquiries extends BaseController
{
    /**
     * POST /api/public/inquiries
     */
    public function create(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $name     = trim($data['name'] ?? '');
        $email    = trim($data['email'] ?? '');
        $message  = trim($data['message'] ?? '');

        if (!$name || !$email || !$message) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Name, email, and message are required.']);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->response->setStatusCode(422)->setJSON(['error' => 'Invalid email address.']);
        }

        $model = new InquiriesModel();

        $id = $model->insert([
            'name'         => $name,
            'email'        => $email,
            'phone'        => $data['phone'] ?? '',
            'subject'      => $data['subject'] ?? '',
            'message'      => $message,
            'company'      => $data['company'] ?? '',
            'product_name' => $data['product_name'] ?? '',
            'form_type'    => in_array($data['form_type'] ?? '', ['inquiry', 'consultation', 'contact'])
                                ? $data['form_type']
                                : 'inquiry',
            'is_read'      => 0,
            'created_at'   => date('Y-m-d H:i:s'),
        ]);

        // Send email notification (fire and forget)
        try {
            $this->sendNotification([
                'id'           => $id,
                'name'         => $name,
                'email'        => $email,
                'phone'        => $data['phone'] ?? '',
                'subject'      => $data['subject'] ?? '',
                'message'      => $message,
                'company'      => $data['company'] ?? '',
                'product_name' => $data['product_name'] ?? '',
                'form_type'    => $data['form_type'] ?? 'inquiry',
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Inquiry email failed: ' . $e->getMessage());
        }

        return $this->response->setStatusCode(201)->setJSON([
            'id'      => $id,
            'message' => 'Your enquiry has been received. We will contact you shortly.',
        ]);
    }

    private function sendNotification(array $inquiry): void
    {
        $notifyTo = env('INQUIRY_NOTIFY_TO', '');
        if (!$notifyTo) return;

        $emailService = \Config\Services::email();

        $subject = "[Prime Connects] New {$inquiry['form_type']} from {$inquiry['name']}";

        $body  = "<h2>New Enquiry #{$inquiry['id']}</h2>";
        $body .= "<p><strong>Type:</strong> " . ucfirst($inquiry['form_type']) . "</p>";
        $body .= "<p><strong>Name:</strong> {$inquiry['name']}</p>";
        $body .= "<p><strong>Email:</strong> {$inquiry['email']}</p>";
        $body .= "<p><strong>Phone:</strong> " . ($inquiry['phone'] ?: 'N/A') . "</p>";
        $body .= "<p><strong>Company:</strong> " . ($inquiry['company'] ?: 'N/A') . "</p>";
        $body .= "<p><strong>Product:</strong> " . ($inquiry['product_name'] ?: 'N/A') . "</p>";
        $body .= "<p><strong>Subject:</strong> " . ($inquiry['subject'] ?: 'N/A') . "</p>";
        $body .= "<hr><p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($inquiry['message'])) . "</p>";

        $toAddresses = array_map('trim', explode(',', $notifyTo));

        $emailService->setTo($toAddresses[0]);
        if (count($toAddresses) > 1) {
            $emailService->setCC(array_slice($toAddresses, 1));
        }

        $bcc = env('INQUIRY_BCC', '');
        if ($bcc) $emailService->setBCC($bcc);

        $replyTo = env('INQUIRY_REPLY_TO', $inquiry['email']);
        $emailService->setReplyTo($replyTo);
        $emailService->setSubject($subject);
        $emailService->setMessage($body);
        $emailService->send();
    }
}
