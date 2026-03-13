'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Domain } from '@/lib/domains';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

export default function ResumeBuilder({ 
  domain, 
  user, 
  onClose 
}: { 
  domain: Domain; 
  user: any; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    github: '',
    summary: `Aspiring ${domain.title} professional with a strong foundation in ${domain.topSkills.join(', ')}. Passionate about building scalable solutions and continuously learning new technologies.`,
    education: 'B.Tech in Computer Science, Expected 2026',
    skills: domain.technicalSkills.join(', '),
    projects: domain.projects.map(p => `${p.title}: ${p.description}`).join('\n\n'),
    experience: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = 20;

        // Helper function to add text and update yPos
        const addText = (text: string, fontSize: number, isBold: boolean = false, align: 'left' | 'center' = 'left', color: number[] = [0, 0, 0]) => {
          doc.setFontSize(fontSize);
          doc.setFont('helvetica', isBold ? 'bold' : 'normal');
          doc.setTextColor(color[0], color[1], color[2]);
          
          const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
          
          if (align === 'center') {
            lines.forEach((line: string) => {
              const xPos = (pageWidth - doc.getTextWidth(line)) / 2;
              doc.text(line, xPos, yPos);
              yPos += fontSize * 0.4;
            });
          } else {
            doc.text(lines, margin, yPos);
            yPos += lines.length * fontSize * 0.4;
          }
          yPos += 5; // Add some spacing after block
        };

        // Header
        addText(formData.name || 'Your Name', 24, true, 'center', [30, 59, 138]); // Dark blue
        
        // Contact Info
        const contactInfo = [formData.email, formData.phone, formData.linkedin, formData.github]
          .filter(Boolean)
          .join(' | ');
        addText(contactInfo, 10, false, 'center', [100, 100, 100]);
        yPos += 5;

        // Section: Summary
        if (formData.summary) {
          addText('PROFESSIONAL SUMMARY', 12, true, 'left', [30, 59, 138]);
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
          addText(formData.summary, 10);
          yPos += 5;
        }

        // Section: Education
        if (formData.education) {
          addText('EDUCATION', 12, true, 'left', [30, 59, 138]);
          doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
          addText(formData.education, 10);
          yPos += 5;
        }

        // Section: Skills
        if (formData.skills) {
          addText('TECHNICAL SKILLS', 12, true, 'left', [30, 59, 138]);
          doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
          addText(formData.skills, 10);
          yPos += 5;
        }

        // Section: Projects
        if (formData.projects) {
          addText('PROJECTS', 12, true, 'left', [30, 59, 138]);
          doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
          
          const projectsList = formData.projects.split('\n\n');
          projectsList.forEach(proj => {
            if (yPos > 270) { // Check if we need a new page
              doc.addPage();
              yPos = 20;
            }
            addText(proj, 10);
          });
          yPos += 5;
        }

        // Section: Experience
        if (formData.experience) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          addText('EXPERIENCE', 12, true, 'left', [30, 59, 138]);
          doc.line(margin, yPos - 4, pageWidth - margin, yPos - 4);
          addText(formData.experience, 10);
        }

        doc.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
        setIsGenerating(false);
        setIsGenerated(true);
        
        setTimeout(() => setIsGenerated(false), 3000);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setIsGenerating(false);
        alert("Failed to generate PDF. Please try again.");
      }
    }, 1000); // Simulate processing time for better UX
  };

  return (
    <div className="fixed inset-0 bg-[#0a1628]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0a1628] border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/30">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Resume Builder</h2>
              <p className="text-slate-400 text-sm">Tailored for {domain.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">LinkedIn URL</label>
                  <input 
                    type="text" 
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">GitHub URL</label>
                  <input 
                    type="text" 
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    placeholder="github.com/johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Education</label>
                <input 
                  type="text" 
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  placeholder="University Name, Degree, Year"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Professional Details</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Professional Summary</label>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Technical Skills (Comma separated)</label>
                <textarea 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Projects</label>
                <textarea 
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                  placeholder="Project Title: Description..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-400">
            Fields are pre-filled based on your selected domain. Customize as needed.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={generatePDF}
              disabled={isGenerating || isGenerated}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isGenerated 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : isGenerated ? (
                <>
                  <CheckCircle2 size={18} />
                  Downloaded!
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
