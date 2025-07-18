"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, Users, Briefcase, Award, Target, Trophy, Star, Clock, CheckCircle, Mail, Linkedin, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  order: number;
  isActive: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  year: string;
  date?: string;
  type: string;
  order: number;
  isVisible: boolean;
}

export default function Mission() {
  const [visibleSections, setVisibleSections] = useState({
    mission: false,
    team: false,
    milestones: false,
  });
  const [teamIndex, setTeamIndex] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const missionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const milestonesRef = useRef<HTMLElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch team members and milestones from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamResponse, milestonesResponse] = await Promise.all([
          fetch('/api/team'),
          fetch('/api/milestones')
        ]);

        if (teamResponse.ok) {
          const teamData = await teamResponse.json();
          setTeamMembers(teamData.teamMembers);
        }

        if (milestonesResponse.ok) {
          const milestonesData = await milestonesResponse.json();
          setMilestones(milestonesData.milestones);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle size={24} />;
      case 'milestone':
        return <Clock size={24} />;
      case 'event':
        return <Calendar size={24} />;
      default:
        return <Calendar size={24} />;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSections((prev) => ({
              ...prev,
              [sectionId]: true,
            }));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const refs = [missionRef, teamRef, milestonesRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (visibleSections.team) {
      const interval = setInterval(() => {
        setTeamIndex((prev) => (prev + 1) % teamMembers.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [visibleSections.team, teamMembers.length]);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Mission Section */}
      <section id="mission" ref={missionRef} className="py-24 bg-background" aria-labelledby="mission-heading">
        <div className="container">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.mission ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Badge className="mb-4 bg-muted text-muted-foreground">Our Vision</Badge>
            <h2 id="mission-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Vision & Mission
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ZunoBotics is a robotics and automation open-source innovation hub launching in Uganda in 2025. Our vision
              is to democratize innovation by making robotics and automation technology accessible to students and young
              innovators across Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`bg-card p-8 rounded-lg transition-all duration-1000 transform ${
                visibleSections.mission ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Democratize Innovation</h3>
              <p className="text-muted-foreground">
                Making robotics and automation technology accessible to students and young innovators across Africa,
                breaking down financial and technical barriers.
              </p>
            </div>

            <div
              className={`bg-card p-8 rounded-lg transition-all duration-1000 transform ${
                visibleSections.mission ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Build Community</h3>
              <p className="text-muted-foreground">
                Creating a growing ecosystem of shared knowledge and accessible innovation in Africa, where students
                collaborate and learn from each other.
              </p>
            </div>

            <div
              className={`bg-card p-8 rounded-lg transition-all duration-1000 transform ${
                visibleSections.mission ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Open Source Everything</h3>
              <p className="text-muted-foreground">
                All projects are open-sourced, allowing anyone to learn from and build upon previous work, creating a
                repository of African-made robotics solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" ref={teamRef} className="py-24 bg-background overflow-hidden" aria-labelledby="team-heading">
        <div className="container">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.team ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 id="team-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the passionate individuals driving ZunoBotics' mission to empower African innovators.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No team members found.</p>
              </div>
            ) : (
              <>
                {/* Mobile Slider */}
                <div className="md:hidden">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${teamIndex * 100}%)` }}
                    >
                      {teamMembers.map((member, index) => (
                        <div key={member.id} className="flex-shrink-0 w-full px-4">
                      <div
                        className={`bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-1000 transform ${
                          visibleSections.team ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <img
                          src={member.image || '/images/team/default-avatar.png'}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-bold text-foreground mb-2 text-center">{member.name}</h3>
                        <p className="text-primary font-medium mb-2 text-center">{member.role}</p>
                        <p className="text-muted-foreground text-center mb-4">{member.description}</p>
                        <div className="flex justify-center space-x-6">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Email"
                            >
                              <Mail className="h-5 w-5" />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="GitHub"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${teamIndex === index ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setTeamIndex(index)}
                  />
                ))}
              </div>
            </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className={`bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-1000 transform ${
                        visibleSections.team ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <img
                        src={member.image || '/images/team/default-avatar.png'}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-foreground mb-2 text-center">{member.name}</h3>
                      <p className="text-primary font-medium mb-2 text-center">{member.role}</p>
                      <p className="text-muted-foreground text-center mb-4">{member.description}</p>
                      <div className="flex justify-center space-x-6">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Email"
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="GitHub"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section id="milestones" ref={milestonesRef} className="py-24 bg-gradient-section" aria-labelledby="milestones-heading">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 id="milestones-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From our founding to our upcoming launch, here are key milestones in ZunoBotics' story.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : milestones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No milestones found.</p>
              </div>
            ) : (
              <>
                {/* Timeline line - hidden on mobile */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>
                {/* Mobile timeline line */}
                <div className="md:hidden absolute left-6 top-0 h-full w-0.5 bg-primary/30"></div>

                {/* Timeline items */}
                <div className="relative">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      variants={fadeIn}
                      className={`flex items-center mb-16 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                      role="listitem"
                    >
                  {/* Desktop layout */}
                  <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                    <div className="card-premium p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                      <p className="text-sm text-accent mt-2">{milestone.year}</p>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden w-full pl-16">
                    <div className="card-premium p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                      <p className="text-sm text-accent mt-2">{milestone.year}</p>
                    </div>
                  </div>

                  {/* Timeline icon - desktop */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground">
                      {getTypeIcon(milestone.type)}
                    </div>
                  </div>

                  {/* Timeline icon - mobile */}
                  <div className="md:hidden absolute left-0 flex items-center justify-center">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground">
                      {getTypeIcon(milestone.type)}
                    </div>
                  </div>

                      <div className="hidden md:block w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
