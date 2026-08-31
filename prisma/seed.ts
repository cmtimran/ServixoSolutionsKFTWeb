import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

const MOCK_SERVICES = [
  {
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
    slug: 'gateway-threat-authority',
    title: 'Gateway Threat Authority (GTA)',
    description: 'Next-Gen Network Defense: Real-time network traffic monitoring and threat mitigation solution designed to detect and neutralize attacks before they impact your organization.',
    content: 'In today\'s high-speed, always-connected world, protecting your network from cyber threats is critical. Gateway Threat Authority (GTA) is a powerful, real-time network traffic monitoring and threat mitigation solution engineered to detect and neutralize attacks before they impact your organization.\n\nOperating at multi-gigabit speeds with zero packet drop, GTA continuously inspects network flow telemetry (NetFlow, sFlow, IPFIX) and full packet captures (PCAP). When DDoS floods or protocol anomalies are detected, the system immediately dispatches real-time alerts and activates automated mitigation workflows—such as BGP blackholing and dynamic firewall filtering—to ensure uninterrupted business continuity.',
    category: 'Cybersecurity',
    benefits: [
      'High-Speed Monitoring: Multi-gigabit traffic inspection without packet drop (NetFlow, sFlow, IPFIX, PCAP)',
      'Real-Time Threat Detection: Instant DDoS attack & protocol anomaly detection with operator alerts',
      'Automated Mitigation: Triggers BGP blackholing, dynamic firewall rules & custom scripts automatically',
      'Flow-Based Analytics: Identifies top talkers, traffic destinations & patterns for audit compliance',
      'Integration-Ready: Seamless API hooks for MikroTik RouterOS edge hardware, Grafana, Prometheus & SIEM',
      'Flexible Deployment: Scalable architecture from edge routers to core network gateways'
    ],
    technologies: ['NetFlow', 'sFlow', 'IPFIX', 'PCAP', 'BGP Blackholing', 'MikroTik RouterOS', 'Grafana', 'Prometheus'],
    faqs: [
      {
        question: 'What traffic flow protocols are supported by Gateway Threat Authority?',
        answer: 'GTA supports NetFlow (v5/v9), sFlow, IPFIX, and full packet capture (PCAP), allowing multi-gigabit traffic monitoring without dropping packets.'
      },
      {
        question: 'How does automated DDoS mitigation work?',
        answer: 'When a DDoS attack or traffic anomaly is detected, GTA automatically triggers mitigation workflows such as BGP blackholing, dynamic firewall rules, or custom webhook scripts to isolate attack traffic while preserving legitimate service.'
      },
      {
        question: 'Can GTA integrate with MikroTik RouterOS hardware?',
        answer: 'Yes! GTA features native API integration with MikroTik RouterOS edge equipment, as well as export capabilities for Grafana, Prometheus, SIEM platforms, Slack, and custom webhooks.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'
  }
];

const MOCK_PRODUCTS = [
  {
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
    currency: 'HUF',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
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
    currency: 'HUF',
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    slug: 'gateway-threat-authority',
    title: 'Gateway Threat Authority (GTA)',
    description: 'Next-Gen Network Defense System: Real-time multi-gigabit traffic monitoring, instant DDoS detection, BGP blackholing & automated mitigation.',
    features: [
      'Multi-gigabit traffic monitoring (NetFlow, sFlow, IPFIX, PCAP)',
      'Instant DDoS attack & protocol anomaly detection',
      'Automated BGP blackholing & dynamic firewall rules',
      'MikroTik RouterOS API & SIEM Integration (Grafana, Prometheus)',
      'Flow-based analytics & compliance auditing dashboards',
      'Ultra-fast, lightweight edge router to core gateway deployment'
    ],
    specifications: {
      'Deployment': 'Edge Routers, Core Network Gateways, Data Centers',
      'Flow Protocols': 'NetFlow v5/v9, sFlow, IPFIX, PCAP',
      'Mitigation Methods': 'BGP Blackholing, Firewall Rules, Custom Webhooks',
      'Hardware Integration': 'MikroTik RouterOS, Cisco, Juniper, Linux Gateways',
      'SIEM & Alerts': 'Grafana, Prometheus, Slack, Email, Custom Webhooks',
      'Performance': 'Multi-gigabit throughput with 0 packet drops'
    },
    priceBasic: 180000,
    pricePro: 280000,
    priceEnterprise: 450000,
    currency: 'HUF',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

const MOCK_REVIEWS = [
  {
    clientName: 'Máté Kovács',
    designation: 'VP of Engineering',
    company: 'Budapest FinTech Labs',
    rating: 5,
    title: 'Flawless Cloud Migration',
    reviewText: 'Servixo migrated our critical microservices to AWS with zero downtime. Their technical precision and speed were outstanding.',
    logoUrl: 'BFL'
  },
  {
    clientName: 'Anna Szabó',
    designation: 'Managing Director',
    company: 'GreenEnergy HU',
    rating: 5,
    title: 'Transformed our Operations',
    reviewText: 'The custom ERP system built by Servixo saved us over 20 hours of manual data entry every single week. Highly recommended!',
    logoUrl: 'GEH'
  },
  {
    clientName: 'Elena Rostova',
    designation: 'CTO',
    company: 'Nexus B2B',
    rating: 4,
    title: 'Excellent Security Auditing',
    reviewText: 'Their penetration testing uncovered critical security vulnerabilities that we were able to fix before launch. Great team of pros!',
    logoUrl: 'NB2B'
  }
];

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@servixo.com' },
    update: {},
    create: {
      email: 'admin@servixo.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created (admin@servixo.com / admin123)');

  // Clear existing data (optional, but good for seed)
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.review.deleteMany();

  // Seed Services
  for (const service of MOCK_SERVICES) {
    await prisma.service.create({
      data: service,
    });
  }
  console.log('Services seeded');

  // Seed Products
  for (const product of MOCK_PRODUCTS) {
    await prisma.product.create({
      data: {
        ...product,
        specifications: product.specifications as any,
      },
    });
  }
  console.log('Products seeded');

  // Seed Reviews
  for (const review of MOCK_REVIEWS) {
    await prisma.review.create({
      data: {
        ...review,
        isApproved: true,
      },
    });
  }
  console.log('Reviews seeded');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
