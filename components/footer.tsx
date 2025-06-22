// components/footer.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
                <Logo className="h-8 w-auto text-primary-foreground" />
              </div>
              <span className="ml-2 text-xl font-bold text-primary">ZunoBotics</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Democratizing robotics and automation technology across Africa through open-source innovation.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <a 
                  href="https://github.com/ZunoBotics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Visit our GitHub"
                >
                  <Github className="h-5 w-5 text-foreground" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <a 
                  href="https://www.linkedin.com/company/ict-tech-consultant/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-foreground" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <a 
                  href="https://twitter.com/zunobotics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5 text-foreground" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <a 
                  href="https://instagram.com/zunobotics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5 text-foreground" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" asChild>
                <a 
                  href="https://discord.gg/GWFyEesE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Join our Discord"
                >
                  <MessageCircle className="h-5 w-5 text-foreground" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about#mission" className="text-muted-foreground hover:text-accent transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/about#milestones" className="text-muted-foreground hover:text-accent transition-colors">
                  Our Journey
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-accent transition-colors">
                  Tools & Resources
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-accent transition-colors">
                  Student Projects
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-accent transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-muted-foreground">Kampala, Uganda</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a 
                  href="mailto:zunobotics@gmail.com?subject=Hello%20ZunoBotics!&body=Hi%20ZunoBotics%20team,%0D%0A%0D%0AI'm%20interested%20in%20learning%20more%20about%20your%20robotics%20and%20automation%20programs.%20I%20would%20love%20to%20discuss%20potential%20collaboration%20opportunities.%0D%0A%0D%0ABest%20regards"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  zunobotics@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <a 
                  href="https://wa.me/256785330180?text=Hello%20ZunoBotics!%20I'm%20interested%20in%20learning%20more%20about%20your%20robotics%20and%20automation%20programs.%20Could%20we%20discuss%20potential%20collaboration%20opportunities?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +256785330180
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter to receive updates on our progress and upcoming events.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-card border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              <Button className="btn-elegant">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} ZunoBotics Open Source Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}