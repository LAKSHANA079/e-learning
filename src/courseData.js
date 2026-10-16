export const courseData = [
  {
    id: 1,
    name: "Web Development",
    category: "Programming",
    duration: "4 Weeks",
    icon: "💻",
    description: "Master modern web development from semantic HTML5 and CSS3 to advanced JavaScript and responsive web applications.",
    instructor: "David Miller, Senior Frontend Engineer",
    lessons: [
      {
        id: 1,
        title: "HTML5 Semantic Structure & Modern Web Standards",
        duration: "30 mins",
        overview: "Understand the core building blocks of modern web pages. Learn semantic tags, accessibility (a11y), and proper document hierarchy.",
        concepts: [
          "Semantic tags like <header>, <nav>, <main>, <article>, <aside>, <footer> improve SEO and accessibility.",
          "Proper form controls with labels, required attributes, and input types for validation.",
          "Document object model (DOM) tree representation in browser rendering engines."
        ],
        codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Modern Web App</title>
</head>
<body>
  <header>
    <h1>Welcome to EduLearn</h1>
  </header>
  <main>
    <article>
      <h2>Understanding Web Architecture</h2>
      <p>Building accessible and responsive user interfaces.</p>
    </article>
  </main>
</body>
</html>`,
        quizQuestion: "Which HTML5 tag is most appropriate for independent, self-contained content?",
        options: ["<div>", "<article>", "<span>", "<section>"],
        correctAnswer: 1
      },
      {
        id: 2,
        title: "CSS3 Flexbox, CSS Grid & Responsive Design",
        duration: "45 mins",
        overview: "Design dynamic, pixel-perfect user interfaces that adapt gracefully across desktops, tablets, and mobile devices.",
        concepts: [
          "Flexbox for one-dimensional layouts (rows or columns) with justify-content and align-items.",
          "CSS Grid for complex two-dimensional grid layouts with grid-template-columns and gap.",
          "Media queries (@media (max-width: 768px)) for seamless mobile-first responsiveness."
        ],
        codeSnippet: `.dashboard-container {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  gap: 24px;
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}`,
        quizQuestion: "Which property enables a 2D layout in modern CSS?",
        options: ["display: flex", "display: grid", "float: left", "position: absolute"],
        correctAnswer: 1
      },
      {
        id: 3,
        title: "JavaScript ES6+ Fundamentals & DOM Manipulation",
        duration: "50 mins",
        overview: "Bring your pages to life using modern JavaScript. Learn arrow functions, destructuring, promises, and manipulating the browser DOM.",
        concepts: [
          "Variable scope with let and const, avoiding the pitfalls of var.",
          "Event listeners (addEventListener) for click, input, and submit interactions.",
          "Template literals, array methods (map, filter, reduce), and arrow functions."
        ],
        codeSnippet: `const courses = ["Web Dev", "Python", "Cloud"];
const filtered = courses.filter(name => name.includes("Web"));

document.querySelector("#btn-enroll").addEventListener("click", () => {
  console.log("Enrolled in:", filtered[0]);
});`,
        quizQuestion: "Which method creates a new array by filtering elements based on a condition?",
        options: ["forEach()", "filter()", "push()", "splice()"],
        correctAnswer: 1
      },
      {
        id: 4,
        title: "Asynchronous JavaScript & REST API Integration",
        duration: "55 mins",
        overview: "Fetch dynamic data from servers using async/await and promises. Handle errors and load states gracefully.",
        concepts: [
          "JavaScript Event Loop, Microtask queue, and Promises.",
          "Using modern fetch() with async/await syntax.",
          "Handling network latency, HTTP status codes, and try/catch error boundaries."
        ],
        codeSnippet: `async function fetchCourseData(courseId) {
  try {
    const res = await fetch(\`/api/courses/\${courseId}\`);
    if (!res.ok) throw new Error("Network response error");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to load course:", err);
  }
}`,
        quizQuestion: "What keyword is used to wait for a Promise inside an async function?",
        options: ["wait", "await", "defer", "pause"],
        correctAnswer: 1
      },
      {
        id: 5,
        title: "Capstone Project: Production Deployment & Best Practices",
        duration: "60 mins",
        overview: "Integrate everything you have learned into a production-ready web application with clean architecture, optimization, and deployment.",
        concepts: [
          "Code bundling, minification, and Vite/Webpack build pipelines.",
          "Web performance: lazy loading images, caching, and Lighthouse audit metrics.",
          "Deployment to static hosting platforms like Vercel, Netlify, and GitHub Pages."
        ],
        codeSnippet: `// Production build command in modern Vite projects:
// npm run build
// Preview production distribution:
// npm run preview`,
        quizQuestion: "What tool or metric measures web page performance, accessibility, and SEO?",
        options: ["Lighthouse", "Babel", "Prettier", "ESLint"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 2,
    name: "Cyber Security",
    category: "Security",
    duration: "5 Weeks",
    icon: "🔐",
    description: "Learn defense strategies, secure networking, ethical hacking fundamentals, encryption protocols, and vulnerability mitigation.",
    instructor: "Elena Rostova, Certified Ethical Hacker (CEH)",
    lessons: [
      {
        id: 1,
        title: "Cyber Threat Landscape & Common Attack Vectors",
        duration: "35 mins",
        overview: "Understand the modern security landscape, threat actors, phishing, social engineering, and malicious software types.",
        concepts: [
          "Distinguish malware variants: Trojans, ransomware, spyware, and rootkits.",
          "Social engineering tactics like phishing, spear-phishing, and pretexting.",
          "The CIA Triad: Confidentiality, Integrity, and Availability."
        ],
        codeSnippet: `# Identifying suspicious network connection indicators
netstat -ano | findstr ESTABLISHED`,
        quizQuestion: "What does the 'I' in the CIA Triad stand for?",
        options: ["Internet", "Integrity", "Isolation", "Inspection"],
        correctAnswer: 1
      },
      {
        id: 2,
        title: "Network Security, Firewalls & VPN Protocols",
        duration: "40 mins",
        overview: "Secure data in transit across public and private networks using firewalls, IDS/IPS, and virtual private networks.",
        concepts: [
          "OSI model security inspection at Layer 3 (Network) and Layer 7 (Application).",
          "Packet filtering and stateful inspection firewalls.",
          "End-to-end encryption with TLS 1.3 and WireGuard/IPSec VPNs."
        ],
        codeSnippet: `# Example firewall rule blocking inbound unauthorized ports
ufw default deny incoming
ufw allow 443/tcp
ufw enable`,
        quizQuestion: "Which port is standard for secure HTTPS traffic?",
        options: ["80", "443", "21", "22"],
        correctAnswer: 1
      },
      {
        id: 3,
        title: "Cryptography: Symmetric & Asymmetric Encryption",
        duration: "45 mins",
        overview: "Dive into how mathematical ciphers safeguard global communications, passwords, and digital signatures.",
        concepts: [
          "Symmetric encryption (AES-256) using a shared secret key.",
          "Asymmetric encryption (RSA, ECC) utilizing public and private key pairs.",
          "Cryptographic hashing (SHA-256) and salted password hashing (bcrypt, Argon2)."
        ],
        codeSnippet: `// Example password hashing concept with bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 12;
const hashedPassword = await bcrypt.hash("StudentPass2026!", saltRounds);`,
        quizQuestion: "Which algorithm is commonly used for secure password hashing with salt?",
        options: ["MD5", "Argon2 / bcrypt", "Base64", "ROT13"],
        correctAnswer: 1
      },
      {
        id: 4,
        title: "Web Application Security & OWASP Top 10",
        duration: "50 mins",
        overview: "Identify and defend against the most critical web vulnerabilities including SQL Injection, Cross-Site Scripting (XSS), and CSRF.",
        concepts: [
          "Preventing SQL Injection using parameterized queries and prepared statements.",
          "Mitigating XSS using Content Security Policy (CSP) and sanitizing HTML input.",
          "Securing authentication cookies with HttpOnly, Secure, and SameSite attributes."
        ],
        codeSnippet: `// Secure parameterized SQL query preventing injection
const query = "SELECT * FROM users WHERE email = ? AND status = ?";
db.execute(query, [userEmail, "active"]);`,
        quizQuestion: "What is the best defense against SQL injection attacks?",
        options: ["Parameterized queries / Prepared statements", "Hiding the database password", "Using GET requests", "Client-side validation only"],
        correctAnswer: 0
      },
      {
        id: 5,
        title: "Security Hardening, Incident Response & Audit",
        duration: "55 mins",
        overview: "Develop an organizational incident response plan, conduct vulnerability audits, and implement defense-in-depth.",
        concepts: [
          "Incident response phases: Preparation, Detection, Containment, Eradication, and Recovery.",
          "Principle of Least Privilege (PoLP) and Zero Trust Architecture.",
          "Automated security scans using tools like OWASP ZAP and Nessus."
        ],
        codeSnippet: `# Audit active user permissions & sudo access
sudo cat /etc/sudoers
last -n 10`,
        quizQuestion: "What security principle dictates that users receive only the minimum access needed?",
        options: ["Principle of Maximum Exposure", "Principle of Least Privilege", "Single Sign-on", "Public Access"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 3,
    name: "Python Basics",
    category: "Programming",
    duration: "3 Weeks",
    icon: "🐍",
    description: "Learn Python programming from ground up, mastering data structures, functions, OOP, and practical script automation.",
    instructor: "Marcus Chen, Software Architect",
    lessons: [
      {
        id: 1,
        title: "Python Syntax, Variables & Basic Operations",
        duration: "30 mins",
        overview: "Get comfortable with Python's clean, readable syntax, dynamic typing, and fundamental operations.",
        concepts: [
          "Python variables, data types: int, float, str, and bool.",
          "String formatting using modern f-strings (f'Welcome {user}').",
          "Arithmetic, logical, and comparison operators."
        ],
        codeSnippet: `user_name = "Student"
courses_completed = 4
is_graduated = courses_completed >= 4

print(f"Student: {user_name} | Graduated: {is_graduated}")`,
        quizQuestion: "Which character starts a single-line comment in Python?",
        options: ["//", "/*", "#", "--"],
        correctAnswer: 2
      },
      {
        id: 2,
        title: "Control Flow: Conditionals & Iteration Loops",
        duration: "40 mins",
        overview: "Direct program execution using if/elif/else statements and powerful for and while loops.",
        concepts: [
          "Conditional branching with indentation-based code blocks.",
          "Iterating sequences with for...in loops and range().",
          "Controlling iterations with break, continue, and pass."
        ],
        codeSnippet: `scores = [85, 92, 78, 96, 88]
honor_roll = []

for score in scores:
    if score >= 90:
        honor_roll.append(score)

print("Distinction Scores:", honor_roll)`,
        quizQuestion: "What function generates a sequence of numbers commonly used in for loops?",
        options: ["range()", "sequence()", "iterate()", "count()"],
        correctAnswer: 0
      },
      {
        id: 3,
        title: "Python Collections: Lists, Tuples & Dictionaries",
        duration: "45 mins",
        overview: "Master Python's built-in data collections to organize, search, and manipulate complex data.",
        concepts: [
          "Mutable Lists vs Immutable Tuples.",
          "Key-value pairs with Dictionaries for fast O(1) lookups.",
          "List comprehensions for concise, Pythonic data transformations."
        ],
        codeSnippet: `student_profile = {
    "name": "Alex",
    "enrolled": ["Python", "Web Dev"],
    "gpa": 3.9
}

# List comprehension:
squares = [x**2 for x in range(1, 6)]
print(squares) # [1, 4, 9, 16, 25]`,
        quizQuestion: "Which data structure stores key-value pairs in Python?",
        options: ["List", "Dictionary", "Tuple", "Set"],
        correctAnswer: 1
      },
      {
        id: 4,
        title: "Functions, Scope & Error Handling",
        duration: "50 mins",
        overview: "Write reusable, modular code using functions, default arguments, and robust try/except error handling.",
        concepts: [
          "Defining functions with def, parameters, and return statements.",
          "Local vs Global scope and keyword arguments (*args, **kwargs).",
          "Handling exceptions gracefully with try, except, finally."
        ],
        codeSnippet: `def calculate_grade(score, max_score=100):
    try:
        percentage = (score / max_score) * 100
        return f"{percentage:.1f}%"
    except ZeroDivisionError:
        return "Invalid max score"

print(calculate_grade(48, 50)) # 96.0%`,
        quizQuestion: "Which block in Python handles exceptions that occur in a try block?",
        options: ["catch", "except", "error", "handle"],
        correctAnswer: 1
      },
      {
        id: 5,
        title: "Object-Oriented Programming (OOP) & Practical Project",
        duration: "55 mins",
        overview: "Design modular systems using classes, objects, inheritance, and build an automated script project.",
        concepts: [
          "Creating classes with __init__ constructor and self instance reference.",
          "Encapsulation and class inheritance.",
          "Building a practical project: Student Management Automation Script."
        ],
        codeSnippet: `class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.courses = []

    def enroll(self, course_name):
        self.courses.append(course_name)
        print(f"{self.name} enrolled in {course_name}")

s1 = Student("Priya", "EDU-2026")
s1.enroll("Python Basics")`,
        quizQuestion: "What is the standard name of the constructor method in a Python class?",
        options: ["__init__", "constructor()", "create()", "__start__"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 4,
    name: "Artificial Intelligence",
    category: "AI",
    duration: "6 Weeks",
    icon: "🤖",
    description: "Explore Machine Learning, Deep Neural Networks, Natural Language Processing, and Generative AI technologies.",
    instructor: "Dr. Ananya Sharma, AI Research Scientist",
    lessons: [
      {
        id: 1,
        title: "Introduction to AI & Machine Learning Foundations",
        duration: "35 mins",
        overview: "Understand what Artificial Intelligence is, differentiating rule-based systems from modern statistical learning models.",
        concepts: [
          "Difference between Artificial Intelligence, Machine Learning, and Deep Learning.",
          "Supervised learning (labeled data), Unsupervised learning (clustering), and Reinforcement learning.",
          "Training, validation, and testing dataset splits."
        ],
        codeSnippet: `# Scikit-Learn basic train/test split conceptual structure
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)`,
        quizQuestion: "Which type of learning relies on labeled input-output data pairs?",
        options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Zero-shot learning"],
        correctAnswer: 1
      },
      {
        id: 2,
        title: "Regression, Classification & Model Evaluation",
        duration: "45 mins",
        overview: "Train linear models, decision trees, and evaluate predictions using accuracy, precision, recall, and F1-score.",
        concepts: [
          "Linear regression for continuous numeric predictions.",
          "Logistic regression and decision trees for discrete classification.",
          "Overfitting vs Underfitting and the bias-variance tradeoff."
        ],
        codeSnippet: `from sklearn.metrics import accuracy_score, confusion_matrix
# Evaluating model predictions against real labels
acc = accuracy_score(y_true, y_pred)
print(f"Model Accuracy: {acc * 100:.2f}%")`,
        quizQuestion: "What metric is best suited when dealing with imbalanced classification datasets?",
        options: ["Raw Accuracy", "F1-Score / Precision-Recall", "Line count", "Data size"],
        correctAnswer: 1
      },
      {
        id: 3,
        title: "Deep Learning & Neural Network Architectures",
        duration: "50 mins",
        overview: "Explore how artificial neural networks work, forward propagation, loss functions, backpropagation, and gradient descent.",
        concepts: [
          "Perceptrons, hidden layers, and non-linear activation functions (ReLU, Sigmoid, Softmax).",
          "Loss functions (Cross-Entropy, MSE) and optimizers (Adam, SGD).",
          "Convolutional Neural Networks (CNN) for image recognition."
        ],
        codeSnippet: `import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(128, 10)
    
    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))`,
        quizQuestion: "Which activation function is most widely used in modern hidden layers to solve vanishing gradients?",
        options: ["ReLU", "Step function", "Linear", "Constant"],
        correctAnswer: 0
      },
      {
        id: 4,
        title: "Natural Language Processing (NLP) & Transformer Models",
        duration: "55 mins",
        overview: "Understand how computers process human language, from tokenization to attention mechanisms and Transformers.",
        concepts: [
          "Text tokenization, embeddings, and vector similarity.",
          "The Transformer architecture: Self-Attention and multi-head attention.",
          "Large Language Models (LLMs) and Prompt Engineering techniques."
        ],
        codeSnippet: `// Concept of semantic vector search with embeddings
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  return dot / (Math.hypot(...vecA) * Math.hypot(...vecB));
};`,
        quizQuestion: "What key mechanism allowed Transformer models to surpass traditional RNNs?",
        options: ["Self-Attention mechanism", "Random guessing", "Hardcoded regex", "Linear scaling"],
        correctAnswer: 0
      },
      {
        id: 5,
        title: "AI Ethics, Governance & Deploying Intelligent Apps",
        duration: "60 mins",
        overview: "Examine responsible AI development, bias mitigation, privacy considerations, and deploying ML models as scalable APIs.",
        concepts: [
          "Algorithmic fairness, transparency, and data privacy regulations (GDPR/AI Act).",
          "Serving models via REST/gRPC endpoints using FastAPI or Triton.",
          "Monitoring model drift and continuous retraining."
        ],
        codeSnippet: `# Exposing model inference via FastAPI
from fastapi import FastAPI
app = FastAPI()

@app.post("/predict")
def predict_endpoint(input_data: dict):
    prediction = model.predict(input_data["features"])
    return {"prediction": prediction.tolist()}`,
        quizQuestion: "What phenomenon occurs when real-world data distribution changes over time affecting model accuracy?",
        options: ["Data / Concept Drift", "Code rot", "Infinite loop", "Cache hit"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 5,
    name: "Database Management",
    category: "Database",
    duration: "4 Weeks",
    icon: "🗄️",
    description: "Design relational database architectures, master SQL queries, transactions, indexing, and high-performance data storage.",
    instructor: "Robert Vance, Principal Database Architect",
    lessons: [
      {
        id: 1,
        title: "Relational Modeling & Schema Design",
        duration: "35 mins",
        overview: "Learn entity-relationship diagrams (ERDs), primary and foreign keys, and structural table design.",
        concepts: [
          "Primary keys for entity identification and Foreign keys for referential integrity.",
          "Relationships: One-to-One, One-to-Many, and Many-to-Many with junction tables.",
          "Data types: VARCHAR, INT, TIMESTAMP, BOOLEAN, and JSON."
        ],
        codeSnippet: `CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        quizQuestion: "Which constraint ensures that no two records have the same value in a specific column?",
        options: ["CHECK", "UNIQUE / PRIMARY KEY", "DEFAULT", "NULL"],
        correctAnswer: 1
      },
      {
        id: 2,
        title: "SQL Mastery: Filtering, Aggregations & Complex Joins",
        duration: "45 mins",
        overview: "Write powerful SQL queries combining tables using INNER JOIN, LEFT JOIN, GROUP BY, and HAVING.",
        concepts: [
          "Filtering with WHERE vs HAVING on aggregated groups.",
          "Different JOIN mechanics: INNER, LEFT, RIGHT, and FULL OUTER.",
          "Aggregate functions: COUNT, SUM, AVG, MIN, and MAX."
        ],
        codeSnippet: `SELECT 
  c.category, 
  COUNT(e.student_id) AS total_enrolled,
  AVG(e.progress_percent) AS avg_progress
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.category
HAVING total_enrolled > 0;`,
        quizQuestion: "Which JOIN returns all records from the left table and matched records from the right table?",
        options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
        correctAnswer: 1
      },
      {
        id: 3,
        title: "Database Normalization (1NF to 3NF) & Integrity",
        duration: "45 mins",
        overview: "Organize data to minimize redundancy and prevent insert, update, and deletion anomalies.",
        concepts: [
          "First Normal Form (1NF): Atomic values and unique rows.",
          "Second Normal Form (2NF): Elimination of partial functional dependencies.",
          "Third Normal Form (3NF): Elimination of transitive dependencies."
        ],
        codeSnippet: `-- Normalized Student & Enrollment schema
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_date DATE,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);`,
        quizQuestion: "What is the primary goal of database normalization?",
        options: ["Increase redundant copies", "Eliminate data redundancy and anomalies", "Slow down queries", "Remove passwords"],
        correctAnswer: 1
      },
      {
        id: 4,
        title: "Transactions, ACID Properties & Concurrency Control",
        duration: "50 mins",
        overview: "Ensure mission-critical data integrity using database transactions and lock mechanisms.",
        concepts: [
          "ACID principles: Atomicity, Consistency, Isolation, and Durability.",
          "Transaction control commands: BEGIN, COMMIT, and ROLLBACK.",
          "Isolation levels to prevent dirty reads, non-repeatable reads, and phantom reads."
        ],
        codeSnippet: `START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- If any error occurs: ROLLBACK;
COMMIT;`,
        quizQuestion: "What does Atomicity in ACID guarantee?",
        options: ["Operations either all succeed or all roll back", "Data is compressed", "Database never sleeps", "Indexes are alphabetical"],
        correctAnswer: 0
      },
      {
        id: 5,
        title: "Indexing, Performance Optimization & Backup Strategies",
        duration: "55 mins",
        overview: "Speed up queries by orders of magnitude using B-Tree indexes, query execution plans (EXPLAIN), and automated backups.",
        concepts: [
          "How B-Tree and Hash indexes work under the hood.",
          "Analyzing query bottlenecks with EXPLAIN ANALYZE.",
          "Database backup types: Full, differential, and Point-In-Time Recovery (PITR)."
        ],
        codeSnippet: `EXPLAIN ANALYZE 
SELECT * FROM enrollments 
WHERE student_id = 42;

-- Adding an index to speed up foreign key lookups:
CREATE INDEX idx_enrollment_student ON enrollments(student_id);`,
        quizQuestion: "Which SQL command helps inspect the query planner and execution performance?",
        options: ["EXPLAIN / EXPLAIN ANALYZE", "LOOKUP", "SPEED", "ANALYZE_NOW"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 6,
    name: "Cloud Computing",
    category: "Cloud",
    duration: "5 Weeks",
    icon: "☁️",
    description: "Build scalable, highly available cloud infrastructures using virtual machines, containers, serverless, and cloud networking.",
    instructor: "James Wilson, Cloud Solutions Architect",
    lessons: [
      {
        id: 1,
        title: "Cloud Computing Models & Core Architecture",
        duration: "30 mins",
        overview: "Understand the fundamentals of cloud computing, shared responsibility models, and cloud service types.",
        concepts: [
          "Infrastructure as a Service (IaaS), Platform as a Service (PaaS), Software as a Service (SaaS).",
          "Public, private, hybrid, and multi-cloud environments.",
          "Regions, Availability Zones (AZs), and edge locations."
        ],
        codeSnippet: `# Cloud Architecture Concept:
# Global Cloud Provider
#   └── Regions (e.g. us-east-1, eu-west-1)
#         └── Availability Zones (AZ-a, AZ-b, AZ-c)
#               └── Data Centers & Virtual Private Clouds (VPC)`,
        quizQuestion: "Which cloud service model provides virtualized hardware (VMs, storage, network) for full OS control?",
        options: ["SaaS", "IaaS", "PaaS", "FaaS"],
        correctAnswer: 1
      },
      {
        id: 2,
        title: "Virtualization, Containers & Docker Fundamentals",
        duration: "45 mins",
        overview: "Package applications with all their dependencies using lightweight Linux containers and Docker.",
        concepts: [
          "Virtual Machines (hypervisor) vs Containers (shared OS kernel).",
          "Writing efficient multi-stage Dockerfiles.",
          "Container lifecycle: build, tag, push, run, and port forwarding."
        ],
        codeSnippet: `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
        quizQuestion: "What is the primary advantage of containers over traditional virtual machines?",
        options: ["Lighter weight & faster startup sharing host kernel", "Require separate hardware", "Only run on Windows", "No networking possible"],
        correctAnswer: 0
      },
      {
        id: 3,
        title: "Cloud Storage, Object Stores & High Availability Databases",
        duration: "45 mins",
        overview: "Design resilient storage architectures using S3-compatible object stores, block storage, and managed databases.",
        concepts: [
          "Block storage (EBS/SSD) for VM disks vs Object storage (S3) for scalable files.",
          "Storage tiers: Hot, Cold, and Archive / Glacier.",
          "Multi-AZ database replication with automated failover."
        ],
        codeSnippet: `# Uploading course assets to Cloud Object Storage via CLI
aws s3 cp ./certificates/ s3://edulearn-certificates-bucket/ --recursive`,
        quizQuestion: "Which storage type is best for storing millions of images, videos, and static files at scale?",
        options: ["Object Storage (e.g., S3)", "Block Storage (RAM)", "Floppy disk", "Tape drive"],
        correctAnswer: 0
      },
      {
        id: 4,
        title: "Cloud Networking, Load Balancers & Security Groups",
        duration: "50 mins",
        overview: "Route traffic securely using Virtual Private Clouds (VPCs), subnets, NAT gateways, and load balancers.",
        concepts: [
          "Public vs Private subnets and route tables.",
          "Application Load Balancers (ALB) distributing traffic across healthy instances.",
          "Stateful Security Groups vs Stateless Network Access Control Lists (NACLs)."
        ],
        codeSnippet: `# Terraform snippet provisioning a Cloud Virtual Private Cloud
resource "cloud_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "EduLearn-VPC" }
}`,
        quizQuestion: "Which component automatically distributes incoming application traffic across multiple servers?",
        options: ["Load Balancer", "Hard drive", "Keyboard", "Power supply"],
        correctAnswer: 0
      },
      {
        id: 5,
        title: "Serverless Architecture & Automated CI/CD Pipelines",
        duration: "55 mins",
        overview: "Deploy event-driven serverless functions and automate testing and deployment with CI/CD pipelines.",
        concepts: [
          "Serverless computing (AWS Lambda, Cloud Functions) with automatic scaling and pay-per-execution.",
          "Continuous Integration and Continuous Deployment (CI/CD) pipelines.",
          "Infrastructure as Code (IaC) with Terraform and GitOps practices."
        ],
        codeSnippet: `// Serverless cloud function processing student completion
exports.handler = async (event) => {
  const { studentEmail, courseId } = JSON.parse(event.body);
  console.log(\`Issuing certificate for \${studentEmail} on course \${courseId}\`);
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "Certificate Issued" })
  };
};`,
        quizQuestion: "What is the key billing feature of serverless cloud functions?",
        options: ["Pay only for actual execution time and invocations", "Fixed monthly fee regardless of use", "Free forever", "Charges per mouse click"],
        correctAnswer: 0
      }
    ]
  }
];
