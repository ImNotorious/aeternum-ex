"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlowingButton } from "@/components/ui/glowing-button"
import Link from "next/link"
import { ArrowRight, Award, Users, Target, Heart, Lightbulb, Shield } from "lucide-react"

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Cardiologist with 15+ years of experience and a passion for healthcare innovation.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "AI researcher with expertise in machine learning applications for medical imaging.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Blockchain",
      bio: "Blockchain expert with a background in healthcare data security and privacy.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Dr. James Wilson",
      role: "Medical Director",
      bio: "Neurologist specializing in diagnostic imaging and telemedicine implementation.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Patient-Centered",
      description:
        "We put patients first in everything we do, ensuring their needs, privacy, and well-being are our top priorities.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description:
        "We continuously push the boundaries of what's possible in healthcare through technology and creative solutions.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security",
      description:
        "We maintain the highest standards of data security and privacy protection for all medical information.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Accessibility",
      description:
        "We strive to make quality healthcare accessible to everyone, regardless of location or circumstances.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Excellence",
      description: "We are committed to excellence in all aspects of our service, from technology to patient care.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Accountability",
      description:
        "We take responsibility for our actions and decisions, maintaining transparency with all stakeholders.",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-20"
      >
        <Badge className="mb-2" variant="outline">
          About Us
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Our Mission & Vision
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Revolutionizing healthcare through the seamless integration of AI and blockchain technology
        </p>
      </motion.div>

      <Tabs defaultValue="mission" className="mb-16">
        <TabsList className="bg-primary/10 p-1 mx-auto">
          <TabsTrigger
            value="mission"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Our Mission
          </TabsTrigger>
          <TabsTrigger
            value="story"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Our Story
          </TabsTrigger>
          <TabsTrigger
            value="values"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Our Values
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mission" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Transforming Healthcare Through Technology</h2>
              <p className="text-muted-foreground mb-6">
                At Aeternum, our mission is to revolutionize healthcare delivery by leveraging the power of artificial
                intelligence and blockchain technology. We aim to create a secure, transparent, and efficient healthcare
                ecosystem that empowers patients, supports healthcare providers, and improves medical outcomes globally.
              </p>
              <p className="text-muted-foreground">
                We are committed to making early disease detection accessible to all, ensuring patient data remains
                secure and private, and facilitating seamless collaboration between patients and healthcare
                professionals. Through our innovative platform, we strive to reduce diagnostic errors, decrease
                healthcare costs, and ultimately save lives.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                We envision a world where everyone has access to accurate, timely, and affordable medical diagnoses,
                regardless of their location or circumstances. A world where patient data is owned and controlled by
                patients themselves, and where healthcare providers can collaborate efficiently to deliver the best
                possible care. Through continuous innovation and unwavering commitment to our values, we aim to be at
                the forefront of the healthcare revolution, setting new standards for what's possible in medical
                technology.
              </p>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="story" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-8">
              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold mb-2">2019: The Beginning</h3>
                <p className="text-muted-foreground">
                  Aeternum was founded by Dr. Sarah Johnson, a cardiologist who witnessed firsthand the challenges of
                  delayed diagnoses and fragmented medical records. After losing a patient due to a late diagnosis that
                  could have been prevented with better technology, she assembled a team of medical professionals, AI
                  researchers, and blockchain experts to create a solution.
                </p>
              </div>

              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold mb-2">2020: Research & Development</h3>
                <p className="text-muted-foreground">
                  The team spent a year developing and training AI models on millions of anonymized medical images,
                  achieving breakthrough accuracy rates in detecting early signs of diseases. Simultaneously, they
                  designed a blockchain architecture that would ensure patient data security while enabling seamless
                  sharing with authorized healthcare providers.
                </p>
              </div>

              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold mb-2">2021: Beta Launch</h3>
                <p className="text-muted-foreground">
                  Aeternum launched its beta platform with a select group of healthcare providers and patients. The
                  initial results were promising, with the AI system detecting early-stage conditions that had been
                  missed in conventional diagnoses. The blockchain component ensured that all data transfers were secure
                  and transparent.
                </p>
              </div>

              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold mb-2">2022: Global Expansion</h3>
                <p className="text-muted-foreground">
                  Following the successful beta phase, Aeternum expanded its services globally, partnering with
                  hospitals, clinics, and healthcare systems across multiple countries. The platform continued to
                  evolve, adding telemedicine capabilities and expanding its AI diagnostic range to cover more medical
                  conditions.
                </p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                <h3 className="text-xl font-bold mb-2">Today: Leading the Revolution</h3>
                <p className="text-muted-foreground">
                  Today, Aeternum stands at the forefront of the healthcare technology revolution, serving thousands of
                  patients and healthcare providers worldwide. Our platform continues to evolve, with ongoing research
                  and development to expand our capabilities and improve healthcare outcomes globally.
                </p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="values" className="mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card
                  key={value.title}
                  className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50"
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Our Leadership Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/10 hover:border-primary/50 text-center">
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-primary/20">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 p-8 md:p-12 shadow-lg border border-primary/20 backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-6 max-w-[600px] mx-auto">
            Be part of the healthcare revolution. Together, we can transform the future of medical diagnosis and patient
            care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowingButton asChild>
              <Link href="/auth/login" className="flex items-center">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </GlowingButton>
            <Link
              href="/learn-more"
              className="inline-flex h-10 items-center justify-center rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

