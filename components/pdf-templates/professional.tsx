import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/lib/schemas";

const colors = {
  black: "#1a1a1a",
  darkGray: "#374151",
  mediumGray: "#4b5563",
  gray: "#6b7280",
  lightGray: "#d1d5db",
  lighterGray: "#e5e7eb",
  link: "#2563eb",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.black,
    lineHeight: 1.45,
  },

  // ── Header ──
  header: {
    textAlign: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    marginBottom: 10,
    color: colors.black,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 9,
    color: colors.mediumGray,
  },
  contactItem: {
    marginHorizontal: 5,
  },
  contactSep: {
    marginHorizontal: 2,
    color: colors.lightGray,
  },
  contactLink: {
    color: colors.link,
    textDecoration: "none",
  },

  // ── Divider ──
  divider: {
    borderBottomWidth: 0.6,
    borderBottomColor: colors.lightGray,
    marginTop: 8,
    marginBottom: 4,
  },

  // ── Summary ──
  summary: {
    fontSize: 10,
    fontFamily: "Helvetica-Oblique",
    color: colors.darkGray,
    marginBottom: 6,
    lineHeight: 1.55,
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    color: colors.black,
    marginTop: 10,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.lighterGray,
  },

  // ── Experience ──
  entry: {
    marginBottom: 7,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  entryDate: {
    fontSize: 9,
    color: colors.gray,
    textAlign: "right",
    minWidth: 100,
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: colors.mediumGray,
    marginBottom: 3,
  },

  // ── Bullets ──
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: colors.gray,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.5,
  },

  // ── Skills ──
  skillRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    minWidth: 110,
    color: colors.black,
  },
  skillItems: {
    flex: 1,
    fontSize: 9.5,
    color: colors.darkGray,
  },

  // ── Projects ──
  projectName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  projectDesc: {
    fontSize: 9.5,
    color: colors.darkGray,
    marginBottom: 1,
  },
  projectTech: {
    fontSize: 8.5,
    color: colors.gray,
    fontFamily: "Helvetica-Oblique",
  },

  // ── Languages ──
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9.5,
  },
  languageItem: {
    marginRight: 14,
  },
  languageName: {
    fontFamily: "Helvetica-Bold",
  },
  languageLevel: {
    color: colors.mediumGray,
  },
});

// ── Helpers ──
function ContactSep() {
  return <Text style={styles.contactSep}>|</Text>;
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function BulletPoint({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

// ── Main Template ──
export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  const { contact, summary, experience, education, skills, projects, certifications, languages } = data;

  const contactItems: React.ReactNode[] = [];
  if (contact.email) {
    contactItems.push(
      <Link key="email" style={styles.contactLink} src={`mailto:${contact.email}`}>
        {contact.email}
      </Link>
    );
  }
  if (contact.phone) {
    contactItems.push(<Text key="phone" style={styles.contactItem}>{contact.phone}</Text>);
  }
  if (contact.location) {
    contactItems.push(<Text key="loc" style={styles.contactItem}>{contact.location}</Text>);
  }
  if (contact.linkedin) {
    const url = contact.linkedin.startsWith("http")
      ? contact.linkedin
      : `https://linkedin.com/in/${contact.linkedin}`;
    const displayText = contact.linkedin.startsWith("http")
      ? contact.linkedin.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : `linkedin.com/in/${contact.linkedin}`;
    contactItems.push(
      <Link key="li" style={styles.contactLink} src={url}>
        {displayText}
      </Link>
    );
  }
  if (contact.github) {
    const url = contact.github.startsWith("http")
      ? contact.github
      : `https://github.com/${contact.github}`;
    const displayText = contact.github.startsWith("http")
      ? contact.github.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : `github.com/${contact.github}`;
    contactItems.push(
      <Link key="gh" style={styles.contactLink} src={url}>
        {displayText}
      </Link>
    );
  }
  if (contact.website) {
    const url = contact.website.startsWith("http")
      ? contact.website
      : `https://${contact.website}`;
    const displayText = contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    contactItems.push(
      <Link key="web" style={styles.contactLink} src={url}>
        {displayText}
      </Link>
    );
  }

  return (
    <Document title={`${contact.fullName} - Resume`} author={contact.fullName}>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{contact.fullName}</Text>
          <View style={styles.contactRow}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ContactSep />}
                {item}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Summary ── */}
        {summary && summary.trim().length > 0 && (
          <Text style={styles.summary}>{summary}</Text>
        )}

        {/* ── Experience ── */}
        {experience && experience.length > 0 && (
          <View>
            <SectionTitle>Experience</SectionTitle>
            {experience.map((exp, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>
                    {exp.startDate} — {exp.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Text>
                {exp.bullets.map((bullet, j) => (
                  <BulletPoint key={j} text={bullet} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {education && education.length > 0 && (
          <View>
            <SectionTitle>Education</SectionTitle>
            {education.map((edu, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entryDate}>
                    {edu.startDate ? `${edu.startDate} — ` : ""}
                    {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.institution}
                  {edu.location ? ` · ${edu.location}` : ""}
                </Text>
                {edu.details?.map((detail, j) => (
                  <BulletPoint key={j} text={detail} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {skills && skills.length > 0 && (
          <View>
            <SectionTitle>Skills</SectionTitle>
            {skills.map((cat, i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{cat.category}:</Text>
                <Text style={styles.skillItems}>{cat.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ── */}
        {projects && projects.length > 0 && (
          <View>
            <SectionTitle>Projects</SectionTitle>
            {projects.map((proj, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <Text style={styles.projectName}>
                  {proj.name}
                  {proj.url ? " " : ""}
                </Text>
                <Text style={styles.projectDesc}>{proj.description}</Text>
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    Tech: {proj.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Certifications ── */}
        {certifications && certifications.length > 0 && (
          <View>
            <SectionTitle>Certifications</SectionTitle>
            {certifications.map((cert, i) =>
              cert.url ? (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Link style={[styles.bulletText, { color: colors.link }]} src={cert.url}>
                    {cert.name}
                  </Link>
                </View>
              ) : (
                <BulletPoint key={i} text={cert.name} />
              )
            )}
          </View>
        )}

        {/* ── Languages ── */}
        {languages && languages.length > 0 && (
          <View>
            <SectionTitle>Languages</SectionTitle>
            <View style={styles.languageRow}>
              {languages.map((lang, i) => (
                <Text key={i} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.languageLevel}> ({lang.proficiency})</Text>
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
