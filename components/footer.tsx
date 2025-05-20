// components/footer.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react"

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
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <Github className="h-5 w-5 text-foreground" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <Linkedin className="h-5 w-5 text-foreground" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <Twitter className="h-5 w-5 text-foreground" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#mission" className="text-muted-foreground hover:text-accent transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="#timeline" className="text-muted-foreground hover:text-accent transition-colors">
                  Timeline
                </Link>
              </li>
              <li>
                <Link href="#tools" className="text-muted-foreground hover:text-accent transition-colors">
                  Tools & Resources
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-muted-foreground hover:text-accent transition-colors">
                  Student Projects
                </Link>
              </li>
              <li>
                <Link href="#support" className="text-muted-foreground hover:text-accent transition-colors">
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
                <span className="text-muted-foreground">info@zunobotics.org</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-muted-foreground">+256 755-655-687</span>
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