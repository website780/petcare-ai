import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                This Privacy Policy describes how we collect, use, and protect your personal information
                when you use our Pet Care AI application. We are committed to ensuring the privacy and
                security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email) through Google and Facebook authentication</li>
                <li>Pet information and images you upload to the platform</li>
                <li>Usage data and interaction with our services</li>
                <li>Device information and browser details</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide personalized pet care recommendations</li>
                <li>To analyze pet images and generate care insights</li>
                <li>To improve our services and user experience</li>
                <li>To send important notifications about your pet's care</li>
                <li>To maintain the security of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
              <p className="text-muted-foreground">
                We implement strong security measures to protect your personal information from
                unauthorized access, alteration, or disclosure. Your data is stored securely and
                processed using industry-standard encryption protocols.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use trusted third-party services for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Authentication (Google, Facebook)</li>
                <li>Image analysis (OpenAI)</li>
                <li>Cloud storage and database services</li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                These services have their own privacy policies and handle your data according to their
                terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request correction of your data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or how we handle your data, please
                contact us at support@petcareai.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. The latest version will always be
                available on this page. Last updated: March 17, 2025
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
