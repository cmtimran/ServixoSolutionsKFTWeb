import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { MOCK_SERVICES } from '@/lib/mockData';

export async function GET() {
  try {
    // 1. Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'admin@servixo.com' },
      update: {},
      create: {
        email: 'admin@servixo.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    // 2. Services
    for (const service of MOCK_SERVICES) {
      await prisma.service.upsert({
        where: { slug: service.slug },
        update: {},
        create: {
          title: service.title,
          slug: service.slug,
          description: service.description,
          content: service.content,
          category: service.category,
          benefits: service.benefits,
          technologies: service.technologies,
          faqs: service.faqs
        }
      });
    }

    // 3. Products
    const ALL_PRODUCTS = [
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
        slug: 'starter-kit',
        title: 'Business Starter Kit',
        description: 'Everything you need to launch and automate your business online quickly.',
        features: [
          'Custom Domain & Hosting Setup',
          'Landing Page & Contact Integration',
          'Basic Analytics & User Dashboard',
          'Secure Authentication & Payment Gateway'
        ],
        specifications: {
          'Hosting': '1 Year Included (Cloudflare / Vercel)',
          'Support': 'Email & WhatsApp Support',
          'Database': 'PostgreSQL'
        },
        priceBasic: 120000,
        pricePro: 180000,
        priceEnterprise: 250000,
        currency: 'HUF',
        images: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
        ]
      },
      {
        slug: 'enterprise-suite',
        title: 'Enterprise Management Suite',
        description: 'A comprehensive ERP & CRM solution for large scale distributed operations.',
        features: [
          'Full HR & Payroll Module',
          'Finance & Accounting Tracking',
          'Fixed Asset & Fleet Management',
          'Custom BI Reporting & Multi-branch support'
        ],
        specifications: {
          'Deployment': 'Cloud, Hybrid or On-Premise',
          'Support': '24/7 Dedicated Account Manager',
          'Scalability': 'Multi-region clustering'
        },
        priceBasic: 350000,
        pricePro: 550000,
        priceEnterprise: 950000,
        currency: 'HUF',
        images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
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

    for (const prod of ALL_PRODUCTS) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          title: prod.title,
          description: prod.description,
          features: prod.features,
          specifications: prod.specifications as any,
          priceBasic: prod.priceBasic,
          pricePro: prod.pricePro,
          priceEnterprise: prod.priceEnterprise,
          currency: prod.currency,
          images: prod.images
        },
        create: {
          slug: prod.slug,
          title: prod.title,
          description: prod.description,
          features: prod.features,
          specifications: prod.specifications as any,
          priceBasic: prod.priceBasic,
          pricePro: prod.pricePro,
          priceEnterprise: prod.priceEnterprise,
          currency: prod.currency,
          images: prod.images
        }
      });
    }

    // 4. Quotes (Since Quotes don't have unique non-ID fields naturally, we just count them and add if none exist)
    const quoteCount = await prisma.quote.count();
    if (quoteCount === 0) {
      await prisma.quote.createMany({
        data: [
          {
            clientName: 'Máté Kovács',
            clientEmail: 'mate@example.com',
            clientPhone: '+36301234567',
            companyName: 'Budapest FinTech',
            projectTypes: ['Cloud', 'Software'],
            budgetRange: '50k-100k',
            timeline: '3-6 months',
            projectDescription: 'We need to migrate our legacy monolith to microservices on AWS.',
            status: 'PENDING'
          },
          {
            clientName: 'Anna Szabó',
            clientEmail: 'anna@example.com',
            clientPhone: '+36201234567',
            companyName: 'GreenEnergy HU',
            projectTypes: ['Software'],
            budgetRange: '15k-50k',
            timeline: '1-3 months',
            projectDescription: 'Need an internal portal for tracking solar panel installations.',
            status: 'APPROVED'
          }
        ]
      });
    }

    // 5. Subscriptions
    const subCount = await prisma.subscription.count();
    if (subCount === 0) {
      await prisma.subscription.createMany({
        data: [
          { email: 'newsletter1@example.com' },
          { email: 'newsletter2@example.com' },
          { email: 'marketing_lead@example.com' },
        ]
      });
    }

    // 6. Reviews
    const reviewCount = await prisma.review.count();
    if (reviewCount === 0) {
      await prisma.review.createMany({
        data: [
          {
            clientName: 'David Miller',
            designation: 'CTO',
            company: 'Nexus B2B',
            rating: 5,
            title: 'Exceptional Service',
            reviewText: 'Servixo completely transformed our IT infrastructure. Highly recommended!',
            isApproved: true
          },
          {
            clientName: 'Sarah Jenkins',
            designation: 'Operations Director',
            company: 'Logistics Pro',
            rating: 4,
            title: 'Solid delivery',
            reviewText: 'Great communication and solid software delivery.',
            isApproved: false
          }
        ]
      });
    }

    // 7. Legal Settings
    const privacyPolicyHTML = `
<h1>Privacy Policy</h1>
<p><strong>Effective Date:</strong> 2026-07-30</p>
<p><strong>Company Name:</strong> Servixo Solutions KFT</p>
<p><strong>Contact Email:</strong> servixokft@gmail.com</p>
<p>Welcome to Servixo Solutions KFT ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.</p>
<p>This Privacy Policy applies to all information collected through our website (and our services), as well as any related services, sales, marketing, or events.</p>
<h2>1. Information We Collect</h2>
<h3>Personal Information You Disclose to Us</h3>
<p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or when you contact us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
<ul>
<li><strong>Names and Contact Data:</strong> We collect your first and last name, email address, postal address, phone number, and other similar contact data.</li>
<li><strong>Credentials:</strong> We collect passwords, password hints, and similar security information used for authentication and account access.</li>
<li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number and the security code associated with your payment instrument. Payment data is processed by our secure payment processors (e.g., Stripe).</li>
</ul>
<h3>Information Automatically Collected</h3>
<p>We automatically collect certain information when you visit, use, or navigate the website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our website, and other technical information.</p>
<h2>2. How We Use Your Information</h2>
<p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive:</p>
<ul>
<li><strong>To facilitate account creation and logon process.</strong></li>
<li><strong>To post testimonials:</strong> We post testimonials on our website that may contain personal information. Prior to posting a testimonial, we will obtain your consent to use your name and testimonial.</li>
<li><strong>Request feedback:</strong> We may use your information to request feedback and to contact you about your use of our website.</li>
<li><strong>To enable user-to-user communications:</strong> We may use your information in order to enable user-to-user communications with each user's consent.</li>
<li><strong>To manage user accounts:</strong> We may use your information for the purposes of managing our account and keeping it in working order.</li>
<li><strong>To send administrative information to you:</strong> We may use your personal information to send you product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
<li><strong>To protect our services:</strong> We may use your information as part of our efforts to keep our website safe and secure (for example, for fraud monitoring and prevention).</li>
<li><strong>To respond to legal requests and prevent harm:</strong> If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.</li>
</ul>
<h2>3. Will Your Information Be Shared With Anyone?</h2>
<p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis:</p>
<ul>
<li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
<li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
<li><strong>Performance of a Contract:</strong> Where we have entered into a contract with you, we may process your personal information to fulfill the terms of our contract.</li>
<li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
</ul>
<h2>4. Do We Use Cookies and Other Tracking Technologies?</h2>
<p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
<h2>5. General Data Protection Regulation (GDPR) Rights</h2>
<p>As a company based in the European Union (Hungary), Servixo Solutions KFT complies fully with the GDPR. If you are a resident of the European Economic Area (EEA) or United Kingdom (UK), you have certain data protection rights:</p>
<ul>
<li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
<li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
<li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
<li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
<li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
<li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
</ul>
<h2>6. How Long Do We Keep Your Information?</h2>
<p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).</p>
<h2>7. How Do We Keep Your Information Safe?</h2>
<p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
<h2>8. Updates to This Policy</h2>
<p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Effective Date" and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
<h2>9. Contact Us</h2>
<p>If you have questions or comments about this notice, you may email us at servixokft@gmail.com or by post to:</p>
<p><strong>Servixo Solutions KFT</strong><br>
Rákóczi út 63<br>
Budapest 1081, Hungary</p>
    `;
    const termsPoliciesHTML = `
<h1>Terms and Policies</h1>
<p><strong>Effective Date:</strong> 2026-07-30</p>
<p><strong>Company Name:</strong> Servixo Solutions KFT</p>
<hr>
<h2>1. Payment & Refund Policy</h2>
<p>At Servixo Solutions KFT, we strive to ensure a transparent and fair payment process for all our clients.</p>
<h3>1.1 Payment Terms</h3>
<ul>
<li><strong>Custom Services (Projects):</strong> Payments for custom software development, cloud migration, and other IT services are typically divided into milestones. A non-refundable initial deposit (e.g., 30%) is required to commence work. Subsequent payments are tied to the completion of specific project milestones as outlined in your individual contract.</li>
<li><strong>Digital Products & Subscriptions:</strong> Payments for ready-made software, templates, or SaaS subscriptions are billed upfront on a monthly or annual basis via our secure payment gateway (e.g., Stripe).</li>
</ul>
<h3>1.2 Refund Policy</h3>
<ul>
<li><strong>Custom Services:</strong> Because custom services require dedicated time and resources, payments made for completed milestones are generally non-refundable. If a project is canceled by the client before completion, the client will be billed for the work completed up to the cancellation date. If Servixo Solutions KFT fails to deliver the agreed-upon scope, a partial or full refund may be issued at our discretion following a review.</li>
<li><strong>Digital Products:</strong> We offer a <strong>14-day money-back guarantee</strong> for our digital products. If you are unsatisfied with a product, you may request a full refund within 14 days of purchase, provided the product has not been extensively used or modified.</li>
<li><strong>Subscriptions:</strong> You may cancel your subscription at any time. Cancellations will take effect at the end of the current billing cycle. We do not provide pro-rated refunds for unused days within an active billing cycle unless required by EU consumer law.</li>
</ul>
<hr>
<h2>2. Service Policy (Terms of Service)</h2>
<p>This section governs the provision of custom IT and consulting services by Servixo Solutions KFT.</p>
<h3>2.1 Project Scope and Variations</h3>
<p>All services will be delivered according to the agreed-upon Statement of Work (SOW) or project brief. Any requests outside the original scope (Scope Creep) will be evaluated and subject to additional timelines and costs, which will be mutually agreed upon in writing before implementation.</p>
<h3>2.2 Client Responsibilities</h3>
<p>The client agrees to provide timely feedback, necessary access (e.g., server credentials, APIs), and required assets to ensure the project stays on schedule. Delays caused by the client may result in adjusted timelines.</p>
<h3>2.3 Intellectual Property (IP) Rights</h3>
<p>Upon receipt of full and final payment, all Intellectual Property rights for the custom software or solution developed specifically for the client will be transferred to the client. Servixo Solutions KFT retains the right to use any underlying open-source libraries, generic frameworks, or background technology developed prior to the project.</p>
<h3>2.4 Support and Maintenance</h3>
<p>Post-launch support and maintenance are not included in the standard development cost unless explicitly stated in the contract. We offer separate Support & Maintenance Retainers for ongoing monitoring, updates, and bug fixes.</p>
<hr>
<h2>3. Product Policy (Digital Goods & Software)</h2>
<p>This section governs the purchase and use of ready-made digital products, scripts, and software developed by Servixo Solutions KFT.</p>
<h3>3.1 License to Use</h3>
<p>When you purchase a digital product from us, you are granted a non-exclusive, non-transferable license to use the software for your own personal or business purposes.</p>
<h3>3.2 Restrictions</h3>
<p>You may not:</p>
<ul>
<li>Resell, redistribute, or sublicense the product as your own.</li>
<li>Reverse-engineer, decompile, or attempt to extract the source code of proprietary components.</li>
<li>Use the product for any illegal, unethical, or malicious activities.</li>
</ul>
<h3>3.3 Product Updates</h3>
<p>Purchasers of digital products may receive free updates for a specific period (e.g., 1 year) after purchase. After this period, a renewal fee may be required to continue receiving updates and technical support.</p>
<h3>3.4 Warranty Disclaimer</h3>
<p>Digital products are provided "as is" without warranty of any kind, either express or implied. While we thoroughly test our products, we do not guarantee that they will function uninterrupted or be completely error-free in every unique server environment.</p>
<hr>
<p><em>If you have any specific legal requirements or custom SLAs, please refer to your master service agreement (MSA) signed with our team.</em></p>
    `;

    await prisma.setting.upsert({
      where: { key: 'privacy_policy_content' },
      update: { value: privacyPolicyHTML },
      create: { key: 'privacy_policy_content', value: privacyPolicyHTML },
    });

    await prisma.setting.upsert({
      where: { key: 'terms_and_policies_content' },
      update: { value: termsPoliciesHTML },
      create: { key: 'terms_and_policies_content', value: termsPoliciesHTML },
    });

    // 8. Contact Settings
    await prisma.setting.upsert({
      where: { key: 'contactEmail' },
      update: { value: 'servixokft@gmail.com' },
      create: { key: 'contactEmail', value: 'servixokft@gmail.com' },
    });

    await prisma.setting.upsert({
      where: { key: 'contactPhone' },
      update: { value: '+36 20 281 1466' },
      create: { key: 'contactPhone', value: '+36 20 281 1466' },
    });

    await prisma.setting.upsert({
      where: { key: 'companyAddress' },
      update: { value: 'Rákóczi út 63\nBudapest 1081, Hungary' },
      create: { key: 'companyAddress', value: 'Rákóczi út 63\nBudapest 1081, Hungary' },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Database successfully seeded with User, Services, Products, Quotes, Subscriptions, and Reviews!'
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to seed database', details: errorMessage }, { status: 500 });
  }
}
