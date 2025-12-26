// src/app/terms/page.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
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
              <Link href="/privacy">
                <Button variant="outline" size="sm">
                  Privacy
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
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please read these terms carefully before using RankTime.
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

          {/* Agreement to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                By accessing and using RankTime ("the Service"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and RankTime. By using the Service,
                you represent that you are at least 13 years old and have the legal capacity to enter into these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                RankTime is a competitive programming tracking and productivity application that helps users monitor their
                problem-solving activities, track time spent on coding challenges, and analyze their performance.
              </p>
              <p>
                The Service includes features such as:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Stopwatch and timer functionality for tracking coding sessions</li>
                <li>Integration with Codeforces for problem tracking</li>
                <li>Progress analytics and performance insights</li>
                <li>Social features for connecting with other users</li>
                <li>Bug reporting and support systems</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Use only one account per person</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious activity.
              </p>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You shall not:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Use the Service to violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Upload or transmit harmful code, viruses, or malicious content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Use automated tools to access the Service without permission</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Content and Data */}
          <Card>
            <CardHeader>
              <CardTitle>User Content and Data</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                You retain ownership of any content you submit to the Service ("User Content"). By submitting User Content,
                you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content
                solely for the purpose of providing and improving the Service.
              </p>
              <p>
                You are responsible for ensuring that your User Content does not violate the rights of others or applicable laws.
                We reserve the right to remove any User Content that violates these Terms.
              </p>
              <p>
                Your data is stored securely, and we implement appropriate measures to protect it. Please refer to our
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400"> Privacy Policy</Link> for details.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services and Integrations</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                RankTime integrates with third-party services such as Codeforces, Google Authentication, and GitHub.
                Your use of these third-party services is subject to their respective terms of service and privacy policies.
              </p>
              <p>
                We are not responsible for the availability, accuracy, or content of third-party services. Your interactions
                with third-party services are solely between you and the third party.
              </p>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Service Availability and Modifications</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We strive to provide continuous access to the Service but do not guarantee uninterrupted availability.
                The Service may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.
                We will make reasonable efforts to notify users of significant changes.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
                We do not warrant that the Service will be error-free, secure, or meet your specific requirements.
              </p>
              <p>
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising
                from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service
                in the twelve months preceding the claim.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Either party may terminate this agreement at any time. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Your right to use the Service immediately ceases</li>
                <li>We may delete your account and associated data</li>
                <li>Provisions regarding liability and indemnification survive termination</li>
              </ul>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Governing Law and Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard
                to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms shall be resolved through good faith negotiations. If a resolution
                cannot be reached, the dispute shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be communicated through
                the Service or via email. Your continued use of the Service after changes constitutes acceptance of the
                updated Terms.
              </p>
              <p>
                It is your responsibility to review these Terms periodically for updates.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Email: <a href="mailto:rafi27hasan@gmail.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">rafi27hasan@gmail.com</a></li>
                <li>Contact Form: <Link href="/contact" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">rank-time.vercel.app/contact</Link></li>
              </ul>
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