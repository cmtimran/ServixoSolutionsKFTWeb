export interface ServiceMock {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  benefits: string[];
  technologies: string[];
  faqs: { question: string; answer: string }[];
  imageUrl: string;
}

export interface ProductMock {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  priceBasic: number;
  pricePro: number;
  priceEnterprise: number;
  images: string[];
}

export interface ReviewMock {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  rating: number;
  title: string;
  reviewText: string;
  logoUrl?: string;
  imageUrl?: string;
}

export const MOCK_SERVICES: ServiceMock[] = [
  {
    id: 's1',
    slug: 'cloud-migration',
    title: 'Enterprise Cloud Migration',
    description: 'Seamlessly shift your legacy systems to modern, highly secure AWS, Azure, or Google Cloud environments.',
    content: 'We provide end-to-end cloud transformation. From mapping your existing on-premises software architecture to designing multi-region cloud infrastructures, we ensure minimal downtime and maximum scalability.',
    category: 'Cloud',
    benefits: [
      '99.99% high availability designs',
      'Up to 40% reduction in infrastructure costs',
      'Automated disaster recovery & backups',
      'Compliance with EU data protection laws (GDPR)'
    ],
    technologies: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Terraform', 'Docker', 'Kubernetes'],
    faqs: [
      {
        question: 'How long does a typical migration take?',
        answer: 'Depending on the complexity, a standard migration takes between 4 to 12 weeks, including testing and dry runs.'
      },
      {
        question: 'Will there be any downtime for our customers?',
        answer: 'We employ blue-green deployment strategies and sync databases live to achieve near-zero downtime.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's2',
    slug: 'custom-software',
    title: 'Custom Software Development',
    description: 'Tailor-made web, mobile, and API systems built to handle heavy enterprise workloads and high traffic.',
    content: 'Our team crafts high-performance software utilizing Next.js, Go, Python, and NestJS. We design microservices architectures that scale horizontally and integrate smoothly with external APIs.',
    category: 'Software',
    benefits: [
      'Optimized Next.js & React user interfaces',
      'Highly secure REST & GraphQL API layers',
      'Clean Code compliant with SOLID principles',
      'Comprehensive unit and integration testing'
    ],
    technologies: ['React/Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Go', 'Python'],
    faqs: [
      {
        question: 'Do we own the source code after completion?',
        answer: 'Yes, full intellectual property and source code ownership are transferred to you upon project sign-off.'
      },
      {
        question: 'Do you offer post-launch maintenance?',
        answer: 'Yes, we provide flexible monthly SLA support packages for updates, security audits, and hosting management.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's3',
    slug: 'cybersecurity',
    title: 'Cyber Defense & Penetration Testing',
    description: 'Proactively protect your corporate assets from malware, ransomware, and unauthorized network access.',
    content: 'Our certified white-hat hackers carry out penetration tests, code audits, and configure firewalls to lock down your APIs and systems. We establish compliance frameworks conforming to ISO 27001.',
    category: 'Cybersecurity',
    benefits: [
      'In-depth vulnerability scanning and reporting',
      'Advanced threat detection & incident response',
      'ISO 27001 & SOC 2 compliance readiness',
      'Secure Coding guidelines and team training'
    ],
    technologies: ['Kali Linux', 'Wireshark', 'OWASP ZAP', 'Cloudflare WAF', 'OAuth 2.0', 'JWT'],
    faqs: [
      {
        question: 'What is the difference between a vulnerability scan and a pen test?',
        answer: 'A vulnerability scan is automated, whereas a penetration test involves active manual exploitation by security experts.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's4',
    slug: 'it-consulting',
    title: 'Strategic IT Consulting',
    description: 'Upgrade your digital strategy and align your tech stack with your business growth objectives.',
    content: 'We review your legacy systems, identify performance bottlenecks, and design a technology roadmap that keeps you ahead of competitors. Get executive tech advisory (vCTO) on demand.',
    category: 'IT Consulting',
    benefits: [
      'Cost-benefit analysis of modern vs legacy tech',
      'Resource planning and developer team scaling advice',
      'Digital transformation roadmap planning',
      'Agile process improvement & Scrum integration'
    ],
    technologies: ['Enterprise Architecture', 'Jira', 'Agile/Scrum', 'DevOps Auditing', 'ITIL'],
    faqs: [
      {
        question: 'Can we hire you for temporary virtual CTO services?',
        answer: 'Yes, we offer part-time virtual CTO consulting contracts to help guide tech teams through critical transitions.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's5',
    slug: 'environmental-services',
    title: 'ETP, EIA & Waste Management',
    description: 'Comprehensive Environmental Treatment Plant, Environmental Impact Assessment, and Waste Management solutions.',
    content: 'We provide end-to-end environmental services. This includes designing and building Environmental Treatment Plants (ETP), conducting thorough Environmental Impact Assessments (EIA), and developing sustainable Waste Management systems tailored to your industry.',
    category: 'Environmental',
    benefits: [
      'Regulatory compliance and certification',
      'Sustainable and efficient waste reduction',
      'Custom-designed treatment plants',
      'Comprehensive environmental risk analysis'
    ],
    technologies: ['ETP Design', 'EIA Reporting', 'Recycling Systems', 'Pollution Control', 'Sustainability Auditing'],
    faqs: [
      {
        question: 'Do you handle the complete EIA process?',
        answer: 'Yes, we manage the entire Environmental Impact Assessment process from initial scoping to final reporting and approval.'
      },
      {
        question: 'Can you upgrade existing treatment plants?',
        answer: 'Absolutely. We evaluate existing ETPs and implement modern upgrades to improve efficiency and meet new regulations.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop'
  }
];

export const MOCK_PRODUCTS: ProductMock[] = [
  {
    id: 'p1',
    slug: 'servixo-erp',
    title: 'Servixo CoreERP',
    description: 'A unified enterprise planning suite managing inventory, finances, and HR with advanced AI forecasting.',
    features: [
      'Real-time automated inventory tracking',
      'Double-entry automated accounting ledger',
      'Intelligent sales forecasting dashboard',
      'GDPR-compliant employee files & payroll'
    ],
    specifications: {
      'Deployment': 'Cloud-hosted or On-Premises',
      'Supported APIs': 'REST, GraphQL, Webhooks',
      'Database': 'PostgreSQL / MongoDB',
      'Max Concurrent Users': 'Unlimited (Auto-scalable)',
      'Security Certification': 'SOC2 Type II, GDPR compliant'
    },
    priceBasic: 120000,
    pricePro: 160000,
    priceEnterprise: 240000,
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p2',
    slug: 'guardx-security',
    title: 'GuardX Cyber Sentinel',
    description: 'An AI-powered endpoint protection agent that detects and neutralizes zero-day security threats instantly.',
    features: [
      'Heuristic real-time malware detection',
      'Continuous central server network monitoring',
      'Automated sandboxed execution of suspect files',
      'Centralized admin threat response console'
    ],
    specifications: {
      'OS Support': 'Windows Server, Linux (Ubuntu/RHEL), macOS',
      'Agent Memory footprint': '< 45MB RAM',
      'Threat DB Updates': 'Real-time via encrypted websocket',
      'SIEM Integration': 'Splunk, Elastic, Datadog supported'
    },
    priceBasic: 140000,
    pricePro: 200000,
    priceEnterprise: 300000,
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

export const MOCK_REVIEWS: ReviewMock[] = [
  {
    id: 'r1',
    clientName: 'Máté Kovács',
    designation: 'VP of Engineering',
    company: 'Budapest FinTech Labs',
    rating: 5,
    title: 'Flawless Cloud Migration',
    reviewText: 'Servixo migrated our critical microservices to AWS with zero downtime. Their technical precision and speed were outstanding.',
    logoUrl: 'BFL'
  },
  {
    id: 'r2',
    clientName: 'Anna Szabó',
    designation: 'Managing Director',
    company: 'GreenEnergy HU',
    rating: 5,
    title: 'Transformed our Operations',
    reviewText: 'The custom ERP system built by Servixo saved us over 20 hours of manual data entry every single week. Highly recommended!',
    logoUrl: 'GEH'
  },
  {
    id: 'r3',
    clientName: 'Elena Rostova',
    designation: 'CTO',
    company: 'Nexus B2B',
    rating: 4,
    title: 'Excellent Security Auditing',
    reviewText: 'Their penetration testing uncovered critical security vulnerabilities that we were able to fix before launch. Great team of pros!',
    logoUrl: 'NB2B'
  }
];

export const MOCK_STATS = [
  { label: 'Projects Completed', value: '500+' },
  { label: 'Client Satisfaction', value: '99%' },
  { label: 'Service Availability', value: '24/7' },
  { label: 'Tech Consultants', value: '45+' }
];
