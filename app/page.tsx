import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Lock, Calendar, MessageSquare, Clock, Gift, BookOpen, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-blue to-primary-blue/90 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-semibold leading-tight">
                Say what matters. When it matters most.
              </h1>
              <p className="text-xl text-white/90">
                Create a video today and schedule it to be delivered to your loved ones on a future date.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto">
                    Create Your Memory Box
                  </Button>
                </Link>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white/20">
                  How it works
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-[9/16] bg-white/10 rounded-3xl backdrop-blur-sm border-4 border-white/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-golden-sand flex items-center justify-center">
                    <Heart className="w-12 h-12 text-primary-blue" />
                  </div>
                  <p className="text-lg">Video Player Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-blue flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Record or Upload</h3>
              <p className="text-gray-600">
                Record a video message directly or upload one you&apos;ve already created.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-blue flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Choose a date</h3>
              <p className="text-gray-600">
                Select when you want your message to be delivered in the future.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-blue flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">We deliver</h3>
              <p className="text-gray-600">
                Your message will be securely delivered on the date you chose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Section */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 bg-golden-sand/20 rounded-2xl flex items-center justify-center">
              <Heart className="w-32 h-32 text-rose-heart" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-semibold text-gray-900">
                Give your loved ones something no one else can: your words, your voice, your presence.
              </h2>
              <p className="text-lg text-gray-600">
                Life moves fast. Moments pass. But your message can last forever. Whether it&apos;s a birthday wish for a child who isn&apos;t born yet, wisdom for your future self, or a message of love for someone special, MBoxLife helps you preserve what matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            Perfect for life&apos;s most meaningful moments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-blue flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Birthdays in the future</CardTitle>
                <CardDescription>
                  Record a message for your child&apos;s 18th birthday, or your partner&apos;s milestone celebration years from now.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-blue flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Weddings & milestones</CardTitle>
                <CardDescription>
                  Share your love and wisdom on their special day, even if you can&apos;t be there in person.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-blue flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Life wisdom</CardTitle>
                <CardDescription>
                  Pass down your experiences, lessons, and stories to future generations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-rose-heart flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Legacy & remembrance</CardTitle>
                <CardDescription>
                  Create a lasting legacy that your loved ones can treasure forever.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-golden-sand flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-primary-blue" />
                </div>
                <CardTitle>Messages to your future self</CardTitle>
                <CardDescription>
                  Send yourself a message to open in 1, 5, or 10 years. Reflect on your journey and growth.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-blue flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Time capsules</CardTitle>
                <CardDescription>
                  Capture this moment in time and share it with your future family.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-soft-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-blue flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-semibold text-gray-900">
              Your message is yours. Always.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">End-to-end encryption</h3>
                <p className="text-gray-600">Your videos are encrypted and secure.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Private delivery links</h3>
                <p className="text-gray-600">Only recipients you choose can view your messages.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">No AI training</h3>
                <p className="text-gray-600">We never use your content to train AI models.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">You&apos;re in control</h3>
                <p className="text-gray-600">Edit or delete your messages anytime before delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center text-gray-900 mb-16">
            Simple, transparent pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-semibold text-gray-900">$5</span>
                  <span className="text-gray-600">/year</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-600">
                  <li>Up to 5 video messages</li>
                  <li>Schedule up to 1 year ahead</li>
                  <li>Basic delivery options</li>
                  <li>Email support</li>
                </ul>
                <Button variant="secondary" className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-golden-sand relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-golden-sand text-primary-blue px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-semibold text-gray-900">$29</span>
                  <span className="text-gray-600">/year</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-600">
                  <li>Unlimited video messages</li>
                  <li>Schedule unlimited years ahead</li>
                  <li>Advanced delivery options</li>
                  <li>Priority support</li>
                  <li>Custom reminders</li>
                </ul>
                <Button variant="primary" className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Forever</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-semibold text-gray-900">$99</span>
                  <span className="text-gray-600">one-time</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-gray-600">
                  <li>Lifetime access</li>
                  <li>Unlimited everything</li>
                  <li>Legacy preservation</li>
                  <li>White-glove support</li>
                  <li>Family sharing</li>
                </ul>
                <Button variant="secondary" className="w-full">Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-20 bg-primary-blue text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-semibold">
            One message can last a lifetime.
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Start creating your memory box today and give the gift of your presence to those who matter most.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="accent">
              Create Your Memory Box
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">MBoxLife</h3>
              <p className="text-white/80 text-sm">
                Say what matters. When it matters most.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">How it works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60">
            <p>&copy; 2025 MBoxLife. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
