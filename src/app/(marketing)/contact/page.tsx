import { ContactSection } from "@/components/sections/contact-section";

export const metadata = {
  title: "Contact – It starts with a conversation",
  description:
    "Share a little about your business and what you have in mind. Tell RAYZE about your next branding, content, website or automation project.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return <ContactSection defaultService={service} />;
}
