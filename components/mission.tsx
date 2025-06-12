"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, Users, Briefcase, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, useInView } from "framer-motion";

export default function Mission() {
  const [visibleSections, setVisibleSections] = useState({
    mission: false,
    team: false,
    milestones: false,
  });
  const [teamIndex, setTeamIndex] = useState(0);

  const missionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const milestonesRef = useRef<HTMLElement>(null);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const teamMembers = [
    {
      name: "Jonathan Ssemakula",
      role: "Founder & Director",
      image: "/images/team/jon.jpg",
      description: "Masters in Robotics & Mechatronics Engineering leading ZunoBotics' mission to empower African innovators.",
    },
    {
      name: "Isaac Ssozi",
      role: "Lead Student Engineer",
      image: "/images/team/isaac.png",
      description: "Computer Scientist from Makerere University spearheading irrigation projects.",
    },
    {
      name: "Farouk Jjingo",
      role: "Community Manager",
      image: "/images/team/farouk.png",
      description: "Coordinates student collaborations and community outreach programs.",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "ZunoBotics Founded",
      description: "Initiated at Makerere University to democratize robotics in Africa.",
      icon: <Briefcase size={24} className="text-primary" />,
    },
    {
      year: "2024",
      title: "First Prototype",
      description: "Developed the Autonomous Irrigation Robot, impacting local farmers.",
      icon: <Award size={24} className="text-primary" />,
    },
    {
      year: "2025",
      title: "Official Launch",
      description: "Launching across Uganda with partnerships at 5 universities.",
      icon: <Users size={24} className="text-primary" />,
    },
  ];

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

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${teamIndex * 100}%)` }}
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex-shrink-0 w-full max-w-sm mx-auto">
                    <div
                      className={`bg-card p-6 rounded-lg shadow-md border border-border hover:shadow-lg transition-all duration-1000 transform ${
                        visibleSections.team ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-foreground mb-2 text-center">{member.name}</h3>
                      <p className="text-primary font-medium mb-2 text-center">{member.role}</p>
                      <p className="text-muted-foreground text-center">{member.description}</p>
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
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>

            {/* Timeline items */}
            <div className="relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  variants={fadeIn}
                  className={`flex items-center mb-16 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                  role="listitem"
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                    <div className="card-premium p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                      <p className="text-sm text-accent mt-2">{milestone.year}</p>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground">
                      <Calendar size={24} />
                    </div>
                  </div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
