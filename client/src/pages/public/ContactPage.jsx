import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Your message has been received! We will respond shortly.');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="primary" className="mb-3">Get in Touch</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          We’d Love to Hear From You
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Have questions about our enterprise plans, AI models, or custom integrations? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <Mail className="w-6 h-6 text-brand-500 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Email Us</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">support@interviewai.com</p>
          </Card>
          <Card className="p-6">
            <MessageSquare className="w-6 h-6 text-cyan-500 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Enterprise Sales</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">sales@interviewai.com</p>
          </Card>
          <Card className="p-6">
            <MapPin className="w-6 h-6 text-purple-500 mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white">Headquarters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">San Francisco, CA</p>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thank you for reaching out. Our engineering support team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Inquiry about InterviewAI Pro"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <Button type="submit" isLoading={loading} icon={Send} className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
