import { Component } from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-screen',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './faq-screen.component.html',
  standalone: true,
  styleUrl: './faq-screen.component.css'
})
export class FaqScreenComponent {
  faqs: FaqItem[] = [
    {
      question: 'What is FlexyPixel Gallery?',
      answer: `<p>FlexyPixel Gallery is a centralized web interface for organizing, previewing, and deploying configuration files for LED-panel systems. It lets you store multiple setup profiles—each describing panel layout, brightness, color calibration, and networking parameters—and manage them all from one place.</p>`,
      isOpen: false
    },
    {
      question: 'Why should I use FlexyPixel Gallery for my LED-panel configurations?',
      answer: `
        <ul>
          <li><strong>Consistency:</strong> Keep all your configuration files in a single, versioned library so every display uses the same proven settings.</li>
          <li><strong>Efficiency:</strong> Quickly browse, search, and filter gallery items by tags (e.g. indoor, curved, high-brightness) to find the right profile.</li>
          <li><strong>Collaboration:</strong> Share presets across teams; colleagues can clone, tweak, and re-save configurations without overwriting the originals.</li>
          <li><strong>Safety:</strong> Preview any configuration in the browser before applying it to live hardware, reducing mis-deployments.</li>
        </ul>
      `,
      isOpen: false
    },
    {
      question: 'Which file formats does FlexyPixel Gallery support?',
      answer: `<p>You can upload common configuration formats like JSON, YAML, and XML. Each gallery item links to its source file so the system’s firmware loader can ingest it directly. In addition, the interface displays key parameters (resolution, drive voltage, refresh rate) in a human-readable summary.</p>`,
      isOpen: false
    },
    {
      question: 'How do I add a new configuration to the gallery?',
      answer: `
        <ol>
          <li>Click “Add New” in the gallery header.</li>
          <li>Give your profile a <strong>unique title</strong>, optional <strong>tags</strong>, and a <strong>short description</strong>.</li>
          <li>Upload your configuration file (JSON, YAML, or XML).</li>
          <li>Review the auto-generated thumbnail preview.</li>
          <li>Hit “Save” — your new preset is immediately available for preview or deployment.</li>
        </ol>
      `,
      isOpen: false
    },
    {
      question: 'Can I preview a configuration before applying it to my panels?',
      answer: `<p>Yes. Selecting any gallery item opens a detailed view with a schematic mock-up of the panel array, readouts of brightness, color temperature, and refresh rate, and a “dry-run” simulator that indicates which modules would be affected. This helps ensure the settings match your physical setup before pushing them to hardware.</p>`,
      isOpen: false
    },
    {
      question: 'How do I filter and search configurations?',
      answer: `<p>Use the search bar at the top to look up keywords in titles or descriptions. You can also click on tag badges (e.g. outdoor, HDR, portrait) to instantly narrow the list. Combine multiple tags with boolean AND logic to drill down to exactly the presets you need.</p>`,
      isOpen: false
    },
    {
      question: 'Is there version control or rollback?',
      answer: `<p>Every time you update and save a configuration under the same title, FlexyPixel Gallery archives the previous version automatically. In the item’s history panel, you can compare versions side-by-side and restore any past configuration with a single click.</p>`,
      isOpen: false
    },
    {
      question: 'How do I deploy a configuration to my LED-panel system?',
      answer: `<p>In the gallery view, click “Deploy” on the chosen preset and select your target device(s) from the list. You’ll see progress logs as the new settings upload and apply. Successful deployments are logged in the activity feed for audit purposes.</p>`,
      isOpen: false
    },
    {
      question: 'Where can I find more detailed documentation?',
      answer: `<p>Click the “Help & Docs” link in the top-right corner of FlexyPixel Gallery. There you’ll find a full API reference, formatting guidelines for JSON/YAML/XML presets, and best-practice articles on panel calibration, color mapping, and multi-panel synchronization.</p>`,
      isOpen: false
    }
  ];

  toggle(idx: number) {
    this.faqs[idx].isOpen = !this.faqs[idx].isOpen;
  }
}
