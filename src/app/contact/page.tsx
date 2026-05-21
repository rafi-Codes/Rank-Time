// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Github, Facebook, Instagram, Mail, Send, Bug } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    severity: 'low'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitType(null);

    try {
      const response = await fetch('/api/contact/bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitType('success');
        setSubmitMessage('Thank you! Your bug report has been submitted successfully. We\'ll review it and get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          description: '',
          severity: 'low'
        });
      } else {
        setSubmitType('error');
        setSubmitMessage('Failed to submit bug report. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setSubmitType('error');
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'GitHub',
      username: 'rafi-Codes',
      url: 'https://github.com/rafi-Codes',
      icon: Github,
      bgColor: 'bg-gray-900 dark:bg-gray-100'
    },
    {
      name: 'Facebook',
      username: 'parasite2048',
      url: 'https://facebook.com/parasite2048',
      icon: Facebook,
      bgColor: 'bg-blue-600'
    },
    {
      name: 'Instagram',
      username: '__parasite_',
      url: 'https://instagram.com/__parasite_',
      icon: Instagram,
      bgColor: 'bg-pink-600'
    },
    {
      name: 'Email',
      username: 'rafi27hasan@gmail.com',
      url: 'mailto:rafi27hasan@gmail.com',
      icon: Mail,
      bgColor: 'bg-green-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 transition-transform hover:scale-105">
              <img src="/logo.svg" alt="RankTime Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold brand-gradient">RankTime</h1>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with us or report any issues you encounter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Connect With Me
              </CardTitle>
              <CardDescription>
                Find me on social media or reach out directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center p-4 rounded-lg border border-border bg-card hover:bg-accent transition-all duration-200 group"
                  >
                    <div className={`p-2 rounded-full ${link.bgColor} text-white mr-4 group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {link.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.username}
                      </p>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>

          {/* Bug Report Form */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-primary" />
                Report a Bug
              </CardTitle>
              <CardDescription>
                Help us improve by reporting any issues you encounter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitMessage && (
                  <Alert variant={submitType === 'success' ? 'success' : 'destructive'}>
                    <AlertTitle>
                      {submitType === 'success' ? 'Report Submitted' : 'Error'}
                    </AlertTitle>
                    <AlertDescription>{submitMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    placeholder="Brief description of the issue"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-sm font-medium">
                    Severity Level
                  </Label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="low">Low - Minor issue, does not affect functionality</option>
                    <option value="medium">Medium - Affects some features</option>
                    <option value="high">High - Major functionality broken</option>
                    <option value="critical">Critical - App unusable</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description * ({formData.description.length}/1000)
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about the bug, including steps to reproduce it..."
                    rows={6}
                    disabled={isSubmitting}
                    maxLength={1000}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                  {!errors.description && (
                    <p className="text-sm text-muted-foreground">Provide detailed information about the bug and steps to reproduce</p>
                  )}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  className="w-full"
                  icon={!isSubmitting ? <Send className="w-4 h-4" /> : undefined}
                >
                  Submit Bug Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t border-border/50">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Rank Time. All rights reserved.</p>
            <p className="mt-2">Developed by Rafiul Hasan, CSE, BRACU</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
