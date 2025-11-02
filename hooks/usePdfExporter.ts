import { useState, useEffect } from 'react';
import { AdvancedExplanation } from '../types';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const usePdfExporter = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return isReady;
};

function sanitize(text: string): string {
  if (!text) return '';
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function exportToPdf(explanation: AdvancedExplanation, rawTranscript: string) {
  if (!window.html2pdf) {
    console.error("html2pdf library is not loaded.");
    return;
  }

  const {
    subject, coreMessage, eli5, intermediate, advanced, technicalDepth,
    keyTerms, glossary, analogy, visualDescription, example, counterExample,
    realWorldImplementation, useCases, historicalContext, futureImplications,
    commonMisconceptions, relatedConcepts, practicalExercise, summary
  } = explanation;

  const listToHtml = (items: string[]) => `<ul>${items.map(item => `<li>${sanitize(item)}</li>`).join('')}</ul>`;
  const glossaryToHtml = (items: { term: string; definition: string }[]) => items.map(item => `<div class="glossary-item"><h4>${sanitize(item.term)}</h4><p>${sanitize(item.definition)}</p></div>`).join('');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { 
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; 
            font-size: 10pt; 
            line-height: 1.5; 
            color: #000000;
            -webkit-font-smoothing: antialiased; 
            margin: 0; 
            padding: 0;
            background-color: #fff;
        }
        .page-container { 
            padding: 12mm 15mm;
            max-width: 100%; 
        }
        .header { 
            text-align: left; 
            margin-bottom: 8mm; 
            padding-bottom: 4mm; 
            border-bottom: 2px solid #2563eb; 
        }
        h1 { 
            font-size: 24pt; 
            font-weight: 700; 
            margin: 0; 
            color: #000; 
        }
        .subject { 
            font-size: 14pt; 
            color: #1e3a8a; 
            font-weight: 600; 
            margin-top: 1mm;
        }
        h2 { 
            font-size: 16pt; 
            font-weight: 700; 
            margin: 8mm 0 3mm 0; 
            color: #1e3a8a; 
            border-bottom: 1px solid #93c5fd; 
            padding-bottom: 2mm; 
        }
        h3 { 
            font-size: 12pt; 
            font-weight: 600; 
            margin: 4mm 0 2mm 0; 
            color: #1e40af; 
        }
        h4 { 
            font-size: 10pt; 
            font-weight: 700; 
            color: #1d4ed8; 
            margin: 0 0 1mm 0; 
        }
        p { 
            margin: 0 0 2.5mm 0; 
            text-align: justify; 
        }
        ul { 
            margin: 0 0 3mm 0; 
            padding: 0;
            list-style: none;
        }
        li { 
            margin-bottom: 1.5mm; 
            padding-left: 5mm;
            position: relative;
        }
        li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #2563eb;
            font-size: 1.2em;
            line-height: 1;
        }
        .level-badge { 
            display: inline-block; 
            padding: 1mm 2.5mm; 
            border-radius: 4px; 
            font-size: 8pt; 
            font-weight: 700; 
            color: #fff; 
            margin-right: 2mm; 
            vertical-align: middle; 
        }
        .level-container { 
            margin-bottom: 4mm; 
            padding: 4mm;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            background-color: #f9fafb;
            break-inside: avoid;
        }
        .glossary-item { 
            margin-bottom: 3mm; 
            padding-left: 3mm; 
            border-left: 2px solid #60a5fa; 
        }
        .two-column { 
            column-count: 2; 
            column-gap: 8mm; 
        }
        .column-break { 
            break-inside: avoid; 
            page-break-inside: avoid; 
        }
        .section { 
            margin-bottom: 5mm; 
            break-inside: avoid; 
            page-break-inside: avoid; 
        }
        .transcript-box {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 4mm;
            font-size: 9pt;
            color: #4b5563;
            white-space: pre-wrap;
            word-wrap: break-word;
            page-break-inside: avoid;
            margin-top: 5mm;
            font-family: 'Courier New', Courier, monospace;
        }
    </style>
  </head>
  <body>
    <div class="page-container">
        <div class="header">
            <h1>Universal Explainer Report</h1>
            <p class="subject">${sanitize(subject)}</p>
        </div>
        
        <div class="section">
            <h2>Core Message</h2>
            <p>${sanitize(coreMessage)}</p>
        </div>
        
        <div class="section">
            <h2>Multi-level Understanding</h2>
            <div class="level-container">
                <h3><span class="level-badge" style="background-color: #16a34a;">ELI5</span>Explain Like I'm 5</h3>
                <p>${sanitize(eli5)}</p>
            </div>
            <div class="level-container">
                <h3><span class="level-badge" style="background-color: #2563eb;">INT</span>Intermediate Level</h3>
                <p>${sanitize(intermediate)}</p>
            </div>
            <div class="level-container">
                <h3><span class="level-badge" style="background-color: #7c3aed;">ADV</span>Advanced Level</h3>
                <p>${sanitize(advanced)}</p>
            </div>
            <div class="level-container">
                <h3><span class="level-badge" style="background-color: #db2777;">TECH</span>Technical Depth</h3>
                <p>${sanitize(technicalDepth)}</p>
            </div>
        </div>

        <div class="two-column">
            <div class="section column-break">
                <h2>Key Concepts</h2>
                <h3>Key Terms</h3>
                ${listToHtml(keyTerms)}
                <h3>Glossary</h3>
                ${glossaryToHtml(glossary)}
            </div>
            
            <div class="section column-break">
                <h2>Clarity Tools</h2>
                <h3>Analogy</h3>
                <p>${sanitize(analogy)}</p>
                <h3>Visual Description</h3>
                <p>${sanitize(visualDescription)}</p>
            </div>
            
            <div class="section column-break">
                <h2>Examples</h2>
                <h3>Example</h3>
                <p>${sanitize(example)}</p>
                <h3>Counter Example</h3>
                <p>${sanitize(counterExample)}</p>
            </div>
            
            <div class="section column-break">
                <h2>Application</h2>
                <h3>Real-World Implementation</h3>
                <p>${sanitize(realWorldImplementation)}</p>
                <h3>Use Cases</h3>
                ${listToHtml(useCases)}
            </div>
            
            <div class="section column-break">
                <h2>Context & Depth</h2>
                <h3>Historical Context</h3>
                <p>${sanitize(historicalContext)}</p>
                <h3>Future Implications</h3>
                <p>${sanitize(futureImplications)}</p>
            </div>
            
            <div class="section column-break">
                <h2>Further Learning</h2>
                <h3>Common Misconceptions</h3>
                ${listToHtml(commonMisconceptions)}
                <h3>Related Concepts</h3>
                ${listToHtml(relatedConcepts)}
            </div>
        </div>

        <div class="section" style="column-count: 1;">
            <h2>Actionable Learning</h2>
            <h3>Practical Exercise</h3>
            <p>${sanitize(practicalExercise)}</p>
            <h3>Summary</h3>
            <p>${sanitize(summary)}</p>
        </div>

        <div class="section">
          <h2>Original Transcript</h2>
          <div class="transcript-box">${sanitize(rawTranscript)}</div>
        </div>
    </div>
  </body>
  </html>`;

  const opt = {
      margin: [10, 10, 10, 10],
      filename: `${explanation.subject.toLowerCase().replace(/\s+/g, '_')}_explanation.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  window.html2pdf().from(htmlContent).set(opt).save();
}

export default usePdfExporter;