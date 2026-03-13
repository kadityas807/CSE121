export interface RoadmapStep {
  title: string;
  description: string;
  skills: string[];
  duration?: string;
}

export interface SkillLevel {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
  intro: string;
  technicalSkills: string[];
  languages: string[];
  tools: string[];
  projects: { title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; description: string; url?: string; tags?: string[] }[];
  roadmap: RoadmapStep[];
  companies: string[];
  salary: {
    entry: string;
    mid: string;
    senior: string;
    avg?: string;
    growth?: string;
  };
  roles: string[];
  interviewTopics: string[];
  certifications: { name: string; platform: string; url: string }[];
  image: string;
  marketDemand: string;
  duration: string;
  topSkills: string[];
  skillLevels: SkillLevel[];
  keywords?: string[];
}

export const domains: Domain[] = [
  {
    id: 'web-dev',
    title: 'Full Stack Web Development',
    description: 'Master modern web architecture from frontend to backend with industry-standard tools and workflows.',
    icon: 'Globe',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGnjwiiniuuiVcv0Mgnh7wHNZYuqIjUXVLeh9oZunzPhabtORiBLbUIQPHJWiiyr-1XCUkhWIXIjlA21ZLK0c_1hAVQNs-MUZ4IbhZ2kcjfcrP7cA3bnf0yxY7M92n_TcJPKwx_TXU1KoqURSP4bMNKEOiCEKPfXbjFtK2gf15H2rypiFE5qXxuM8Q5Et9Z_te2oIM34fGUeTYBseBJTehKKz0ICZsEGvVDmGWEvUr7ufPnjBFIqKoepPAx1AGurkZcGx3odGbVUM',
    intro: 'Web Development is the process of creating websites and applications for the internet. It ranges from simple static pages to complex social media platforms and e-commerce sites.',
    technicalSkills: ['Frontend Development', 'Backend Development', 'Database Management', 'API Design', 'Responsive Design'],
    languages: ['HTML/CSS', 'JavaScript', 'TypeScript', 'Python', 'SQL'],
    tools: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Git', 'Docker'],
    marketDemand: 'Very High',
    duration: '24 Weeks',
    topSkills: ['MERN', 'React', 'Node', 'MongoDB'],
    keywords: ['web', 'frontend', 'backend', 'fullstack', 'javascript', 'react', 'node'],
    skillLevels: [
      { name: 'JavaScript (ES6+)', level: 'Expert' },
      { name: 'React & Ecosystem', level: 'Advanced' },
      { name: 'Node.js / Backend', level: 'Intermediate' },
      { name: 'Database Design', level: 'Advanced' }
    ],
    projects: [
      { title: 'E-Commerce Platform', difficulty: 'Intermediate', description: 'Full MERN stack with Stripe integration, auth, and admin dashboard.', url: 'https://github.com/topics/ecommerce-dashboard', tags: ['React', 'Node.js', 'Stripe'] },
      { title: 'Real-time Chat App', difficulty: 'Advanced', description: 'Socket.io powered messaging app with private rooms and media sharing.', url: 'https://github.com/topics/chat-application', tags: ['Socket.io', 'React'] },
      { title: 'SaaS Dashboard', difficulty: 'Advanced', description: 'Analytical tool with Chart.js, multi-tenant DB structure, and OAuth.', url: 'https://github.com/topics/saas-dashboard', tags: ['Next.js', 'Chart.js'] },
      { title: 'Personal Portfolio', difficulty: 'Beginner', description: 'Next.js 14 blog with Headless CMS (Sanity) and Framer Motion.', url: 'https://github.com/topics/portfolio-website', tags: ['Next.js', 'Sanity'] }
    ],
    roadmap: [
      { title: 'Beginner: Frontend Foundations', description: 'Master the visual structure and styling of the web. Learn semantic HTML5, modern CSS layouts (Grid/Flexbox), and responsive design principles.', skills: ['Semantic HTML', 'Flexbox/Grid', 'Tailwind CSS'], duration: 'Weeks 1-4' },
      { title: 'Intermediate: JavaScript & React', description: 'Bring logic to your pages. Deep dive into ES6+, DOM manipulation, and asynchronous JS. Transition to React for building component-based UIs.', skills: ['ES6+', 'React Hooks', 'State Management'], duration: 'Weeks 5-12' },
      { title: 'Advanced: Backend & Databases', description: 'Learn to build robust server-side applications. Master Node.js, Express, and both SQL and NoSQL database management.', skills: ['Node.js', 'PostgreSQL', 'REST APIs'], duration: 'Weeks 13-20' },
      { title: 'Expert: DevOps & System Design', description: 'Finalize your skills with deployment, CI/CD pipelines, and high-level architectural patterns for scalable systems.', skills: ['Docker', 'AWS', 'Next.js'], duration: 'Weeks 21-24' }
    ],
    companies: ['Google', 'Meta', 'Amazon', 'Netflix', 'Stripe', 'Airbnb'],
    salary: { entry: '₹6L - ₹12L', mid: '₹15L - ₹30L', senior: '₹40L+', avg: '$115k - $160k', growth: '+12% YoY' },
    roles: ['Frontend Engineer', 'Backend Developer', 'Full Stack Developer', 'UI Engineer'],
    interviewTopics: ['Data Structures & Algorithms', 'System Design Fundamentals', 'JS Internals (Event Loop, Closures)', 'React Performance Optimization'],
    certifications: [
      { name: 'Meta Front-End Developer', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
      { name: 'AWS Certified Developer', platform: 'AWS', url: 'https://aws.amazon.com/certification/certified-developer-associate/' },
      { name: 'Responsive Web Design', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' }
    ]
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Master the science of training computers to learn from data and make intelligent decisions.',
    icon: 'Brain',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw0fqM3bZ4hTwVwRYcDLctPgoSVvnI637xisFowo6KaSiBfpXYsObJnzLgqhwxi5Qi2JkMd7x_SMuNtZrd34pGzAebE_zFJ8tox0C2YCtpm7lU_hjA8z2ZEijYfiEcdaLQz2eEhX4jUIF2l3AXCSqREVssUgluBq2gQ1gEcT5Lrnj5wR6KyCXYo5CKdsRFaYSPQ092SsEEuycNoQHp6oOFDWkRln3Zx1A06iEAiFMx17apmgF3yKvtyNp5ejsdaRkvbgmWMoc8_cs',
    intro: 'Artificial Intelligence (AI) and Machine Learning (ML) represent the frontier of modern technology. AI is the broad field of creating intelligent machines, while ML is a subset focused on algorithms that improve automatically through experience.',
    technicalSkills: ['Statistical Modeling', 'Neural Networks', 'Deep Learning', 'Natural Language Processing', 'Computer Vision'],
    languages: ['Python', 'R', 'C++', 'Julia'],
    tools: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter'],
    marketDemand: 'Very High',
    duration: '28 Weeks',
    topSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP'],
    keywords: ['ai', 'ml', 'artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'data science', 'ai and ml', 'ai & ml'],
    skillLevels: [
      { name: 'Python Programming', level: 'Expert' },
      { name: 'Linear Algebra', level: 'Advanced' },
      { name: 'Scikit-Learn', level: 'Advanced' },
      { name: 'PyTorch / TensorFlow', level: 'Intermediate' }
    ],
    projects: [
      { title: 'Image Classifier', difficulty: 'Intermediate', description: 'Build a Convolutional Neural Network (CNN) to identify objects in images using CIFAR-10 dataset.', url: 'https://github.com/topics/image-classification', tags: ['Computer Vision', 'PyTorch'] },
      { title: 'Sentiment Analysis', difficulty: 'Beginner', description: 'Analyze Twitter data to classify public opinion on tech brands using NLP techniques.', url: 'https://github.com/topics/sentiment-analysis', tags: ['NLP', 'Scikit-Learn'] },
      { title: 'Recommendation Engine', difficulty: 'Advanced', description: 'Build a system like Netflix or Amazon recommendations.', url: 'https://github.com/topics/recommendation-system', tags: ['Deep Learning', 'Collaborative Filtering'] }
    ],
    roadmap: [
      { title: 'Foundations', description: 'Python, Statistics, Probability, and basic Calculus.', skills: ['Matrix Ops', 'Optimization', 'Statistics'], duration: 'Weeks 1-4' },
      { title: 'Supervised Learning', description: 'Regression, Decision Trees, SVMs, and Scikit-Learn.', skills: ['Regression', 'Clustering', 'Decision Trees'], duration: 'Weeks 5-10' },
      { title: 'Deep Learning', description: 'Neural Networks, CNNs, RNNs, and PyTorch frameworks.', skills: ['CNNs', 'RNNs', 'Transformers'], duration: 'Weeks 11-18' },
      { title: 'MLOps', description: 'Deploying and monitoring models.', skills: ['Model Serving', 'Data Pipelines', 'A/B Testing'], duration: 'Weeks 19-28' }
    ],
    companies: ['OpenAI', 'Google DeepMind', 'NVIDIA', 'Tesla', 'Microsoft'],
    salary: { entry: '₹8L - ₹15L', mid: '₹20L - ₹45L', senior: '₹60L+', avg: '$145,000', growth: '+22% YoY' },
    roles: ['ML Engineer', 'Data Scientist', 'AI Researcher', 'Computer Vision Engineer'],
    interviewTopics: ['ML Fundamentals', 'Probability', 'Algorithm Design', 'Coding in Python'],
    certifications: [
      { name: 'Machine Learning Specialization', platform: 'DeepLearning.AI', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { name: 'TensorFlow Developer Certificate', platform: 'Google', url: 'https://www.tensorflow.org/certificate' },
      { name: 'AI Engineering Professional Certificate', platform: 'IBM', url: 'https://www.coursera.org/professional-certificates/ai-engineer' }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Protect systems, networks, and data from digital attacks.',
    icon: 'Shield',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbIk3pomzDZpv6fd3qXn-9go8IIW_DEj2SDrrkAw_QDBXqSRxJ0VOqhXq2rl2FDpkk8SPfK7oxdqX_NljH8NDZpFke_whk-dumfaircqFOwHOALT77i-O81_qybCU3WBW6UJu1i9CZ-5ivMTy5M0Ck6t8D2YuZheMhoEzlOtaWRRz6R5ftzqKcXn51zZXiIZkmUGkfEpcptSayoeBaXw0uf5cRbR3Jsq8NGhSiXL_osgfzWGiqSxsCVXnm1grCCP5aSNgH2c9ISRk',
    intro: 'Cybersecurity is the practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious attacks.',
    technicalSkills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Incident Response', 'Cloud Security'],
    languages: ['Python', 'Bash', 'C', 'SQL', 'PowerShell'],
    tools: ['Wireshark', 'Metasploit', 'Burp Suite', 'Nmap', 'Kali Linux'],
    marketDemand: 'High',
    duration: '20 Weeks',
    topSkills: ['Ethical Hacking', 'Network Security', 'SIEM', 'Kali Linux'],
    keywords: ['security', 'hacking', 'cyber', 'network security', 'ethical hacking', 'infosec'],
    skillLevels: [
      { name: 'Network Protocols', level: 'Expert' },
      { name: 'Ethical Hacking', level: 'Advanced' },
      { name: 'Incident Response', level: 'Intermediate' },
      { name: 'Cloud Security', level: 'Intermediate' }
    ],
    projects: [
      { title: 'Network Scanner', difficulty: 'Beginner', description: 'A tool to identify active devices on a network.', url: 'https://github.com/topics/network-scanner', tags: ['Python', 'Nmap'] },
      { title: 'Vulnerability Lab', difficulty: 'Intermediate', description: 'Setting up a controlled environment to test exploits.', url: 'https://github.com/topics/vulnerability-assessment', tags: ['Metasploit', 'VirtualBox'] },
      { title: 'Encryption Tool', difficulty: 'Advanced', description: 'A secure file encryption/decryption utility.', url: 'https://github.com/topics/encryption-decryption', tags: ['Cryptography', 'C++'] }
    ],
    roadmap: [
      { title: 'Networking Basics', description: 'Understand how data moves.', skills: ['TCP/IP', 'DNS', 'HTTP/S'], duration: 'Weeks 1-4' },
      { title: 'Security Fundamentals', description: 'CIA Triad and basic threats.', skills: ['Access Control', 'Malware Types', 'Risk Mgmt'], duration: 'Weeks 5-8' },
      { title: 'Offensive/Defensive', description: 'Penetration testing or SOC operations.', skills: ['Ethical Hacking', 'SIEM', 'Firewalls'], duration: 'Weeks 9-16' },
      { title: 'Compliance & Audit', description: 'Governance and standards.', skills: ['ISO 27001', 'GDPR', 'SOC2'], duration: 'Weeks 17-20' }
    ],
    companies: ['CrowdStrike', 'Palo Alto Networks', 'Cisco', 'FireEye', 'IBM'],
    salary: { entry: '₹5L - ₹10L', mid: '₹12L - ₹25L', senior: '₹35L+', avg: '$120,000', growth: '+15% YoY' },
    roles: ['Security Analyst', 'Penetration Tester', 'Security Architect', 'CISO'],
    interviewTopics: ['Network Protocols', 'OWASP Top 10', 'Encryption Algorithms', 'Linux/Unix'],
    certifications: [
      { name: 'CompTIA Security+', platform: 'CompTIA', url: 'https://www.comptia.org/certifications/security' },
      { name: 'Certified Ethical Hacker (CEH)', platform: 'EC-Council', url: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' },
      { name: 'Google Cybersecurity Certificate', platform: 'Google', url: 'https://grow.google/certificates/cybersecurity/' }
    ]
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    description: 'Manage and deploy scalable infrastructure on the cloud.',
    icon: 'Cloud',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQRMLzVso5jTsJuWGNgcRAo0IDQr0Fh-YzJlfbTcLdg7niMITOlo3a-_w3PVxTFdJ8r8NiC-UOjMSn-SjHOvvjlIRtdR-EBS7OXqaYOTnVck4Rbt17mpA0r32J4IiE1WvLaAKF-MbRStJHCmn94KUxOWo1eice3C-ycvHg4plw3bQLZEEe24BoFPzD8Fe26daN69GivcfyHKNc_ByjzSvUulcvdDuOslodQVfXq8QyPbvz24eCd_PRapwjk7k4QP-r-8W8pXxqxec',
    intro: 'Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.',
    technicalSkills: ['Cloud Architecture', 'Serverless Computing', 'Virtualization', 'Containerization', 'Infrastructure as Code'],
    languages: ['Python', 'Go', 'YAML', 'HCL (Terraform)'],
    tools: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Kubernetes'],
    marketDemand: 'Very High',
    duration: '22 Weeks',
    topSkills: ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure', 'serverless'],
    skillLevels: [
      { name: 'Cloud Architecture', level: 'Advanced' },
      { name: 'Infrastructure as Code', level: 'Advanced' },
      { name: 'Containerization', level: 'Expert' },
      { name: 'Serverless', level: 'Intermediate' }
    ],
    projects: [
      { title: 'Static Site on S3', difficulty: 'Beginner', description: 'Host a website using cloud storage.', url: 'https://github.com/topics/aws-s3-static-website', tags: ['AWS', 'S3'] },
      { title: 'Serverless API', difficulty: 'Intermediate', description: 'Build an API using AWS Lambda and API Gateway.', url: 'https://github.com/topics/serverless-api', tags: ['Lambda', 'API Gateway'] },
      { title: 'Multi-region Cluster', difficulty: 'Advanced', description: 'Deploy a global app using Kubernetes.', url: 'https://github.com/topics/kubernetes-cluster', tags: ['K8s', 'Terraform'] }
    ],
    roadmap: [
      { title: 'Cloud Basics', description: 'IaaS, PaaS, SaaS concepts.', skills: ['Cloud Providers', 'Billing', 'Regions/Zones'], duration: 'Weeks 1-4' },
      { title: 'Core Services', description: 'Compute, Storage, Networking.', skills: ['EC2/S3/VPC', 'IAM', 'Databases'], duration: 'Weeks 5-10' },
      { title: 'Automation', description: 'Infrastructure as Code.', skills: ['Terraform', 'CloudFormation', 'Ansible'], duration: 'Weeks 11-16' },
      { title: 'Cloud Native', description: 'Microservices and Serverless.', skills: ['Docker', 'K8s', 'Serverless'], duration: 'Weeks 17-22' }
    ],
    companies: ['Amazon (AWS)', 'Microsoft', 'Google', 'Oracle', 'DigitalOcean'],
    salary: { entry: '₹6L - ₹12L', mid: '₹18L - ₹35L', senior: '₹45L+', avg: '$130,000', growth: '+18% YoY' },
    roles: ['Cloud Architect', 'Cloud Engineer', 'Solutions Architect', 'SRE'],
    interviewTopics: ['Cloud Design Patterns', 'Scalability', 'Disaster Recovery', 'Networking'],
    certifications: [
      { name: 'AWS Solutions Architect', platform: 'AWS', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/' },
      { name: 'Azure Fundamentals (AZ-900)', platform: 'Microsoft', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/' },
      { name: 'Google Cloud Digital Leader', platform: 'Google Cloud', url: 'https://cloud.google.com/learn/certification/cloud-digital-leader' }
    ]
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Bridge the gap between development and operations for faster delivery.',
    icon: 'Infinity',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0gZtXMRoaTEHY58ED468EmM18_9f4LJ5Lb9eyO_-zTthWUzlApQJblV24By32pn4q8IA1zek-sN_eMq5cxeAUOpD0Zw15iupGR92T2ZgFMmr5U2JIWHso9xfVS1arHuOMEBpRH3j93Povdp31pE4BH3V7vxpJ9-9qPUYVnaRIVXXxiu1770jz81CYOiwCxt9JFfVo7hcsz3y5lDZh5egVB1AKSB-g7n7xSLRWz0zOy4dh3zqstWs6S-LNsmfNWXUIPoHhZstVPTA',
    intro: 'DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery.',
    technicalSkills: ['CI/CD Pipelines', 'Site Reliability', 'Monitoring & Logging', 'Security (DevSecOps)', 'Automation'],
    languages: ['Python', 'Go', 'Bash', 'Ruby'],
    tools: ['Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    marketDemand: 'Very High',
    duration: '24 Weeks',
    topSkills: ['CI/CD', 'Kubernetes', 'Docker', 'Jenkins'],
    keywords: ['devops', 'cicd', 'automation', 'jenkins', 'docker', 'kubernetes', 'sre'],
    skillLevels: [
      { name: 'CI/CD Pipelines', level: 'Expert' },
      { name: 'Container Orchestration', level: 'Advanced' },
      { name: 'Monitoring & Logging', level: 'Advanced' },
      { name: 'Automation Scripting', level: 'Intermediate' }
    ],
    projects: [
      { title: 'CI/CD Pipeline', difficulty: 'Beginner', description: 'Automate testing and deployment of a simple app.', url: 'https://github.com/topics/cicd-pipeline', tags: ['GitHub Actions', 'Docker'] },
      { title: 'Monitoring Dashboard', difficulty: 'Intermediate', description: 'Setup Prometheus and Grafana for a cluster.', url: 'https://github.com/topics/monitoring-dashboard', tags: ['Prometheus', 'Grafana'] },
      { title: 'Auto-scaling System', difficulty: 'Advanced', description: 'Build a system that scales based on traffic.', url: 'https://github.com/topics/autoscaling', tags: ['K8s', 'HPA'] }
    ],
    roadmap: [
      { title: 'Linux & Scripting', description: 'Master the command line.', skills: ['Bash', 'File Systems', 'Process Mgmt'], duration: 'Weeks 1-4' },
      { title: 'Source Control', description: 'Advanced Git workflows.', skills: ['Branching', 'Merging', 'Hooks'], duration: 'Weeks 5-8' },
      { title: 'CI/CD & Containers', description: 'Automate everything.', skills: ['Docker', 'Jenkins/Actions', 'Artifacts'], duration: 'Weeks 9-16' },
      { title: 'Orchestration', description: 'Manage complex systems.', skills: ['Kubernetes', 'Helm', 'Service Mesh'], duration: 'Weeks 17-24' }
    ],
    companies: ['Red Hat', 'HashiCorp', 'GitLab', 'Atlassian', 'Salesforce'],
    salary: { entry: '₹7L - ₹14L', mid: '₹20L - ₹40L', senior: '₹50L+', avg: '$135,000', growth: '+20% YoY' },
    roles: ['DevOps Engineer', 'Platform Engineer', 'SRE', 'Build Engineer'],
    interviewTopics: ['CI/CD Principles', 'Containerization', 'Infrastructure as Code', 'Troubleshooting'],
    certifications: [
      { name: 'Certified Kubernetes Administrator (CKA)', platform: 'CNCF', url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/' },
      { name: 'AWS DevOps Engineer Professional', platform: 'AWS', url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/' },
      { name: 'HashiCorp Certified: Terraform Associate', platform: 'HashiCorp', url: 'https://www.hashicorp.com/certification/terraform-associate' }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Extract insights and knowledge from structured and unstructured data.',
    icon: 'BarChart',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgamWrQvrLz2x9UHBnyFoziatwRtH7xZ3Cb6r8EY7BsCMK6xmFPZWqpsGQMalFNXFFo_0LYXL-aeDoOcrT5lIL8iqt4zRAD0W2PShCvnirqMc2t_T4zhhOXAnKOgOh7oK65LUkm8QV_oYxyDeBVXMgSTpAk-dRKpT6_HMfTjArduQOjfqy9ZyMkAzn_FKUv5BUZZfzRCiyIuZVkn0S-PTOPZOwyrr5MEusIlietGz0LS4yPViloVZnn-VFKBKfeu9R7EQRr5-myOs',
    intro: 'Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from noisy, structured and unstructured data.',
    technicalSkills: ['Data Analysis', 'Data Visualization', 'Statistical Inference', 'Big Data Technologies', 'Feature Engineering'],
    languages: ['Python', 'R', 'SQL', 'Scala'],
    tools: ['Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Pandas', 'Matplotlib'],
    marketDemand: 'High',
    duration: '26 Weeks',
    topSkills: ['Statistics', 'Pandas', 'SQL', 'Tableau'],
    keywords: ['data', 'analytics', 'statistics', 'visualization', 'sql', 'pandas', 'big data'],
    skillLevels: [
      { name: 'Statistical Analysis', level: 'Expert' },
      { name: 'Data Manipulation', level: 'Advanced' },
      { name: 'Big Data Tools', level: 'Intermediate' },
      { name: 'Data Visualization', level: 'Advanced' }
    ],
    projects: [
      { title: 'Sales Analysis', difficulty: 'Beginner', description: 'Analyze retail data to find trends.', url: 'https://github.com/topics/sales-analysis', tags: ['Pandas', 'Matplotlib'] },
      { title: 'Customer Segmentation', difficulty: 'Intermediate', description: 'Group customers using clustering algorithms.', url: 'https://github.com/topics/customer-segmentation', tags: ['Scikit-Learn', 'K-Means'] },
      { title: 'Stock Price Predictor', difficulty: 'Advanced', description: 'Use time-series analysis for forecasting.', url: 'https://github.com/topics/stock-price-prediction', tags: ['LSTM', 'TensorFlow'] }
    ],
    roadmap: [
      { title: 'Data Foundations', description: 'Excel, SQL, and basic Python.', skills: ['Data Cleaning', 'SQL Queries', 'Pandas'], duration: 'Weeks 1-4' },
      { title: 'Statistics', description: 'Descriptive and Inferential.', skills: ['Hypothesis Testing', 'Probability', 'Distributions'], duration: 'Weeks 5-10' },
      { title: 'Visualization', description: 'Tell stories with data.', skills: ['Matplotlib/Seaborn', 'Tableau', 'Dashboards'], duration: 'Weeks 11-16' },
      { title: 'Big Data', description: 'Handling massive datasets.', skills: ['Spark', 'Hadoop', 'NoSQL'], duration: 'Weeks 17-26' }
    ],
    companies: ['Walmart', 'JPMorgan Chase', 'Uber', 'LinkedIn', 'Spotify'],
    salary: { entry: '₹6L - ₹13L', mid: '₹18L - ₹38L', senior: '₹50L+', avg: '$125,000', growth: '+10% YoY' },
    roles: ['Data Scientist', 'Data Analyst', 'Business Intelligence Developer', 'Data Engineer'],
    interviewTopics: ['Statistics', 'SQL Challenges', 'Case Studies', 'ML Basics'],
    certifications: [
      { name: 'IBM Data Science Professional', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-data-science' },
      { name: 'Google Data Analytics Certificate', platform: 'Google', url: 'https://grow.google/certificates/data-analytics/' },
      { name: 'Azure Data Scientist Associate', platform: 'Microsoft', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/' }
    ]
  }
];


