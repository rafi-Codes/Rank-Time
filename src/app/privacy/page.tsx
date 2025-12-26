// src/app/privacy/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Mail, Cookie } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
              <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">RankTime</h1>
            </Link>
            <div className="flex space-x-4">
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your privacy is important to us. Learn how we collect, use, and protect your data.
          </p>
        </div>

        <div className="space-y-6">
          {/* Last Updated */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                RankTime ("we," "us," or "our") respects your privacy and is committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                competitive programming tracking application.
              </p>
              <p>
                By using RankTime, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Name and email address (when you register or contact us)</li>
                  <li>Profile information from authentication providers (Google, GitHub)</li>
                  <li>Codeforces username (when you connect your Codeforces account)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Session data and login information</li>
                  <li>Problem-solving activities and time tracking</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bug Reports</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Name, email, and description provided in bug reports</li>
                  <li>Severity level and subject of the report</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Provide Services:</strong> To operate and maintain the RankTime application</li>
                <li><strong>Authentication:</strong> To verify your identity and manage your account</li>
                <li><strong>Personalization:</strong> To customize your experience and show relevant content</li>
                <li><strong>Communication:</strong> To respond to your inquiries and provide support</li>
                <li><strong>Improvement:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our application (e.g., database hosting, email services)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to the sharing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your
                personal information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Cookies and Tracking Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on RankTime. These technologies help us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Remember your preferences and settings</li>
                <li>Maintain your session and authentication status</li>
                <li>Analyze usage patterns to improve our services</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect
                the functionality of our application.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-out:</strong> Opt out of certain data processing activities</li>
              </ul>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                To exercise these rights, please contact us through the <Link href="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">contact page</Link>.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Email: <a href="mailto:rafi27hasan@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">rafi27hasan@gmail.com</a></li>
                <li>Contact Form: <Link href="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">rank-time.vercel.app/contact</Link></li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                Your continued use of RankTime after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
            <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
        </footer>
      </main>
    </div>
  );
}