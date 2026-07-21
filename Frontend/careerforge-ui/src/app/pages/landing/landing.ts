import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  features = [
    { icon: '📄', title: 'Resume Builder', desc: 'Build a polished resume with live preview and one-click PDF export.' },
    { icon: '🌐', title: 'Portfolio Builder', desc: 'Create a shareable portfolio that showcases your projects and skills.' },
    { icon: '🤖', title: 'AI Suggestions', desc: 'Get instant AI feedback on your resume — grammar, ATS score, and more.' },
    { icon: '🗂️', title: 'Templates', desc: 'Pick a layout that fits your style and industry.' }
  ];
}